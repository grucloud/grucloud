const assert = require("assert");
const { pipe, tap, get, not } = require("rubico");
const { defaultsDeep, isEmpty, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { createAwsResource } = require("../AwsClient");

const { diffToPatch } = require("./ApiGatewayCommon");
const { differenceObject } = require("@grucloud/core/Common");

const findName = () => "default";
const findId = findName;

const pickId = () => ({});

const isDefault = pipe([not(get("live.cloudwatchRoleArn"))]);

const cannotBeDeleted = pipe([
  get("live"),
  differenceObject({
    apiKeyVersion: "4",
    cloudwatchRoleArn: undefined,
    features: ["UsagePlans"],
    throttleSettings: {
      burstLimit: 5000,
      rateLimit: 10000,
    },
  }),
  isEmpty,
]);

const model = ({ config }) => ({
  package: "api-gateway",
  client: "APIGateway",
  ignoreErrorCodes: [],
  getById: {
    method: "getAccount",
    pickId,
  },
  getList: {
    method: "getAccount",
  },
  update: {
    pickId: () => ({}),
    filterParams: ({ payload, live, diff }) =>
      pipe([
        () => ({ diff }),
        diffToPatch,
        (patchOperations) => ({
          patchOperations,
        }),
      ])(),
    method: "updateAccount",
    shouldRetryOnExceptionMessages: [
      "The role ARN does not have required permissions configured. Please grant trust permission for API Gateway and add the required role policy.",
    ],
    config,
  },
  destroy: {
    pickId: () => ({
      patchOperations: [
        { op: "replace", path: "/cloudwatchRoleArn", value: "" },
      ],
    }),
    method: "updateAccount",
    isInstanceDown: () => true,
  },
});

exports.Account = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    cannotBeDeleted,
    managedByOther: isDefault,
    isDefault,
    findName,
    findId,
    getByName: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
        }),
        () => ({}),
        getById({}),
        tap((params) => {
          assert(true);
        }),
      ]),
    configDefault: ({
      name,
      namespace,
      properties,
      dependencies: { cloudwatchRole },
    }) =>
      pipe([
        () => properties,
        when(
          () => cloudwatchRole,
          defaultsDeep({
            cloudwatchRoleArn: getField(cloudwatchRole, "Arn"),
          })
        ),
      ])(),
  });
