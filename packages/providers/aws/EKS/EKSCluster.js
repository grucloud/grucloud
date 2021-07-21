const assert = require("assert");
const shell = require("shelljs");

const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  eq,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  size,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  buildTagsObject,
} = require("@grucloud/core/Common");
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
  const getList = async ({ params } = {}) =>
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
      tap((clusters) => {
        logger.debug(`getList clusters result: ${tos(clusters)}`);
      }),
      (items) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #clusters : ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeCluster-property
  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById cluster: ${id}`);
    }),
    tryCatch(
      pipe([({ id }) => eks().describeCluster({ name: id }), get("cluster")]),
      switchCase([
        eq(get("code"), "ResourceNotFoundException"),
        (error, { id }) => {
          logger.debug(`getById ${id} ResourceNotFoundException`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById cluster result: ${tos(result)}`);
    }),
  ]);

  const isInstanceUp = eq(get("status"), "ACTIVE");

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property
  const create = async ({
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
      () => eks().createCluster(payload),
      get("cluster"),
      () =>
        retryCall({
          name: `cluster create isUpById: ${name}`,
          fn: () => isUpById({ name, id: name }),
          config: { retryCount: 12 * 20, retryDelay: 5e3 },
        }),
      tap(() => {
        logger.info(`cluster created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteCluster-property
  const destroy = async ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`destroy cluster ${JSON.stringify({ id })}`);
      }),
      () =>
        eks().deleteCluster({
          name: id,
        }),
      tap(() =>
        retryCall({
          name: `cluster isDownById:  id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`cluster destroyed ${JSON.stringify({ id })}`);
      }),
    ])();

  const configDefault = async ({
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

  const hook = ({ resource }) => ({
    name: "cluster",
    onDeployed: {
      init: () => {
        logger.info(`cluster onDeployed hook init ${resource.name}`);
        return {};
      },
      actions: [
        {
          name: "Update kubeconfig",
          command: async () => {
            const command = `aws eks update-kubeconfig --name ${resource.name}`;
            logger.info(`running ${command}`);
            if (process.env.CONTINUOUS_INTEGRATION) {
              //aws cli not installed on circleci
              return;
            }
            const { stdout, stderr, code } = shell.exec(command, {
              silent: true,
            });
            if (code !== 0) {
              throw {
                message: `command '${command}' failed`,
                stdout,
                stderr,
                code,
              };
            }
          },
        },
      ],
    },
    onDestroyed: {
      init: async () => {
        logger.info(`cluster onDestroyed hook init ${resource.name}`);
        const clusterLive = await resource.getLive();
        return { clusterLive };
      },
      actions: [
        {
          name: `Remove cluster from kubeconfig`,
          command: async ({ clusterLive }) => {
            if (!clusterLive) {
              return;
            }
            const command = `kubectl config delete-context ${clusterLive.arn}; kubectl config delete-cluster ${clusterLive.arn}`;
            logger.info(`running ${command}`);
            if (process.env.CONTINUOUS_INTEGRATION) {
              //kubectl not installed on circleci
              return;
            }
            const { stdout, stderr, code } = shell.exec(command, {
              silent: true,
            });
            logger.info(`code: ${code}`);
            logger.info(`stderr: ${stderr}`);
            logger.info(`stdout: ${stdout}`);
          },
        },
      ],
    },
  });

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
    hook,
  };
};
