const assert = require("assert");
const { pipe, tap, get, not } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createAPIGateway, diffToPatch } = require("./ApiGatewayCommon");
const { differenceObject } = require("@grucloud/core/Common");
const findName = () => "default";
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.Account = ({ spec, config }) => {
  const apiGateway = createAPIGateway(config);
  const client = AwsClient({ spec, config })(apiGateway);

  const isDefault = pipe([not(get("live.cloudwatchRoleArn"))]);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getAccount-property
  const getAccount = () => pipe([() => ({}), apiGateway().getAccount])();

  const getList = () => pipe([getAccount, (account) => [account]])();
  const getByName = getAccount;
  const getById = () => getAccount;

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { cloudwatchRole },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        ...(cloudwatchRole && {
          cloudwatchRoleArn: getField(cloudwatchRole, "Arn"),
        }),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const create = pipe([
    tap((params) => {
      assert(false, "create should not be called");
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateAccount-property
  const update = client.update({
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
    getById,
  });

  //TODO client.destroy
  const destroy = pipe([
    () =>
      apiGateway().updateAccount({
        patchOperations: [
          { op: "replace", path: "/cloudwatchRoleArn", value: "" },
        ],
      }),
  ]);

  return {
    spec,
    findId,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    isDefault,
    managedByOther: isDefault,
    cannotBeDeleted: pipe([
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
    ]),
  };
};
