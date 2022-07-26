const assert = require("assert");
const { pipe, tap, get, assign, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EFSCommon");

const pickId = pipe([
  tap(({ FileSystemId }) => {
    assert(FileSystemId);
  }),
  pick(["FileSystemId"]),
]);

const model = {
  package: "efs",
  client: "EFS",
  ignoreErrorCodes: ["FileSystemNotFound", "BadRequest"],
  getById: { method: "describeFileSystems", getField: "FileSystems", pickId },
  getList: {
    method: "describeFileSystems",
    getParam: "FileSystems",
    decorate: ({ endpoint }) => pipe([assign({})]),
  },
  create: {
    method: "createFileSystem",
    isInstanceUp: eq(get("LifeCycleState"), "available"),
  },
  update: {
    method: "updateFileSystem",
    filterParams: ({ payload }) => pipe([() => payload]),
  },
  destroy: { method: "deleteFileSystem", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSFileSystem = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: findNameInTagsOrId({ findId: get("live.FileSystemId") }),
    findId: pipe([get("live.FileSystemArn")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
