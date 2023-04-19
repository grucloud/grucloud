const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("AppArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AppName, AppType, DomainId, SpaceName, UserProfileName }) => {
    assert(AppName);
    assert(AppType);
    assert(DomainId);
    assert(SpaceName || UserProfileName);
  }),
  pick(["AppName", "AppType", "DomainId", "SpaceName", "UserProfileName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerApp = () => ({
  type: "App",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "AppArn",
    "DomainId",
    "Status",
    "LastHealthCheckTimestamp",
    "LastUserActivityTimestamp",
    "ResourceSpec.SageMakerImageArn",
    "ResourceSpec.SageMakerImageVersionArn",
    "ResourceSpec.LifecycleConfigArn",
    "CreationTime",
    "UserProfileName",
  ],
  inferName: () =>
    pipe([
      get("AppName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("AppName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AppArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    domain: {
      type: "Domain",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => pipe([get("DomainId")]),
    },
    image: {
      type: "Image",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([get("ResourceSpec.SageMakerImageArn")]),
    },
    imageVersion: {
      type: "ImageVersion",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([get("ResourceSpec.SageMakerImageVersionArn")]),
    },
    //TODO
    lifecycleConfig: {
      type: "NotebookInstanceLifecycleConfig",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        pipe([get("ResourceSpec.LifecycleConfigArn")]),
    },
    userProfile: {
      type: "UserProfile",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => pipe([get("UserProfileName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeApp-property
  getById: {
    method: "describeApp",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listApps-property
  getList: {
    method: "listApps",
    getParam: "Apps",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createApp-property
  create: {
    method: "createApp",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["InService"])]),
    isInstanceError: pipe([get("Status"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateApp-property
  update: {
    method: "updateApp",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteApp-property
  destroy: {
    method: "deleteApp",
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
    dependencies: { domain, image, imageVersion, lifecycleConfig, userProfile },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(domain);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        DomainId: getField(domain, "DomainId"),
      }),
      when(
        () => image,
        defaultsDeep({
          ResourceSpec: {
            SageMakerImageArn: getField(image, "ImageArn"),
            SageMakerImageVersionArn: getField(imageVersion, "ImageVersionArn"),
          },
        })
      ),
      when(
        () => lifecycleConfig,
        defaultsDeep({
          ResourceSpec: {
            //TODO
            LifecycleConfigArn: getField(lifecycleConfig, "Arn"),
          },
        })
      ),
      when(
        () => userProfile,
        defaultsDeep({
          UserProfileName: get("config.UserProfileName")(userProfile),
        })
      ),
    ])(),
});
