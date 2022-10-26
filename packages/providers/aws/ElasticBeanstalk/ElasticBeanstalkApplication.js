const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./ElasticBeanstalkCommon");
const { buildTags } = require("../AwsCommon");

const pickId = pipe([
  pick(["ApplicationName"]),
  tap(({ ApplicationName }) => {
    assert(ApplicationName);
  }),
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#describeApplications-property
  getList: {
    method: "describeApplications",
    getParam: "Applications",
    // decorate: ({ getById }) =>
    //   pipe([({ id }) => ({ applicationId: id }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([identity]),
    //isInstanceUp: pipe([eq(get("state"), "CREATED")]),
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

const buildArn = () => pipe([get("ApplicationArn")]);

exports.ElasticBeanstalkApplication = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ApplicationName")]),
    findId: pipe([get("live.ApplicationName")]),
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
      dependencies: {},
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
      ])(),
  });
