const assert = require("assert");
const { pipe, tap, get, assign, pick, map, eq } = require("rubico");
const { defaultsDeep, when, prepend, append, last, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EFSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["MountTargetId"])]);

const model = {
  package: "efs",
  client: "EFS",
  ignoreErrorCodes: ["MountTargetNotFound"],
  getById: { method: "describeMountTargets", getField: "MountTargets", pickId },
  create: {
    method: "createMountTarget",
    isInstanceUp: eq(get("LifeCycleState"), "available"),
  },
  update: { method: "updateMountTarget" },
  destroy: { method: "deleteMountTarget", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSMountTarget = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName:
      ({ lives }) =>
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
          get("name"),
          tap((name) => {
            assert(name);
          }),
          prepend("mount-target::"),
          append("::"),
          append(pipe([() => live.AvailabilityZoneName, last])()),
        ])(),

    findId: () => pipe([get("MountTargetId")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
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
