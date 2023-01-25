const assert = require("assert");
const { pipe, tap, get, pick, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { Tagger, dependencyIdFileSystem } = require("./EFSCommon");

const pickId = pipe([pick(["AccessPointId"])]);
const findId = () => pipe([get("AccessPointArn")]);

const buildArn = () =>
  pipe([
    get("AccessPointId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSAccessPoint = ({ compare }) => ({
  type: "AccessPoint",
  package: "efs",
  client: "EFS",
  findName: findNameInTagsOrId({ findId: () => get("AccessPointId") }),
  findId,
  ignoreErrorCodes: ["AccessPointNotFound", "BadRequest"],
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "EFS",
      dependencyId: dependencyIdFileSystem,
    },
  },
  omitProperties: [
    "ClientToken",
    "AccessPointId",
    "AccessPointArn",
    "FileSystemId",
    "OwnerId",
    "LifeCycleState",
    "Name",
  ],
  compare: compare({
    filterAll: () => pipe([omit([])]),
  }),
  getById: {
    method: "describeAccessPoints",
    pickId,
    getParam: "AccessPoints",
  },
  getList: {
    method: "describeAccessPoints",
    getParam: "AccessPoints",
  },
  create: { method: "createAccessPoint" },
  update: {
    method: "updateAccessPoint",
    filterParams: ({ payload }) => pipe([() => payload]),
  },
  destroy: { method: "deleteAccessPoint", pickId },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { fileSystem },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(fileSystem);
      }),
      () => otherProps,
      defaultsDeep({
        FileSystemId: getField(fileSystem, "FileSystemId"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
