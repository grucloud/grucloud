const assert = require("assert");
const { pipe, tap, get, pick, map, eq } = require("rubico");
const { defaultsDeep, when, find, identity, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, findEfsFromLocation, assignTags } = require("./DataSyncCommon");

const buildArn = () =>
  pipe([
    get("LocationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ LocationArn }) => {
    assert(LocationArn);
  }),
  pick(["LocationArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html
exports.DataSyncLocationEfs = () => ({
  type: "LocationEfs",
  package: "datasync",
  client: "DataSync",
  propertiesDefault: {},
  omitProperties: [
    "LocationArn",
    "LocationUri",
    "Ec2Config",
    "EfsFilesystemArn",
    "CreationTime",
    "AccessPointArn",
    "EfsFilesystemArn",
    "FileSystemAccessRoleArn",
    "AgentArns",
  ],
  inferName: ({ dependenciesSpec: { efsFileSystem } }) =>
    pipe([
      tap((params) => {
        assert(efsFileSystem);
      }),
      () => `${efsFileSystem}`,
    ]),
  findName: ({ lives, config }) =>
    pipe([
      findEfsFromLocation({ lives, config }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("LocationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidRequestException"],
  dependencies: {
    agents: {
      type: "Agent",
      group: "DataSync",
      list: true,
      dependencyIds: () => pipe([get("AgentArns")]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: () => pipe([get("FileSystemAccessRoleArn")]),
    },
    efsAccessPoint: {
      type: "AccessPoint",
      group: "EFS",
      dependencyId: ({ lives, config }) => pipe([get("AccessPointArn")]),
    },
    efsMountTarget: {
      type: "MountTarget",
      group: "EFS",
      dependsOnTypeOnly: true,
    },
    efsFileSystem: {
      type: "FileSystem",
      group: "EFS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          findEfsFromLocation({ lives, config }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Ec2Config.SubnetArn"),
          (subnetArn) =>
            pipe([
              lives.getByType({
                type: "Subnet",
                group: "EC2",
                providerName: config.providerName,
              }),
              find(eq(get("live.Arn"), subnetArn)),
            ])(),
        ]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Ec2Config.SecurityGroupArns"),
          map((securityGroupArn) =>
            pipe([
              lives.getByType({
                type: "SecurityGroup",
                group: "EC2",
                providerName: config.providerName,
              }),
              find(eq(get("live.Arn"), securityGroupArn)),
              get("id"),
              tap((id) => {
                assert(id);
              }),
            ])()
          ),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#describeLocationEfs-property
  getById: {
    method: "describeLocationEfs",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#listLocations-property
  getList: {
    enhanceParams: () =>
      pipe([
        () => ({
          Filters: [
            { Name: "LocationType", Operator: "Equals", Values: ["EFS"] },
          ],
        }),
      ]),
    method: "listLocations",
    getParam: "Locations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#createLocationEfs-property
  create: {
    method: "createLocationEfs",
    pickCreated: ({ payload }) => pipe([identity]),
    shouldRetryOnExceptionMessages: ["No available mount targets for"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#updateLocationEfs-property
  update: {
    method: "updateLocationEfs",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#deleteLocationEfs-property
  destroy: {
    method: "deleteLocation",
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
    dependencies: {
      agents,
      efsAccessPoint,
      efsFileSystem,
      iamRole,
      subnet,
      securityGroups,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(efsFileSystem);
        assert(subnet);
        assert(securityGroups);
      }),
      () => otherProps,
      defaultsDeep({
        EfsFilesystemArn: getField(efsFileSystem, "FileSystemArn"),
        Ec2Config: {
          SubnetArn: getField(subnet, "Arn"),
          SecurityGroupArns: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "Arn")),
          ])(),
        },
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => efsAccessPoint,
        defaultsDeep({
          AccessPointArn: getField(efsAccessPoint, "AccessPointArn"),
        })
      ),
      when(
        () => iamRole,
        defaultsDeep({ FileSystemAccessRoleArn: getField(iamRole, "Arn") })
      ),
      when(
        () => agents,
        defaultsDeep({
          AgentArns: pipe([
            () => agents,
            // TODO
            map((agent) => getField(agent, "Arn")),
          ])(),
        })
      ),
    ])(),
});
