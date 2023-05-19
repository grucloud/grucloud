const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, filterOut } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ deploymentConfigName }) => {
    assert(deploymentConfigName);
  }),
  pick(["deploymentConfigName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const managedByOther = () =>
  pipe([
    get("deploymentConfigName"),
    callProp("startsWith", "CodeDeployDefault."),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html
exports.CodeDeployDeploymentConfig = () => ({
  type: "DeploymentConfig",
  package: "codedeploy",
  client: "CodeDeploy",
  propertiesDefault: {},
  omitProperties: ["deploymentConfigId", "createTime"],
  inferName: () =>
    pipe([
      get("deploymentConfigName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("deploymentConfigName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("deploymentConfigName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["DeploymentConfigDoesNotExistException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#getDeploymentConfig-property
  getById: {
    method: "getDeploymentConfig",
    getField: "deploymentConfigInfo",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#listDeploymentConfigs-property
  getList: {
    transformListPre: () =>
      filterOut(pipe([callProp("startsWith", "CodeDeployDefault.")])),
    method: "listDeploymentConfigs",
    getParam: "deploymentConfigsList",
    decorate: ({ getById }) =>
      pipe([(deploymentConfigName) => ({ deploymentConfigName }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#createDeploymentConfig-property
  create: {
    method: "createDeploymentConfig",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#updateDeploymentConfig-property
  update: {
    method: "updateDeploymentConfig",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#deleteDeploymentConfig-property
  destroy: {
    method: "deleteDeploymentConfig",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
