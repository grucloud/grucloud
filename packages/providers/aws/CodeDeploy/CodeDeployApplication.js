const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { Tagger } = require("./CodeDeployCommon");

const pickId = pick(["applicationName"]);

const buildArn =
  ({ config }) =>
  ({ applicationName }) =>
    `arn:aws:codedeploy:${
      config.region
    }:${config.accountId()}:application:${applicationName}`;

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      tags: pipe([
        buildArn({ config }),
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html
exports.CodeDeployApplication = ({}) => ({
  type: "Application",
  package: "codedeploy",
  client: "CodeDeploy",
  inferName: () => pipe([get("applicationName")]),
  findName: () => pipe([get("applicationName")]),
  findId: () => pipe([get("applicationId")]),
  ignoreErrorCodes: ["ApplicationDoesNotExistException"],
  omitProperties: ["applicationId", "createTime", "linkedToGitHub"],
  propertiesDefault: {},
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
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ applicationName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
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
