const assert = require("assert");
const { pipe, tap, get, pick, eq, map, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { Tagger } = require("./FSxCommon");

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ FileSystemId }) => {
    assert(FileSystemId);
  }),
  pick(["FileSystemId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    when(
      eq(get("OntapConfiguration.DiskIopsConfiguration.Mode"), "AUTOMATIC"),
      omit(["OntapConfiguration.DiskIopsConfiguration.Iops"])
    ),
    when(
      eq(get("OpenZFSConfiguration.DiskIopsConfiguration.Mode"), "AUTOMATIC"),
      omit(["OpenZFSConfiguration.DiskIopsConfiguration.Iops"])
    ),
  ]);
// ]);

const findId = () =>
  pipe([
    get("FileSystemId"),
    tap((id) => {
      assert(id);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxFileSystem = () => ({
  type: "FileSystem",
  package: "fsx",
  client: "FSx",
  propertiesDefault: {},
  omitProperties: [
    "FileSystemId",
    "OwnerId",
    "CreationTime",
    "FailureDetails",
    "ResourceARN",
    "KmsKeyId",
    "VpcId",
    "SubnetIds",
    "DNSName",
    "Lifecycle",
    "NetworkInterfaceIds",
    "OntapConfiguration.EndpointIpAddressRange",
    "OntapConfiguration.Endpoints",
    "OntapConfiguration.PreferredSubnetId",
    "OntapConfiguration.RouteTableIds",
    "OpenZFSConfiguration.RootVolumeId",
    "LustreConfiguration.MountName",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    logStreamLustre: {
      type: "LogStream",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        pipe([get("LustreConfiguration.LogConfiguration.Destination")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
    // CloudWatchLogs::LogStream
  },
  ignoreErrorCodes: ["FileSystemNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeFileSystems-property
  getById: {
    method: "describeFileSystems",
    getField: "FileSystems",
    pickId: pipe([
      tap(({ FileSystemId }) => {
        assert(FileSystemId);
      }),
      ({ FileSystemId }) => ({
        FileSystemIds: [FileSystemId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeFileSystems-property
  getList: {
    method: "describeFileSystems",
    getParam: "FileSystems",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createFileSystem-property
  create: {
    method: "createFileSystem",
    pickCreated: ({ payload }) => pipe([get("FileSystem")]),
    configIsUp: { retryCount: 45 * 12, retryDelay: 5e3 },
    isInstanceUp: pipe([
      tap(({ Lifecycle }) => {
        assert(Lifecycle);
      }),
      eq(get("Lifecycle"), "AVAILABLE"),
    ]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("FailureDetails.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateFileSystem-property
  update: {
    method: "updateFileSystem",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteFileSystem-property
  destroy: {
    method: "deleteFileSystem",
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
    dependencies: { kmsKey, subnets, securityGroups },
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
