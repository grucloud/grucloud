const assert = require("assert");
const { pipe, tap, get, assign, pick, map, eq, omit } = require("rubico");
const { defaultsDeep, when, prepend, append, last, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, dependencyIdFileSystem } = require("./EFSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["MountTargetId"])]);

const buildArn = () =>
  pipe([
    get("MountTargetId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSMountTarget = ({ compare }) => ({
  type: "MountTarget",
  package: "efs",
  client: "EFS",
  inferName:
    ({ dependenciesSpec: { fileSystem } }) =>
    ({ AvailabilityZoneName }) =>
      pipe([
        tap(() => {
          assert(fileSystem);
          assert(AvailabilityZoneName);
        }),
        () => AvailabilityZoneName,
        last,
        prepend("::"),
        prepend(fileSystem),
        prepend("mount-target::"),
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.FileSystemId);
        }),
        lives.getByType({
          type: "FileSystem",
          group: "EFS",
          providerName: config.providerName,
        }),
        find(eq(get("live.FileSystemId"), live.FileSystemId)),
        get("name", live.FileSystemId),
        prepend("mount-target::"),
        append("::"),
        append(pipe([() => live.AvailabilityZoneName, last])()),
      ])(),
  findId: () => pipe([get("MountTargetId")]),
  getByName: getByNameCore,
  ignoreErrorCodes: ["MountTargetNotFound"],
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "EFS",
      parent: true,
      dependencyId: dependencyIdFileSystem,
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("SubnetId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroups"),
    },
  },
  omitProperties: [
    "ClientToken",
    "AccessPointId",
    "AccessPointArn",
    "FileSystemId",
    "OwnerId",
    "MountTargetId",
    "AvailabilityZoneId",
    "LifeCycleState",
    "NetworkInterfaceId",
    "SubnetId",
    "VpcId",
    "SecurityGroups",
    "IpAddress",
  ],
  compare: compare({
    filterAll: () => pipe([omit([])]),
  }),
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        AvailabilityZoneName: pipe([
          get("AvailabilityZoneName"),
          replaceAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  getById: { method: "describeMountTargets", getField: "MountTargets", pickId },
  create: {
    method: "createMountTarget",
    isInstanceUp: eq(get("LifeCycleState"), "available"),
  },
  update: { method: "updateMountTarget" },
  destroy: { method: "deleteMountTarget", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "FileSystem", group: "EFS" },
          pickKey: pipe([
            tap(({ FileSystemId }) => {
              assert(FileSystemId);
            }),
            pick(["FileSystemId"]),
          ]),
          method: "describeMountTargets",
          getParam: "MountTargets",
          decorate: ({ lives, parent }) =>
            pipe([
              assign({
                SecurityGroups: pipe([
                  pick(["MountTargetId"]),
                  endpoint().describeMountTargetSecurityGroups,
                  get("SecurityGroups"),
                ]),
              }),
            ]),
          config,
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { fileSystem, subnet, securityGroups },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        FileSystemId: getField(fileSystem, "FileSystemId"),
        SubnetId: getField(subnet, "SubnetId"),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroups: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
