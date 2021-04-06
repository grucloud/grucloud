const assert = require("assert");
const { map, pipe, tap, get, not } = require("rubico");
const { first, defaultsDeep, isEmpty } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "LoadBalancer",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  ELBNew,
  buildTags,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findName = get("LoadBalancerName");
const findId = findName;

exports.AwsLoadBalancer = ({ spec, config }) => {
  const elb = ELBNew(config);

  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => elb().describeLoadBalancers(params),
      get("LoadBalancerDescriptions"),
      tap((results) => {
        logger.debug(`getList: result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: #total: ${total}`);
      }),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => ({ LoadBalancerNames: [name] }),
      (params) => elb().describeLoadBalancers(params),
      get("LoadBalancerDescriptions"),
      first,
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) => getByName({ name: id });

  const isInstanceUp = not(isEmpty);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.debug(`create: ${name}, ${tos(payload)}`);
      }),
      () => elb().createLoadBalancer(payload),
      tap(() =>
        retryCall({
          name: `load balancer isUpById: ${name} id: ${id}`,
          fn: () => isUpById({ name, id }),
          config,
        })
      ),
      // Tag the resource
      tap(() =>
        elb().addTags({
          LoadBalancerNames: [name],
          Tags: buildTags({ name, config, UserTags: payload.Tags }),
        })
      ),
      tap(({ DNSName }) => {
        logger.info(`created: ${DNSName}`);
      }),
    ])();

  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live), name: findName(live) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ name })}`);
          }),
          () => ({
            LoadBalancerName: name,
          }),
          (params) => elb().deleteLoadBalancer(params),
          tap(() =>
            retryCall({
              name: `load balancer isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ name })}`);
          }),
        ])(),
    ]);

  const configDefault = async ({
    name,
    properties,
    dependencies: { subnets, securityGroups },
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(securityGroups));
        assert(Array.isArray(subnets));
      }),
      () => properties,
      defaultsDeep({
        LoadBalancerName: name,
        SecurityGroups: map((securityGroup) =>
          getField(securityGroup, "GroupId")
        )(securityGroups),
        Subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
      }),
    ])();

  return {
    type: "LoadBalancer",
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
  };
};
