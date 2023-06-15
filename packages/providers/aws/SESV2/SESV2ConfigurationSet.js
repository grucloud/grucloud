const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SESV2Common");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ ConfigurationSetName }) => {
      assert(ConfigurationSetName);
      assert(config);
    }),
    assign({
      Arn: ({ ConfigurationSetName }) =>
        `arn:${config.partition}:ses:${
          config.region
        }:${config.accountId()}:configuration-set/${ConfigurationSetName}`,
    }),
  ]);

const pickId = pipe([
  tap(({ ConfigurationSetName }) => {
    assert(ConfigurationSetName);
  }),
  pick(["ConfigurationSetName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html
exports.SESV2ConfigurationSet = ({ compare }) => ({
  type: "ConfigurationSet",
  package: "sesv2",
  client: "SESv2",
  propertiesDefault: {},
  omitProperties: ["Arn"],
  inferName: () =>
    pipe([
      get("ConfigurationSetName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ConfigurationSetName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ConfigurationSetName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getConfigurationSet-property
  getById: {
    method: "getConfigurationSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#listConfigurationSets-property
  getList: {
    method: "listConfigurationSets",
    getParam: "ConfigurationSets",
    decorate,
    decorate: ({ getById }) =>
      pipe([(ConfigurationSetName) => ({ ConfigurationSetName }), getById]),
  },
  create: {
    method: "createConfigurationSet",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#updateConfigurationSet-property
  // update: {
  //   method: "updateConfigurationSet",
  //   filterParams: ({  payload, diff, live }) =>
  //     pipe([
  //       () => payload,
  //       // assign({
  //       //   SecretId: () => live.ARN,
  //       // }),
  //     ])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#deleteConfigurationSet-property
  destroy: {
    method: "deleteConfigurationSet",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
      additionalParams: pipe([pick(["InstanceArn"])]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
