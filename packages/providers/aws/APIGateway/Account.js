const assert = require("assert");
const { pipe, tap, get, not, omit } = require("rubico");
const { defaultsDeep, isEmpty, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { diffToPatch } = require("./ApiGatewayCommon");
const { differenceObject } = require("@grucloud/core/Common");

const findName = () => () => "default";
const findId = findName;

const pickId = () => ({});

const isDefault = () => pipe([not(get("cloudwatchRoleArn"))]);

const cannotBeDeleted = () =>
  pipe([
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

exports.Account = ({}) => ({
  type: "Account",
  package: "api-gateway",
  client: "APIGateway",
  inferName: () => () => "default",
  findName,
  findId,
  cannotBeDeleted,
  managedByOther: isDefault,
  isDefault,
  omitProperties: ["apiKeyVersion", "throttleSettings"],
  propertiesDefault: {
    features: ["UsagePlans"],
  },
  filterLive: () => pipe([omit(["features", "cloudwatchRoleArn"])]),
  dependencies: {
    cloudwatchRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("cloudwatchRoleArn"),
    },
  },
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
