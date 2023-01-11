const assert = require("assert");
const { pipe, tap, get, pick, filter, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { Tagger, assignTags } = require("./AppRunnerCommon");

const cannotBeDeleted = () =>
  pipe([eq(get("ObservabilityConfigurationName"), "DefaultConfiguration")]);

const buildArn = () =>
  pipe([
    get("ObservabilityConfigurationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([pick(["ObservabilityConfigurationArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const findName = () =>
  pipe([
    get("ObservabilityConfigurationName"),
    tap((name) => {
      assert(name);
    }),
  ]);

exports.AppRunnerObservabilityConfiguration = ({ compare }) => ({
  type: "ObservabilityConfiguration",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName,
  inferName: findName,
  findId: () =>
    pipe([
      get("ObservabilityConfigurationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  dependencies: {},
  propertiesDefault: {},
  omitProperties: [
    "ObservabilityConfigurationArn",
    "Status",
    "CreatedAt",
    "DeletedAt",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeObservabilityConfiguration-property
  getById: {
    method: "describeObservabilityConfiguration",
    pickId,
    getField: "ObservabilityConfiguration",
    decorate,
  },
  getList: {
    method: "listObservabilityConfigurations",
    getParam: "ObservabilityConfigurationSummaryList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
    transformListPost: pipe([filter(eq(get("Status"), "ACTIVE"))]),
  },
  create: {
    method: "createObservabilityConfiguration",
    pickCreated: ({ payload }) => pipe([get("ObservabilityConfiguration")]),
  },
  // No Update
  destroy: {
    method: "deleteObservabilityConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
    ])(),
});
