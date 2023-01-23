const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const pickId = pipe([pick(["Name"])]);

exports.CloudWatchEventConnection = ({ compare }) => ({
  type: "Connection",
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => get("ConnectionArn"),
  dependencies: {
    secret: {
      type: "Secret",
      group: "SecretsManager",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("SecretArn"),
    },
  },
  omitProperties: [
    "ConnectionArn",
    "CreationTime",
    "LastAuthorizedTime",
    "LastModifiedTime",
    "ConnectionState",
    "SecretArn",
  ],
  environmentVariables: [
    {
      path: "AuthParameters.ApiKeyAuthParameters.ApiKeyValue",
      suffix: "API_KEY_VALUE",
      rejectEnvironmentVariable: () =>
        pipe([not(get("AuthParameters.ApiKeyAuthParameters"))]),
    },
    {
      path: "AuthParameters.BasicAuthParameters.Password",
      suffix: "PASSWORD",
      rejectEnvironmentVariable: () =>
        pipe([not(get("AuthParameters.BasicAuthParameters"))]),
    },
  ],
  compare: compare({
    filterAll: () =>
      pipe([
        omit([
          "AuthParameters.ApiKeyAuthParameters.ApiKeyValue",
          "AuthParameters.BasicAuthParameters.Password",
        ]),
      ]),
  }),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "describeConnection",
    pickId,
  },
  getList: {
    method: "listConnections",
    getParam: "Connections",
    decorate: ({ getById }) => getById,
  },
  create: {
    method: "createConnection",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: {
    method: "updateConnection",
    filterParams: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ]),
  },
  destroy: { method: "deleteConnection", pickId },
  getByName: getByNameCore,
  configDefault: ({ name, namespace, properties: { ...otherProps }, config }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
      }),
    ])(),
});
