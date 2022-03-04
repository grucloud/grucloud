const assert = require("assert");

const { map, pipe, tap, get, not, eq, omit, pick } = require("rubico");
const { defaultsDeep, includes, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTagsObject, shellRun } = require("@grucloud/core/Common");
const { findNamespaceInTagsObject } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const { createEKS, waitForUpdate } = require("./EKSCommon");

const findName = get("live.name");
const findId = findName;
const pickId = pick(["name"]);

const findDependencies = ({ live }) => [
  { type: "Vpc", group: "EC2", ids: [get("resourcesVpcConfig.vpcId")(live)] },
  { type: "Role", group: "IAM", ids: [live.roleArn] },
  {
    type: "Subnet",
    group: "EC2",
    ids: get("resourcesVpcConfig.subnetIds")(live),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    ids: [
      get("resourcesVpcConfig.clusterSecurityGroupId")(live),
      ...get("resourcesVpcConfig.securityGroupIds")(live),
    ],
  },
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSCluster = ({ spec, config }) => {
  const eks = createEKS(config);
  const client = AwsClient({ spec, config })(eks);

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
    decorate: () =>
      pipe([
        tap((name) => {
          assert(name);
        }),
        (name) => ({ name }),
        getById,
      ]),
  });
  const getByName = getById;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeCluster-property

  const kubeConfigUpdate = ({ name }) =>
    pipe([
      tap(() => {
        assert(name);
        logger.debug(`kubeConfigUpdate: ${name}`);
      }),
      tap.if(
        () => !process.env.CONTINUOUS_INTEGRATION,
        pipe([() => `aws eks update-kubeconfig --name ${name}`, shellRun])
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
    isInstanceUp: eq(get("status"), "ACTIVE"),
    shouldRetryOnException: ({ error }) =>
      pipe([
        tap(() => {
          logger.error(`createCluster isExpectedException ${tos(error)}`);
        }),
        () => error,
        get("message"),
        or([
          includes("The KeyArn in encryptionConfig provider"),
          includes("Role with arn: "),
        ]),
      ])(),
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
    postDestroy: kubeConfigRemove,
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets, securityGroups, role, key },
  }) =>
    pipe([
      tap(() => {
        assert(subnets, "missing 'subnets' dependency");
        assert(securityGroups, "missing 'securityGroups' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        resourcesVpcConfig: {
          securityGroupIds: map((sg) => getField(sg, "GroupId"))(
            securityGroups
          ),
          subnetIds: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        },
        ...(role && { roleArn: getField(role, "Arn") }),
        ...(key && {
          encryptionConfig: [
            {
              provider: { keyArn: getField(key, "Arn") },
              resources: ["secrets"],
            },
          ],
        }),
        name,
        tags: buildTagsObject({ config, namespace, name }),
      }),
    ])();

  return {
    spec,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTagsObject(config),
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
  };
};
