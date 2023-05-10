const assert = require("assert");
const { pipe, tap, get, eq, filter, assign, tryCatch } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../IAM/IAMCommon");
const { createEndpoint } = require("../AwsCommon");

const { buildTags } = require("../AwsCommon");

const {
  tagResource,
  untagResource,
  omitProperties,
  findId,
  findName,
  getById,
  getList,
  update,
  destroy,
  cannotBeDeleted,
  managedByOther,
  assignTags,
} = require("./KMSCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html
exports.KmsReplicaKey = () => ({
  type: "ReplicaKey",
  package: "kms",
  client: "KMS",
  propertiesDefault: {},
  cannotBeDeleted,
  managedByOther,
  omitProperties: [
    ...omitProperties,
    "EncryptionAlgorithms",
    "KeyManager",
    "KeySpec",
    "KeyUsage",
    "MultiRegion",
  ],
  findName,
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("MultiRegionConfiguration.PrimaryKey.Arn")]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        Policy: pipe([
          get("Policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#getReplicaKey-property
  getById,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#listKeys-property
  getList: {
    ...getList,
    transformListPost: () =>
      pipe([
        filter(
          eq(get("MultiRegionConfiguration.MultiRegionKeyType"), "REPLICA")
        ),
        // only to test replicateKey when key already exists
        // filter(() => false),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createReplicaKey-property
  create:
    ({ config }) =>
    ({ payload, resolvedDependencies: { kmsKey } }) =>
      pipe([
        tap((id) => {
          assert(payload);
          assert(payload.Policy);
          assert(config);
          assert(config.region);
          assert(kmsKey);
          assert(kmsKey.live.KeyId);
          assert(kmsKey.resource.provider.getConfig().region);
        }),
        () => config,
        createEndpoint(
          "kms",
          "KMS",
          kmsKey.resource.provider.getConfig().region
        ),
        (endpoint) =>
          tryCatch(
            pipe([
              () => payload,
              defaultsDeep({
                KeyId: kmsKey.live.KeyId,
                ReplicaRegion: config.region,
              }),
              assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
              assignTags,
              endpoint().replicateKey,
            ]),
            (error) => {
              assert(error);
              //TODO throw unless AlreadyExistsException
            }
          )(),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#updateReplicaKey-property
  update,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#deleteReplicaKey-property
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
