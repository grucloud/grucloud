const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./AppConfigCommon");

const pickId = pipe([({ Id }) => ({ ApplicationId: Id })]);

// https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsappconfig.html
const buildArn =
  ({ region, accountId }) =>
  ({ Id }) =>
    `arn:aws:appconfig:${region}:${accountId()}:application/${Id}`;

const decorate = ({ endpoint, config }) =>
  pipe([assignTags({ buildArn: buildArn(config), endpoint })]);

const model = ({ config }) => ({
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getApplication-property
  getById: {
    method: "getApplication",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listApplications-property
  getList: {
    method: "listApplications",
    getParam: "Items",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ ApplicationId: live.Id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
    pickId,
  },
});

exports.AppConfigApplication = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Id")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });