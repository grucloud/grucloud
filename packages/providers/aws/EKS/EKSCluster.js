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
  flatten,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSCluster" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  buildTagsObject,
} = require("@grucloud/core/Common");
const { EKSNew, shouldRetryOnException } = require("../AwsCommon");

const findName = get("name");
const findId = findName;

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
      (clusters) => ({
        total: clusters.length,
        items: clusters,
      }),
      tap((clusters) => {
        logger.info(`getList #clusters : ${clusters.length}`);
        logger.debug(`getList clusters result: ${tos(clusters)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

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
    resolvedDependencies: { subnets, securityGroups, role },
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
        defaultsDeep({
          resourcesVpcConfig: {
            securityGroupIds: pluck("live.GroupId")(securityGroups),
            subnetIds: pluck("live.SubnetId")(subnets),
          },
          roleArn: role.live.Arn,
        })(payload),
      tap((params) => {
        logger.debug(`create cluster: ${name}, params: ${tos(params)}`);
      }),
      (params) => eks().createCluster(params),
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

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ name, tags: buildTagsObject({ config, name }) })(properties);

  const hook = ({ resource }) => ({
    name: "cluster",
    onDeployed: {
      init: () => {
        logger.info(`cluster hook init ${resource.name}`);
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
      init: () => {},
      actions: [],
    },
  });

  return {
    type: "EKSCluster",
    spec,
    isInstanceUp,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    hook,
  };
};
