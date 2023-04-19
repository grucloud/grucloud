const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  ignoreErrorCodes,
  arnToId,
} = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("SpaceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DomainId, SpaceName }) => {
    assert(DomainId);
    assert(SpaceName);
  }),
  pick(["DomainId", "SpaceName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerSpace = () => ({
  type: "Space",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "DomainId",
    "SpaceArn",
    "CreationTime",
    "LastModifiedTime",
    "Status",
    "CreatedBy",
    "LastModifiedBy",
  ],
  inferName: () =>
    pipe([
      get("SpaceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("SpaceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("SpaceId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    domain: {
      type: "Domain",
      group: "SageMaker",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DomainId"),
          tap((DomainId) => {
            assert(DomainId);
          }),
        ]),
    },
    imageJupyter: {
      type: "Image",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "SpaceSettings.JupyterServerAppSettings.DefaultResourceSpec.SageMakerImageArn"
          ),
        ]),
    },
    imageVersionJupyter: {
      type: "ImageVersion",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "SpaceSettings.JupyterServerAppSettings.DefaultResourceSpec.SageMakerImageVersionArn"
          ),
        ]),
    },
    lifecycleJupyter: {
      type: "ImageVersion",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "SpaceSettings.JupyterServerAppSettings.DefaultResourceSpec.LifecycleConfigArn"
          ),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeSpace-property
  getById: {
    method: "describeSpace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listSpaces-property
  getList: {
    method: "listSpaces",
    getParam: "Spaces",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createSpace-property
  create: {
    method: "createSpace",
    pickCreated: ({ payload }) => pipe([defaultsDeep(payload), arnToId("")]),
    isInstanceUp: pipe([get("Status"), isIn(["InService"])]),
    isInstanceError: pipe([get("Status"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateSpace-property
  update: {
    method: "updateSpace",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteSpace-property
  destroy: {
    method: "deleteSpace",
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
    dependencies: { domain },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(domain);
      }),
      () => otherProps,
      defaultsDeep({
        DomainId: getField(domain, "DomainId"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
