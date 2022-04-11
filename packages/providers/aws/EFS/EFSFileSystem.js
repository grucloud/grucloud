const assert = require("assert");
const { pipe, tap, get, assign, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EFSCommon");

const model = {
  package: "efs",
  client: "EFS",
  ignoreErrorCodes: ["FileSystemNotFound", "BadRequest"],
  getById: { method: "describeFileSystems", getField: "FileSystems" },
  getList: { method: "describeFileSystems", getParam: "FileSystems" },
  create: { method: "createFileSystem" },
  update: { method: "updateFileSystem" },
  destroy: { method: "deleteFileSystem" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSFileSystem = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: findNameInTagsOrId({ findId: get("live.FileSystemId") }),
    pickId: pipe([
      tap(({ FileSystemId }) => {
        assert(FileSystemId);
      }),
      pick(["FileSystemId"]),
    ]),
    findId: pipe([get("live.FileSystemArn")]),
    decorateList:
      ({ endpoint, getById }) =>
      (live) =>
        pipe([() => live])(),
    decorate: ({ endpoint }) => pipe([assign({})]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    isInstanceUp: eq(get("LifeCycleState"), "available"),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
    updateFilterParams: ({ payload }) => pipe([() => payload]),
  });
