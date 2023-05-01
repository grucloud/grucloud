const assert = require("assert");
const { pipe, tap, tryCatch, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { throwIfNotAwsError, buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreResourceCdk } = require("../AwsCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../IAM/AwsIamCommon");

const { Tagger } = require("./ECRCommon");

const buildArn = () =>
  pipe([
    get("repositoryArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findName = () =>
  pipe([
    get("repositoryName"),
    tap((repositoryName) => {
      assert(repositoryName);
    }),
  ]);

const findId = () =>
  pipe([
    get("repositoryArn"),
    tap((repositoryArn) => {
      assert(repositoryArn);
    }),
  ]);

const pickId = pipe([
  pick(["repositoryName", "registryId"]),
  tap(({ repositoryName, registryId }) => {
    assert(repositoryName);
    assert(registryId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRepositoryPolicy-property
const getRepositoryPolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    tryCatch(
      pipe([
        pickId,
        endpoint().getRepositoryPolicy,
        get("policyText"),
        JSON.parse,
      ]),
      throwIfNotAwsError("RepositoryPolicyNotFoundException")
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getLifecyclePolicy-property
const getLifecyclePolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    tryCatch(
      pipe([
        pickId,
        endpoint().getLifecyclePolicy,
        get("lifecyclePolicyText"),
        JSON.parse,
      ]),
      throwIfNotAwsError("LifecyclePolicyNotFoundException")
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#listTagsForResource-property
const getTags = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ repositoryArn }) => ({ resourceArn: repositoryArn }),
    endpoint().listTagsForResource,
    get("tags"),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      policyText: getRepositoryPolicy({ endpoint }),
      lifecyclePolicyText: getLifecyclePolicy({ endpoint }),
      tags: getTags({ endpoint }),
    }),
    omitIfEmpty(["lifecyclePolicyText", "policyText"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#setRepositoryPolicy-property
const setRepositoryPolicy = ({ endpoint, payload }) =>
  tap.if(
    () => payload.policyText,
    pipe([
      pickId,
      assign({ policyText: () => JSON.stringify(payload.policyText) }),
      endpoint().setRepositoryPolicy,
    ])
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putLifecyclePolicy-property
const putLifecyclePolicy = ({ endpoint, payload }) =>
  tap.if(
    () => payload.lifecyclePolicyText,
    pipe([
      pickId,
      assign({
        lifecyclePolicyText: () => JSON.stringify(payload.lifecyclePolicyText),
      }),
      endpoint().putLifecyclePolicy,
    ])
  );

exports.ECRRepository = () => ({
  type: "Repository",
  package: "ecr",
  client: "ECR",
  propertiesDefault: {},
  omitProperties: ["repositoryArn", "registryId", "repositoryUri", "createdAt"],
  inferName: findName,
  findName,
  findId,
  ignoreErrorCodes: ["RepositoryNotFoundException"],
  ignoreResource: ignoreResourceCdk,
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      pick([
        "repositoryName",
        "imageTagMutability",
        "imageScanningConfiguration",
        "encryptionConfiguration",
        "policyText",
        "lifecyclePolicyText",
      ]),
      when(
        get("policyText"),
        assign({
          policyText: pipe([
            get("policyText"),
            assignPolicyAccountAndRegion({ providerConfig, lives }),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRepositories-property
  getById: {
    pickId: pipe([
      tap(({ repositoryName }) => {
        assert(repositoryName);
      }),
      ({ repositoryName }) => ({ repositoryNames: [repositoryName] }),
    ]),
    method: "describeRepositories",
    getField: "repositories",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRepositories-property
  getList: {
    method: "describeRepositories",
    getParam: "repositories",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#createRepository-property
  create: {
    filterPayload: pipe([omit(["policyText", "lifecyclePolicyText"])]),
    method: "createRepository",
    pickCreated: ({ payload }) => pipe([get("repository")]),
    postCreate: ({ endpoint, payload }) =>
      pipe([
        tap((params) => {
          assert(payload);
        }),
        setRepositoryPolicy({ endpoint, payload }),
        putLifecyclePolicy({ endpoint, payload }),
      ]),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => live,
        //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putImageScanningConfiguration-property
        setRepositoryPolicy({ endpoint, payload }),
        putLifecyclePolicy({ endpoint, payload }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRepository-property
  destroy: {
    pickId: pipe([defaultsDeep({ force: true })]),
    method: "deleteRepository",
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { tags, kmsKey },
    config,
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        repositoryName: name,
        tags: buildTags({ config, namespace, name, UserTags: tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          encryptionConfiguration: {
            encryptionType: "KMS",
            kmsKey: getField(kmsKey, "Arn"),
          },
        })
      ),
    ])(),
});
