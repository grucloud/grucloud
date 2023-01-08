const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, callProp, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppConfigCommon");

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

const managedByOther = () =>
  pipe([get("Name"), callProp("startsWith", "AppConfig.")]);

exports.AppConfigDeploymentStrategy = () => ({
  type: "DeploymentStrategy",
  package: "appconfig",
  client: "AppConfig",
  omitProperties: ["Id"],
  inferName: () => get("Name"),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Id")]),
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
  managedByOther,
  cannotBeDeleted: managedByOther,
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
