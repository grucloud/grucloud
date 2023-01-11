const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { Tagger, assignTags } = require("./AppRunnerCommon");

const cannotBeDeleted = () =>
  pipe([eq(get("AutoScalingConfigurationName"), "DefaultConfiguration")]);

const buildArn = () =>
  pipe([
    get("AutoScalingConfigurationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  pick(["AutoScalingConfigurationArn"]),
  tap(({ AutoScalingConfigurationArn }) => {
    assert(AutoScalingConfigurationArn);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const findName = () =>
  pipe([
    get("AutoScalingConfigurationName"),
    tap((name) => {
      assert(name);
    }),
  ]);

exports.AppRunnerAutoScalingConfiguration = ({ compare }) => ({
  type: "AutoScalingConfiguration",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName,
  inferName: findName,
  findId: () =>
    pipe([
      get("AutoScalingConfigurationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  dependencies: {},
  propertiesDefault: {},
  omitProperties: [
    "AutoScalingConfigurationArn",
    "Status",
    "CreatedAt",
    "DeletedAt",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeAutoScalingConfiguration-property
  getById: {
    method: "describeAutoScalingConfiguration",
    pickId,
    getField: "AutoScalingConfiguration",
    decorate,
  },
  getList: {
    method: "listAutoScalingConfigurations",
    getParam: "AutoScalingConfigurationSummaryList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  create: {
    method: "createAutoScalingConfiguration",
    pickCreated: ({ payload }) => pipe([get("AutoScalingConfiguration")]),
  },
  // No Update
  destroy: {
    method: "deleteAutoScalingConfiguration",
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
