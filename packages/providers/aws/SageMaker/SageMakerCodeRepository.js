const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SageMakerCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("CodeRepositoryArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ CodeRepositoryName }) => {
    assert(CodeRepositoryName);
  }),
  pick(["CodeRepositoryName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerCodeRepository = () => ({
  type: "CodeRepository",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "CodeRepositoryArn",
    "CreationTime",
    "LastModifiedTime",
    "GitConfig.SecretArn",
  ],
  inferName: () =>
    pipe([
      get("CodeRepositoryName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("CodeRepositoryName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("CodeRepositoryArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    secret: {
      type: "Secret",
      group: "SecretsManager",
      dependencyId: ({ lives, config }) => pipe([get("GitConfig.SecretArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeCodeRepository-property
  getById: {
    method: "describeCodeRepository",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listCodeRepositories-property
  getList: {
    method: "listCodeRepositories",
    getParam: "CodeRepositorySummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createCodeRepository-property
  create: {
    method: "createCodeRepository",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateCodeRepository-property
  update: {
    method: "updateCodeRepository",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteCodeRepository-property
  destroy: {
    method: "deleteCodeRepository",
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
    dependencies: { secret },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => secret,
        defaultsDeep({ GitConfig: { SecretArn: getField(secret, "ARN") } })
      ),
    ])(),
});
