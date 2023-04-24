const assert = require("assert");
const { pipe, tap, get, filter, pick, map, omit } = require("rubico");
const { defaultsDeep, pluck, when, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ SecretId }) => {
    assert(SecretId);
  }),
  pick(["SecretId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Name, ...other }) => ({ SecretId: Name, ...other }),
    when(
      get("RotationRules.ScheduleExpression"),
      omit(["RotationRules.AutomaticallyAfterDays"])
    ),
  ]);

const managedByOther = () =>
  pipe([get("SecretId"), callProp("startsWith", "rds!")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
exports.SecretsManagerSecretRotation = ({ compare }) => ({
  type: "SecretRotation",
  package: "secrets-manager",
  client: "SecretsManager",
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName: () =>
    pipe([
      get("SecretId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("SecretId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    secret: {
      type: "Secret",
      group: "SecretsManager",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ARN"),
          tap((ARN) => {
            assert(ARN);
          }),
        ]),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RotationLambdaARN"),
          tap((RotationLambdaARN) => {
            //assert(RotationLambdaARN);
          }),
        ]),
    },
  },
  omitProperties: ["RotationLambdaARN", "ARN"],
  getById: {
    method: "describeSecret",
    pickId,
    decorate,
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        lives.getByType({
          type: "Secret",
          group: "SecretsManager",
          providerName: config.providerName,
        }),
        filter(get("live.RotationEnabled")),
        pluck("live"),
        map(
          pipe([
            pick(["Name", "ARN", "RotationLambdaARN", "RotationRules"]),
            decorate({ endpoint }),
          ])
        ),
      ])(),
  create: {
    method: "rotateSecret",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "Secrets Manager cannot invoke the specified Lambda function. Ensure that the function policy grants access to the principal secretsmanager.amazonaws.com.",
    ],
  },
  update: {
    method: "rotateSecret",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))]),
  },
  destroy: {
    method: "cancelRotateSecret",
    pickId,
    isInstanceDown: () => true,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ SecretId: name }), getById({})]),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { lambdaFunction },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => lambdaFunction,
        defaultsDeep({
          RotationLambdaARN: getField(
            lambdaFunction,
            "Configuration.FunctionArn"
          ),
        })
      ),
    ])(),
});
