const assert = require("assert");
const { pipe, tap, tryCatch, get, pick, assign, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { throwIfNotAwsError, buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createECR, tagResource, untagResource } = require("./ECRCommon");

const findName = get("live.repositoryName");
const findId = get("live.repositoryArn");
const pickId = pick(["repositoryName", "registryId"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html
exports.EcrRepository = ({ spec, config }) => {
  const ecr = createECR(config);
  const client = AwsClient({ spec, config })(ecr);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRepositoryPolicy-property
  const getRepositoryPolicy = tryCatch(
    pipe([
      pickId,
      (params) => ecr().getRepositoryPolicy(params),
      get("policyText"),
      JSON.parse,
    ]),
    throwIfNotAwsError("RepositoryPolicyNotFoundException")
  );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getLifecyclePolicy-property
  const getLifecyclePolicy = tryCatch(
    pipe([
      pickId,
      (params) => ecr().getLifecyclePolicy(params),
      get("lifecyclePolicyText"),
      JSON.parse,
    ]),
    throwIfNotAwsError("LifecyclePolicyNotFoundException")
  );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#listTagsForResource-property
  const getTags = pipe([
    ({ repositoryArn }) =>
      ecr().listTagsForResource({ resourceArn: repositoryArn }),
    get("tags"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRepositories-property
  const getList = client.getList({
    method: "describeRepositories",
    getParam: "repositories",
    decorate: () =>
      assign({
        policyText: getRepositoryPolicy,
        lifecyclePolicyText: getLifecyclePolicy,
        tags: getTags,
      }),
  });

  const getById = client.getById({
    pickId: ({ repositoryName }) => ({ repositoryNames: [repositoryName] }),
    method: "describeRepositories",
    getField: "repositories",
    ignoreErrorCodes: ["RepositoryNotFoundException"],
  });

  const getByName = pipe([({ name }) => ({ repositoryName: name }), getById]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#setRepositoryPolicy-property
  const setRepositoryPolicy = ({ payload }) =>
    tap.if(
      () => payload.policyText,
      pipe([
        pickId,
        assign({ policyText: () => JSON.stringify(payload.policyText) }),
        (params) => ecr().setRepositoryPolicy(params),
      ])
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putLifecyclePolicy-property
  const putLifecyclePolicy = ({ payload }) =>
    tap.if(
      () => payload.lifecyclePolicyText,
      pipe([
        pickId,
        assign({
          lifecyclePolicyText: () =>
            JSON.stringify(payload.lifecyclePolicyText),
        }),
        ecr().putLifecyclePolicy,
      ])
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#createRepository-property
  const create = ({ payload, name }) =>
    pipe([
      () => payload,
      omit(["policyText", "lifecyclePolicyText"]),
      ecr().createRepository,
      get("repository"),
      setRepositoryPolicy({ payload }),
      putLifecyclePolicy({ payload }),
    ])();

  const update = ({ payload, live, name, diff }) =>
    pipe([
      () => live,
      tap(() => {
        assert(diff);
        assert(payload);
        assert(live);
      }),
      //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putImageScanningConfiguration-property
      setRepositoryPolicy({ payload }),
      putLifecyclePolicy({ payload }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRepository-property

  const destroy = client.destroy({
    pickId,
    extraParam: { force: true },
    method: "deleteRepository",
    ignoreErrorCodes: ["RepositoryNotFoundException"],
    config,
  });

  //TODO user tags
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { kmsKey },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        repositoryName: name,
        tags: buildTags({ config, namespace, name }),
        ...(kmsKey &
          {
            encryptionConfiguration: {
              encryptionType: "KMS",
              kmsKey: getField(kmsKey, "Arn"),
            },
          }),
      }),
    ])();

  return {
    spec,
    findId,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ ecr }),
    untagResource: untagResource({ ecr }),
  };
};
