const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  findDependenciesFileSystem,
} = require("./EFSCommon");

const model = {
  package: "efs",
  client: "EFS",
  ignoreErrorCodes: ["AccessPointNotFound", "BadRequest"],
  getById: { method: "describeAccessPoints", getParam: "AccessPoints" },
  getList: { method: "describeAccessPoints", getParam: "AccessPoints" },
  create: { method: "createAccessPoint" },
  update: { method: "updateAccessPoint" },
  destroy: { method: "deleteAccessPoint" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSAccessPoint = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: findNameInTagsOrId({ findId: get("live.AccessPointId") }),
    pickId: pipe([
      tap(({ AccessPointId }) => {
        assert(AccessPointId);
      }),
      pick(["AccessPointId"]),
    ]),
    findId: pipe([get("live.AccessPointArn")]),
    findDependencies: ({ live, lives }) => [
      findDependenciesFileSystem({ live, lives, config }),
    ],
    decorateList:
      ({ endpoint, getById }) =>
      (live) =>
        pipe([() => live])(),
    decorate: ({ endpoint }) => pipe([assign({})]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { fileSystem },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          FileSystemId: getField(fileSystem, "FileSystemId"),
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
    updateFilterParams: ({ payload }) => pipe([() => payload]),
  });
