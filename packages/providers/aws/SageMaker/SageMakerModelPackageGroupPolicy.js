const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ModelPackageGroupName }) => {
    assert(ModelPackageGroupName);
  }),
  pick(["ModelPackageGroupName"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.ModelPackageGroupName);
    }),
    defaultsDeep({ ModelPackageGroupName: live.ModelPackageGroupName }),
    tap(({ ResourcePolicy }) => {
      assert(ResourcePolicy);
    }),
    assign({ ResourcePolicy: pipe([get("ResourcePolicy"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  tap(({ ResourcePolicy }) => {
    assert(ResourcePolicy);
  }),
  assign({
    ResourcePolicy: pipe([get("ResourcePolicy"), JSON.stringify]),
  }),
]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerModelPackageGroupPolicy = () => ({
  type: "ModelPackageGroupPolicy",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: ["ModelPackageGroupArn"],
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
  dependencies: {
    modelPackageGroup: {
      type: "ModelPackageGroup",
      group: "SageMaker",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ModelPackageGroupName"),
          tap((ModelPackageGroupName) => {
            assert(ModelPackageGroupName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#getModelPackageGroupPolicy-property
  getById: {
    method: "getModelPackageGroupPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#getModelPackageGroupPolicy-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ModelPackageGroup", group: "SageMaker" },
          pickKey: pipe([
            pick(["ModelPackageGroupName"]),
            tap(({ ModelPackageGroupName }) => {
              assert(ModelPackageGroupName);
            }),
          ]),
          method: "getModelPackageGroupPolicy",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#putModelPackageGroupPolicy-property
  create: {
    filterPayload,
    method: "putModelPackageGroupPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#putModelPackageGroupPolicy-property
  update: {
    method: "putModelPackageGroupPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteModelPackageGroupPolicy-property
  destroy: {
    method: "deleteModelPackageGroupPolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
