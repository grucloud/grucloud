const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, callProp, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./AppConfigCommon");

const pickId = pipe([({ Id }) => ({ DeploymentStrategyId: Id })]);

const buildArn =
  ({ region, accountId }) =>
  ({ Id }) =>
    `arn:aws:appconfig:${region}:${accountId()}:deploymentstrategy/${Id}`;

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const managedByOther = pipe([
  get("live.Name"),
  callProp("startsWith", "AppConfig."),
]);

const model = ({ config }) => ({
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getDeploymentStrategy-property
  getById: {
    method: "getDeploymentStrategy",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listDeploymentStrategies-property
  getList: {
    method: "listDeploymentStrategies",
    getParam: "Items",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createDeploymentStrategy-property
  create: {
    method: "createDeploymentStrategy",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateDeploymentStrategy-property
  update: {
    method: "updateDeploymentStrategy",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ DeploymentStrategyId: live.Id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteDeploymentStrategy-property
  destroy: {
    method: "deleteDeploymentStrategy",
    pickId,
  },
});

exports.AppConfigDeploymentStrategy = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Id")]),
    managedByOther,
    cannotBeDeleted: managedByOther,
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
