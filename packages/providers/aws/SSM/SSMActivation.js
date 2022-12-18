const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { callProp, isIn, find, identity, append } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger } = require("./SSMCommon");

const buildArn = () => get("ActivationId");

const pickId = pipe([
  pick(["ActivationId"]),
  tap(({ ActivationId }) => {
    assert(ActivationId);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMActivation = () => ({
  type: "Activation",
  package: "ssm",
  client: "SSM",
  findName: () => get("Description"),
  findId: () =>
    pipe([
      get("ActivationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: () => get("Description"),
  propertiesDefault: { RegistrationLimit: 1 },
  omitProperties: [
    "ActivationId",
    "CreatedDate",
    "Expired",
    "IamRole",
    "RegistrationsCount",
    "ExpirationDate",
  ],
  ignoreErrorCodes: ["InvalidActivation"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId:
        ({ lives, config }) =>
        ({ IamRole }) =>
          pipe([
            get("IamRole"),
            lives.getByType({
              type: "Role",
              group: "IAM",
              providerName: config.providerName,
            }),
            find(pipe([get("live.RoleName"), isIn(IamRole)])),
          ])(),
    },
  },
  getById: {
    pickId: pipe([
      ({ ActivationId }) => ({
        Filters: [{ FilterKey: "ActivationIds", FilterValues: [ActivationId] }],
      }),
    ]),
    method: "describeActivations",
    getField: "ActivationList",
    decorate,
  },
  getList: {
    method: "describeActivations",
    getParam: "ActivationList",
    decorate,
  },
  create: {
    method: "createActivation",
    pickCreated: ({ payload }) => identity,
    shouldRetryOnExceptionMessages: ["Nonexistent role", "Not existing role"],
  },
  destroy: { method: "deleteActivation", pickId },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([() => ({ ResourceType: "Activation" })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(iamRole);
      }),
      () => otherProps,
      assign({
        IamRole: pipe([
          () => getField(iamRole, "Path"),
          callProp("slice", 1),
          append(getField(iamRole, "RoleName")),
        ]),
      }),
    ])(),
});
