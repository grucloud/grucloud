const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./ElasticBeanstalkCommon");
const { buildTags } = require("../AwsCommon");

const pickId = pipe([
  pick(["ApplicationName", "VersionLabel"]),
  tap(({ ApplicationName, VersionLabel }) => {
    assert(ApplicationName);
    assert(VersionLabel);
  }),
]);

const buildArn = () => pipe([get("ApplicationVersionArn")]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const model = ({ config }) => ({
  package: "elastic-beanstalk",
  client: "ElasticBeanstalk",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#describeApplicationVersions-property
  getById: {
    method: "describeApplicationVersions",
    getField: "ApplicationVersions",
    pickId: pipe([
      tap(({ VersionLabel, ApplicationName }) => {
        assert(VersionLabel);
        assert(ApplicationName);
      }),
      ({ VersionLabel, ApplicationName }) => ({
        VersionLabels: [VersionLabel],
        ApplicationName,
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#createApplicationVersion-property
  create: {
    method: "createApplicationVersion",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "Ready")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#updateApplicationVersion-property
  update: {
    method: "updateApplicationVersion",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#deleteApplicationVersion-property
  destroy: {
    method: "deleteApplicationVersion",
    pickId,
  },
});

exports.ElasticBeanstalkApplicationVersion = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([
      get("live"),
      ({ ApplicationName, VersionLabel }) =>
        `${ApplicationName}::${VersionLabel}`,
    ]),
    findId: pipe([get("live.ApplicationVersionArn")]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#describeApplicationVersions-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Application", group: "ElasticBeanstalk" },
            pickKey: pipe([pick(["ApplicationName"])]),
            method: "describeApplicationVersions",
            getParam: "ApplicationVersions",
            config,
            decorate,
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
