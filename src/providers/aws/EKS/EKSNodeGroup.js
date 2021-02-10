const assert = require("assert");

const {
  map,
  flatMap,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  eq,
  not,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  flatten,
} = require("rubico/x");

const logger = require("../../../logger")({ prefix: "EKSNodeGroup" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  EKSNew,
  buildTagsObject,
  shouldRetryOnException,
} = require("../AwsCommon");
const { getField } = require("../../ProviderCommon");

const findName = get("nodegroupName");
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSNodeGroup = ({ spec, config }) => {
  const eks = EKSNew(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listNodegroups-property
  const getList = async ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList nodeGroup `);
      }),
      () => eks().listClusters(),
      get("clusters"),
      flatMap((clusterName) =>
        pipe([
          () =>
            eks().listNodegroups({
              clusterName,
            }),
          get("nodegroups"),
          map(
            pipe([
              (nodegroupName) =>
                eks().describeNodegroup({ clusterName, nodegroupName }),
              get("nodegroup"),
            ])
          ),
        ])()
      ),
      filter(not(isEmpty)),
      tap((nodeGroups) => {
        logger.debug(`getList nodeGroups result: ${tos(nodeGroups)}`);
      }),
      (nodeGroups) => ({
        total: nodeGroups.length,
        items: nodeGroups,
      }),
      tap(({ total }) => {
        logger.info(`getList # nodeGroups : ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeNodegroup-property
  const getById = ({ clusterName, nodegroupName }) =>
    pipe([
      tap(() => {
        logger.info(
          `getById nodeGroup: ${JSON.stringify({ clusterName, nodegroupName })}`
        );
      }),
      tryCatch(
        pipe([
          () => eks().describeNodegroup({ clusterName, nodegroupName }),
          get("nodegroup"),
        ]),
        tap.if(not(eq(get("code"), "ResourceNotFoundException")), (error) => {
          logger.error(`getById describeNodegroup error: ${tos(error)}`);
          throw error;
        })
      ),
      tap((result) => {
        logger.debug(`getById  nodeGroup result: ${tos(result)}`);
      }),
    ])();

  const isInstanceUp = eq(get("status"), "ACTIVE");

  const isUpById = pipe([getById, isInstanceUp]);
  const isDownById = pipe([
    getById,
    switchCase([isEmpty, () => true, () => false]),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createNodegroup-property
  const create = async ({
    name,
    payload = {},
    resolvedDependencies: { cluster, subnets, role },
  }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create nodeGroup: ${name}, ${tos(payload)}`);
        assert(cluster, "cluster");
        assert(subnets, "subnets");
        assert(role, "role");
      }),
      () => defaultsDeep({})(payload),
      tap((params) => {
        logger.debug(`create nodeGroup: ${name}, params: ${tos(params)}`);
      }),
      (params) => eks().createNodegroup(params),
      get("nodeGroup"),
      () =>
        retryCall({
          name: `nodeGroup create isUpById: ${name}`,
          fn: () =>
            isUpById({
              clusterName: cluster.resource.name,
              nodegroupName: name,
            }),
          config: { retryCount: 12 * 15, retryDelay: 5e3 },
        }),
      tap(() => {
        logger.info(` nodeGroup created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteNodegroup-property
  const destroy = async ({ id, resource }) =>
    pipe([
      tap(() => {
        logger.info(`destroy nodeGroup ${JSON.stringify({ id })}`);
        assert(resource.dependencies.cluster.name);
      }),
      () =>
        eks().deleteNodegroup({
          clusterName: resource.dependencies.cluster.name,
          nodegroupName: id,
        }),
      tap(() =>
        retryCall({
          name: `destroy nodeGroup isDownById: ${id}`,
          fn: () =>
            isDownById({
              clusterName: resource.dependencies.cluster.name,
              nodegroupName: id,
            }),
          config: { retryCount: 12 * 10, retryDelay: 5e3 },
        })
      ),
      tap(() => {
        logger.info(`nodeGroup destroyed ${JSON.stringify({ id })}`);
      }),
    ])();

  const configDefault = async ({
    name,
    properties,
    dependencies: { cluster, role, subnets },
  }) =>
    defaultsDeep({
      subnets: pluck("live.SubnetId")(subnets),
      nodeRole: getField(role, "Arn"),
      clusterName: getField(cluster, "name"),
      nodegroupName: name,
      amiType: "AL2_x86_64",
      capacityType: "ON_DEMAND",
      diskSize: 20,
      instanceTypes: ["t2.micro"],
      scalingConfig: {
        minSize: 1,
        maxSize: 1,
        desiredSize: 1,
      },
      tags: buildTagsObject({ config, name }),
    })(properties);

  return {
    type: "EKSNodeGroup",
    spec,
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
  };
};
