const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EFSCommon");

const pickId = pipe([pick(["AccessPointId"])]);
const findId = () => pipe([get("AccessPointId")]);

const model = {
  package: "efs",
  client: "EFS",
  ignoreErrorCodes: ["AccessPointNotFound", "BadRequest"],
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
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSAccessPoint = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: findNameInTagsOrId({ findId: () => get("AccessPointId") }),
    findId,
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
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
