const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CodeDeployCommon");

const pickId = pick(["applicationName"]);

const buildArn =
  ({ config }) =>
  ({ applicationName }) =>
    `arn:aws:codedeploy:${
      config.region
    }:${config.accountId()}:application:${applicationName}`;

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      tags: pipe([
        buildArn({ config }),
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const model = ({ config }) => ({
  package: "codedeploy",
  client: "CodeDeploy",
  ignoreErrorCodes: ["ApplicationDoesNotExistException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#getApplication-property
  getById: {
    method: "getApplication",
    pickId,
    getField: "application",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#listApplications-property
  getList: {
    method: "listApplications",
    getParam: "applications",
    decorate: ({ getById }) =>
      pipe([(applicationName) => ({ applicationName }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#deleteApplication-property
  destroy: { method: "deleteApplication", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html
exports.CodeDeployApplication = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.applicationName")]),
    findId: pipe([get("live.applicationId")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ applicationName: name }), getById]),
    tagResource: tagResource({ buildArn: buildArn({ config }) }),
    untagResource: untagResource({ buildArn: buildArn({ config }) }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          tags: buildTags({
            name,
            config,
            namespace,
            UserTags: tags,
          }),
        }),
      ])(),
  });
