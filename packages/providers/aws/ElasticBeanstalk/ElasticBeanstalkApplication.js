const assert = require("assert");
const { pipe, tap, get, pick, omit } = require("rubico");
const { defaultsDeep, unless, when } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

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
  pick(["ApplicationName"]),
  tap(({ ApplicationName }) => {
    assert(ApplicationName);
  }),
]);
const buildArn = () => pipe([get("ApplicationArn")]);

const decorate = ({ endpoint }) =>
  pipe([
    unless(
      get(
        "ResourceLifecycleConfig.VersionLifecycleConfig.MaxCountRule.Enabled"
      ),
      omit(["ResourceLifecycleConfig.VersionLifecycleConfig.MaxCountRule"])
    ),
    unless(
      get("ResourceLifecycleConfig.VersionLifecycleConfig.MaxAgeRule.Enabled"),
      omit(["ResourceLifecycleConfig.VersionLifecycleConfig.MaxAgeRule"])
    ),
    omitIfEmpty(["ResourceLifecycleConfig.VersionLifecycleConfig"]),

    omitIfEmpty([
      "ResourceLifecycleConfig.ServiceRole",
      "ResourceLifecycleConfig",
    ]),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const model = ({ config }) => ({
  package: "elastic-beanstalk",
  client: "ElasticBeanstalk",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#describeApplications-property
  getById: {
    method: "describeApplications",
    getField: "Applications",
    pickId: pipe([
      tap(({ ApplicationName }) => {
        assert(ApplicationName);
      }),
      ({ ApplicationName }) => ({ ApplicationNames: [ApplicationName] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#describeApplications-property
  getList: {
    method: "describeApplications",
    getParam: "Applications",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([get("Application")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
    pickId,
  },
});

exports.ElasticBeanstalkApplication = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("ApplicationName")]),
    findId: () => pipe([get("ApplicationName")]),
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
      dependencies: { serviceRole },
      config,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({
            name,
            config,
            namespace,
            UserTags: Tags,
          }),
        }),
        when(
          () => serviceRole,
          defaultsDeep({
            ResourceLifecycleConfig: {
              ServiceRole: getField(serviceRole, "Arn"),
            },
          })
        ),
      ])(),
  });
