const assert = require("assert");
const { map, pipe, tap, get, not } = require("rubico");
const { first, defaultsDeep, isEmpty, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "ELBListener",
});

const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  buildTags,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findName = findNameInTags;
const findId = get("ListenerArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBListener = ({ spec, config }) => {
  const elb = ELBv2New(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getList = async () =>
    pipe([
      tap(() => {
        logger.info(`getList listener`);
      }),
      () => elb().describeLoadBalancers({}),
      get("LoadBalancers"),
      pluck("LoadBalancerArn"),
      map((LoadBalancerArn) => elb().describeListeners({ LoadBalancerArn })),
      get("Listeners"),
      tap((results) => {
        logger.debug(`getList listener result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: listener #total: ${total}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeListeners-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => ({ Names: [name] }),
      (params) => elb().describeListeners(params),
      get("Listeners"),
      first,
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) => getByName({ name: id });

  const isInstanceUp = not(isEmpty);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createListener-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create listener : ${name}`);
        logger.debug(`${tos(payload)}`);
      }),
      () => elb().createListener(payload),
      tap(() =>
        retryCall({
          name: `listener isUpById: ${name} id: ${id}`,
          fn: () => isUpById({ name, id }),
          config,
        })
      ),
      tap((result) => {
        logger.info(`created listener ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteListener-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live), name: findName(live) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy listener ${JSON.stringify({ id })}`);
          }),
          () => ({
            ListenerArn: id,
          }),
          (params) => elb().deleteListener(params),
          tap(() =>
            retryCall({
              name: `listener isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed listener ${JSON.stringify({ name })}`);
          }),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createListener-property
  const configDefault = async ({
    name,
    properties,
    dependencies: { loadBalancer },
  }) =>
    pipe([
      tap(() => {
        assert(loadBalancer);
      }),
      () => properties,
      defaultsDeep({
        LoadBalancerArn: getField(loadBalancer, "LoadBalancerArn"),
        Tags: buildTags({ name, config }),
      }),
    ])();

  return {
    type: "Listener",
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
