const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./ElasticBeanstalkCommon");
const { buildTags } = require("../AwsCommon");

const pickId = pipe([
  pick(["ApplicationName", "EnvironmentName"]),
  tap(({ ApplicationName, EnvironmentName }) => {
    assert(ApplicationName);
    assert(EnvironmentName);
  }),
]);

const model = ({ config }) => ({
  package: "elastic-beanstalk",
  client: "ElasticBeanstalk",
  ignoreErrorCodes: ["InvalidParameterValue"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#describeEnvironments-property
  getById: {
    method: "describeEnvironments",
    getField: "Environments",
    pickId: pipe([
      tap(({ EnvironmentName, ApplicationName }) => {
        assert(EnvironmentName);
        assert(ApplicationName);
      }),
      ({ EnvironmentName, ApplicationName }) => ({
        EnvironmentNames: [EnvironmentName],
        ApplicationName,
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#createEnvironment-property
  create: {
    method: "createEnvironment",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "Ready")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#updateEnvironment-property
  update: {
    method: "updateEnvironment",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#deleteEnvironmentConfiguration-property
  destroy: {
    method: "deleteEnvironmentConfiguration",
    pickId,
  },
});

const buildArn = () => pipe([get("EnvironmentArn")]);

exports.ElasticBeanstalkEnvironment = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([
      get("live"),
      ({ ApplicationName, EnvironmentName }) =>
        `${ApplicationName}::${EnvironmentName}`,
      tap((params) => {
        assert(true);
      }),
    ]),
    findId: pipe([get("live.EnvironmentArn")]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#describeEnvironments-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Application", group: "ElasticBeanstalk" },
            pickKey: pipe([
              pick(["ApplicationName"]),
              tap((params) => {
                assert(true);
              }),
            ]),
            method: "describeEnvironments",
            getParam: "Environments",
            config,
            decorate: ({ parent }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
              ]),
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { application },
    }) =>
      pipe([
        tap((params) => {
          assert(application);
        }),
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({
            name,
            config,
            namespace,
            UserTags: Tags,
          }),
        }),
      ])(),
  });
