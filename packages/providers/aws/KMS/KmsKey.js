const assert = require("assert");
const { map, pipe, tap, get, eq, assign, pick, omit } = require("rubico");
const { defaultsDeep, filterOut } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { assignPolicyAccountAndRegion } = require("../IAM/IAMCommon");

const {
  tagResource,
  untagResource,
  omitProperties,
  pickId,
  findId,
  findName,
  isInstanceUp,
  getById,
  getList,
  update,
  destroy,
  cannotBeDeleted,
  managedByOther,
  putKeyPolicy,
  assignTags,
} = require("./KMSCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createAlias-property
const createAlias = ({ endpoint, name }) =>
  pipe([
    pickId,
    ({ KeyId }) => ({ AliasName: `alias/${name}`, TargetKeyId: KeyId }),
    endpoint().createAlias,
  ]);

exports.KmsKey = () => ({
  type: "Key",
  package: "kms",
  client: "KMS",
  cannotBeDeleted,
  managedByOther,
  omitProperties,
  propertiesDefault: {
    Enabled: true,
    KeyManager: "CUSTOMER",
    KeySpec: "SYMMETRIC_DEFAULT",
    // You cannot specify KeySpec and CustomerMasterKeySpec in the same request. CustomerMasterKeySpec is deprecated
    //CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
    MultiRegion: false,
    Origin: "AWS_KMS",
    Description: "",
    KeyUsage: "ENCRYPT_DECRYPT",
    EncryptionAlgorithms: ["SYMMETRIC_DEFAULT"],
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      //TODO no pick
      pick(["Enabled", "Description", "Policy", "MultiRegion"]),
      assign({
        Policy: pipe([
          get("Policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  findName,
  findId,
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#describeKey-property
  getById,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#listKeys-property
  getList: {
    ...getList,
    transformListPost: () =>
      pipe([
        filterOut(
          eq(get("MultiRegionConfiguration.MultiRegionKeyType"), "REPLICA")
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  create: {
    isInstanceUp,
    method: "createKey",
    filterPayload: pipe([omit(["Policy"]), assignTags]),
    pickCreated: () => pipe([get("KeyMetadata")]),
    postCreate: ({ endpoint, name, payload }) =>
      pipe([
        tap(createAlias({ endpoint, name })),
        tap(putKeyPolicy({ endpoint, payload })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#updateMyResource-property
  update,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#deleteMyResource-property
  destroy,
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          config,
          namespace,
          name,
          UserTags: Tags,
        }),
      }),
    ])(),
});
