const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("ModelPackageGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ModelPackageGroupName }) => {
    assert(ModelPackageGroupName);
  }),
  pick(["ModelPackageGroupName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerModelPackageGroup = () => ({
  type: "ModelPackageGroup",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "ModelPackageGroupArn",
    "CreationTime",
    "CreatedBy",
    "ModelPackageGroupStatus",
  ],
  inferName: () =>
    pipe([
      get("ModelPackageGroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ModelPackageGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ModelPackageGroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeModelPackageGroup-property
  getById: {
    method: "describeModelPackageGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listModelPackageGroups-property
  getList: {
    method: "listModelPackageGroups",
    getParam: "ModelPackageGroups",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createModelPackageGroup-property
  create: {
    method: "createModelPackageGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([
      get("StaModelPackageGroupStatustus"),
      isIn(["Completed"]),
    ]),
    isInstanceError: pipe([get("ModelPackageGroupStatus"), isIn(["Failed"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateModelPackageGroup-property
  update: {
    method: "updateModelPackageGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteModelPackageGroup-property
  destroy: {
    method: "deleteModelPackageGroup",
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
