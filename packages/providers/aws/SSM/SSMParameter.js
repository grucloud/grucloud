const assert = require("assert");
const { pipe, tap, get, pick, assign, omit, tryCatch } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { assignTags, Tagger } = require("./SSMCommon");

const pickId = pipe([pick(["Name"])]);

const buildArn = () => get("Name");

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      pick(["Name"]),
      tryCatch(
        pipe([defaultsDeep({ WithDecryption: true }), endpoint().getParameter]),
        // InvalidKeyId
        (error, input) =>
          pipe([
            () => input,
            defaultsDeep({ WithDecryption: false }),
            endpoint().getParameter,
          ])()
      ),
      get("Parameter"),
      defaultsDeep(live),
      assignTags({ endpoint, ResourceType: "Parameter" }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMParameter = () => ({
  type: "Parameter",
  package: "ssm",
  client: "SSM",
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("ARN"),
      tap((ARN) => {
        assert(ARN);
      }),
    ]),
  inferName: () => get("Name"),
  ignoreResource: () =>
    pipe([get("name"), callProp("startsWith", "/cdk-bootstrap/")]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("KeyId"),
    },
  },
  omitProperties: [
    "Version",
    "LastModifiedDate",
    "ARN",
    "Tier",
    "LastModifiedUser",
    "KeyId",
    "Policies",
  ],
  filterLive: () =>
    pick(["Name", "Type", "Value", "Description", "Tier", "DataType"]),
  ignoreErrorCodes: ["ParameterNotFound"],
  getById: {
    method: "describeParameters",
    getField: "Parameters",
    pickId: pipe([
      ({ Name }) => ({ Filters: [{ Key: "Name", Values: [Name] }] }),
    ]),
    decorate,
  },
  getList: {
    method: "describeParameters",
    getParam: "Parameters",
    decorate,
  },
  create: {
    method: "putParameter",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: {
    method: "putParameter",
    extraParam: { Overwrite: true },
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  destroy: { method: "deleteParameter", pickId },
  getByName:
    ({ getById }) =>
    ({ name, lives, config }) =>
      pipe([() => ({ Name: name }), getById({ lives, config })])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([() => ({ ResourceType: "Parameter" })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(() => kmsKey, defaultsDeep({ KeyId: getField(kmsKey, "Arn") })),
    ])(),
  onDeployed: ({ resultCreate, lives, config }) =>
    pipe([
      tap(() => {
        assert(resultCreate);
        assert(lives);
        assert(config);
      }),
    ])(),
});
