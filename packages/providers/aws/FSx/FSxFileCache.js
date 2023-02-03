const assert = require("assert");
const { pipe, tap, get, pick, eq, map, omit, flatMap } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { Tagger, assignTags } = require("./FSxCommon");

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ FileCacheId }) => {
    assert(FileCacheId);
  }),
  pick(["FileCacheId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const findId = () =>
  pipe([
    get("FileCacheId"),
    tap((id) => {
      assert(id);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxFileCache = () => ({
  type: "FileCache",
  package: "fsx",
  client: "FSx",
  propertiesDefault: {},
  omitProperties: [
    "FileCacheId",
    "OwnerId",
    "CreationTime",
    "Lifecycle",
    "FailureDetails",
    "VpcId",
    "SubnetIds",
    "NetworkInterfaceIds",
    "SecurityGroupIds",
    "DNSName",
    "ResourceARN",
    "KmsKeyId",
    "DataRepositoryAssociationIds",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  dependencies: {},
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("NetworkInterfaceIds"),
          flatMap(
            pipe([
              lives.getById({
                type: "NetworkInterface",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("live.Groups"),
              pluck("GroupId"),
            ])
          ),
        ]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
  },
  ignoreErrorCodes: ["FileCacheNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeFileCaches-property
  getById: {
    method: "describeFileCaches",
    getField: "FileCaches",
    pickId: pipe([
      tap(({ FileCacheId }) => {
        assert(FileCacheId);
      }),
      ({ FileCacheId }) => ({
        FileCacheIds: [FileCacheId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeFileCaches-property
  getList: {
    method: "describeFileCaches",
    getParam: "FileCaches",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createFileCache-property
  create: {
    method: "createFileCache",
    pickCreated: ({ payload }) => pipe([get("FileCache")]),
    configIsUp: { retryCount: 45 * 12, retryDelay: 5e3 },
    // isInstanceUp: pipe([
    //   tap(({ Lifecycle }) => {
    //     assert(Lifecycle);
    //   }),
    //   eq(get("Lifecycle"), "AVAILABLE"),
    // ]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("FailureDetails.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateFileCache-property
  update: {
    method: "updateFileCache",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteFileCache-property
  destroy: {
    method: "deleteFileCache",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
    ])(),
});
