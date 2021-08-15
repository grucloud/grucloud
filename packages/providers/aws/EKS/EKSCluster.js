const assert = require("assert");
const shell = require("shelljs");

const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  not,
  filter,
  eq,
} = require("rubico");
const { defaultsDeep, includes, size, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTagsObject } = require("@grucloud/core/Common");
const {
  EKSNew,
  shouldRetryOnException,
  findNamespaceInTagsObject,
} = require("../AwsCommon");

const findName = get("live.name");
const findId = findName;

const findDependencies = ({ live }) => [
  { type: "Vpc", group: "ec2", ids: [get("resourcesVpcConfig.vpcId")(live)] },
  { type: "Role", group: "iam", ids: [live.roleArn] },
  {
    type: "Subnet",
    group: "ec2",
    ids: get("resourcesVpcConfig.subnetIds")(live),
  },
  {
    type: "SecurityGroup",
    group: "ec2",
    ids: [
      get("resourcesVpcConfig.clusterSecurityGroupId")(live),
      ...get("resourcesVpcConfig.securityGroupIds")(live),
    ],
  },
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSCluster = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const eks = EKSNew(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listClusters-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList cluster ${JSON.stringify({ params })}`);
      }),
      () => eks().listClusters(params),
      get("clusters"),
      tap((clusters) => {
        logger.info(`getList clusters: ${tos(clusters)}`);
      }),
      map(
        pipe([
          (name) =>
            eks().describeCluster({
              name,
            }),
          get("cluster"),
        ])
      ),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName cluster: ${name}`);
      }),
      tryCatch(
        pipe([() => eks().describeCluster({ name }), get("cluster")]),
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => {
            logger.debug(`getByName ${name} ResourceNotFoundException`);
          },
          (error) => {
            logger.debug(`getByName error: ${tos(error)}`);
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getByName cluster result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeCluster-property
  const isInstanceUp = eq(get("status"), "ACTIVE");

  const isUpByName = pipe([getByName, isInstanceUp]);
  const isDownByName = pipe([getByName, isEmpty]);

  const kubeConfigUpdate = ({ name }) =>
    pipe([
      tap(() => {
        assert(name);
        logger.debug(`kubeConfigUpdate: ${name}`);
      }),
      tap.if(
        () => !process.env.CONTINUOUS_INTEGRATION,
        pipe([
          () => `aws eks update-kubeconfig --name ${name}`,
          (command) =>
            pipe([
              () =>
                shell.exec(command, {
                  silent: true,
                }),
              tap.if(not(eq(get("code"), 0)), (result) => {
                throw {
                  message: `command '${command}' failed`,
                  ...result,
                };
              }),
            ])(),
        ])
      ),
    ])();

  const kubeConfigRemove = ({ arn }) =>
    pipe([
      tap(() => {
        assert(arn);
        logger.debug(`kubeConfigRemove: ${arn}`);
      }),
      tap.if(
        () => !process.env.CONTINUOUS_INTEGRATION,
        pipe([
          () =>
            `kubectl config delete-context ${arn}; kubectl config delete-cluster ${arn}`,
          (command) =>
            pipe([
              () =>
                shell.exec(command, {
                  silent: true,
                }),
              tap.if(not(eq(get("code"), 0)), (result) => {
                logger.error(
                  `command '${command}' failed, ${JSON.stringify(
                    result,
                    4,
                    null
                  )}`
                );
              }),
            ])(),
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property
  const create = ({
    name,
    payload = {},
    resolvedDependencies: { subnets, securityGroups, role, key },
  }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create cluster: ${name}, ${tos(payload)}`);
        assert(Array.isArray(subnets), "subnets");
        assert(Array.isArray(securityGroups), "securityGroups");
        assert(role, "role");
        assert(role.live.Arn, "role.live.Arn");
      }),
      () =>
        retryCall({
          name: `eks createCluster: ${name}`,
          fn: () => eks().createCluster(payload),
          config: { retryCount: 4, retryDelay: 5e3 },
          shouldRetryOnException: ({ error }) =>
            pipe([
              tap(() => {
                logger.error(`createCluster isExpectedException ${tos(error)}`);
              }),
              () => error,
              get("message"),
              includes("The KeyArn in encryptionConfig provider"),
            ])(),
        }),
      get("cluster"),
      () =>
        retryCall({
          name: `cluster create isUpById: ${name}`,
          fn: () => isUpByName({ name }),
          config: { retryCount: 12 * 20, retryDelay: 5e3 },
        }),
      () => kubeConfigUpdate({ name }),
      tap(() => {
        logger.info(`cluster created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteCluster-property
  const destroy = ({ id, name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy cluster ${name}`);
      }),
      () => kubeConfigRemove(live),
      () =>
        eks().deleteCluster({
          name,
        }),
      tap(() =>
        retryCall({
          name: `cluster isDownByName: ${name}`,
          fn: () => isDownByName({ name }),
          config,
        })
      ),
      tap(() => {
        logger.info(`cluster destroyed ${name}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { subnets, securityGroups, role, key },
  }) =>
    defaultsDeep({
      resourcesVpcConfig: {
        securityGroupIds: map((sg) => getField(sg, "GroupId"))(securityGroups),
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
    })(properties);

  return {
    spec,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTagsObject(config),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
