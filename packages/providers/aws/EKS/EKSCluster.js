const assert = require("assert");
const { map, pipe, tap, get, not, eq, omit, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTagsObject, shellRun } = require("@grucloud/core/Common");
const { findNamespaceInTagsObject } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const {
  createEKS,
  waitForUpdate,
  tagResource,
  untagResource,
} = require("./EKSCommon");

const findName = get("live.name");
const findId = get("live.arn");
const pickId = pick(["name"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSCluster = ({ spec, config }) => {
  const eks = createEKS(config);
  const client = AwsClient({ spec, config })(eks);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeCluster-property

  const getById = client.getById({
    pickId,
    method: "describeCluster",
    getField: "cluster",
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listClusters-property
  const getList = client.getList({
    method: "listClusters",
    getParam: "clusters",
    decorate: () => pipe([(name) => ({ name }), getById]),
  });
  const getByName = getById;

  const kubeConfigUpdate = ({ name }) =>
    pipe([
      tap(() => {
        assert(name);
        logger.debug(`kubeConfigUpdate: ${name}`);
      }),
      tap.if(
        () => !process.env.CONTINUOUS_INTEGRATION,
        pipe([
          () =>
            `aws eks --region ${config.region} update-kubeconfig --name ${name}`,
          shellRun,
        ])
      ),
    ])();

  const kubeConfigRemove = ({ arn }) =>
    pipe([
      tap(() => {
        //assert(arn);
        logger.debug(`kubeConfigRemove: ${arn}`);
      }),
      tap.if(
        () => !process.env.CONTINUOUS_INTEGRATION && arn,
        pipe([
          () =>
            `kubectl config delete-context ${arn}; kubectl config delete-cluster ${arn}`,
          shellRun,
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property

  const create = client.create({
    method: "createCluster",
    pickId,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    isInstanceError: eq(get("status"), "FAILED"),
    isInstanceUp: eq(get("status"), "ACTIVE"),
    shouldRetryOnExceptionMessages: [
      "The KeyArn in encryptionConfig provider",
      "Role with arn: ",
    ],
    getById,
    postCreate:
      ({ name }) =>
      () =>
        kubeConfigUpdate({ name }),
    configIsUp: { retryCount: 12 * 25, retryDelay: 5e3 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#updateClusterConfig-property
  // TODO update
  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`updateClusterConfig: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      pick(["name", "clientRequestToken", "logging", "resourcesVpcConfig"]),
      omit([
        "resourcesVpcConfig.securityGroupIds",
        "resourcesVpcConfig.subnetIds",
      ]),
      eks().updateClusterConfig,
      get("update"),
      tap((result) => {
        logger.info(`updateClusterConfig: ${tos({ result })}`);
      }),
      get("id"),
      (updateId) =>
        waitForUpdate({ eks })({
          name,
          updateId: updateId,
        }),
    ])();

  // https://docs.aws.amazon.com/eks/latest/APIReference/API_DeleteCluster.html
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteCluster-property
  const destroy = client.destroy({
    pickId,
    method: "deleteCluster",
    getById,
    ignoreErrorCodes: ["ResourceNotFoundException"],
    ignoreErrorMessages: ["No cluster found for name"],
    postDestroy: kubeConfigRemove,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { subnets, securityGroups, role },
  }) =>
    pipe([
      tap(() => {
        assert(subnets, "missing 'subnets' dependency");
        assert(name);
      }),
      () => otherProps,
      defaultsDeep({
        resourcesVpcConfig: {
          subnetIds: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        },
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          resourcesVpcConfig: {
            securityGroupIds: map((sg) => getField(sg, "GroupId"))(
              securityGroups
            ),
          },
        })
      ),
      when(() => role, defaultsDeep({ roleArn: getField(role, "Arn") })),
    ])();

  return {
    spec,
    findId,
    findNamespace: findNamespaceInTagsObject(config),
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ eks }),
    untagResource: untagResource({ eks }),
  };
};
