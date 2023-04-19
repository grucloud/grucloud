const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("ProjectArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ProjectName }) => {
    assert(ProjectName);
  }),
  pick(["ProjectName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerProject = () => ({
  type: "Project",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "ProjectArn",
    "ProjectId",
    "CreationTime",
    "LastModifiedTime",
    "ProjectStatus",
    "CreatedBy",
    "LastModifiedBy",
  ],
  inferName: () =>
    pipe([
      get("ProjectName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ProjectName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ProjectId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeProject-property
  getById: {
    method: "describeProject",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listProjects-property
  getList: {
    method: "listProjects",
    getParam: "ProjectSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createProject-property
  create: {
    method: "createProject",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("ProjectStatus"), isIn(["CreateCompleted"])]),
    isInstanceError: pipe([get("ProjectStatus"), isIn(["CreateCompleted"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateProject-property
  update: {
    method: "updateProject",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteProject-property
  destroy: {
    method: "deleteProject",
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
