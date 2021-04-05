const assert = require("assert");
const { map, pipe, tap, tryCatch, get, switchCase, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

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

const findName = () => {
  throw Error("TODO findName");
};
const findId = () => {
  throw Error("TODO findId");
};

exports.AwsLoadBalancer = ({ spec, config }) => {
  const elb = ELBNew(config);

  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => {
        throw Error("TODO getList");
      },
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById ${id}`);
    }),
    () => {
      throw Error("TODO getById");
    },
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isInstanceUp = (instance) => {
    throw Error("TODO isInstanceUp");
  };

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        logger.debug(`create: ${name}, ${tos(payload)}`);
      }),
      () => {
        throw Error("TODO create");
      },
      tap(() => {
        logger.info(`created:`);
      }),
    ])();

  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live), name: findName(live) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ name, id })}`);
          }),
          () => {
            throw Error("TODO destroy");
          },
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ name, id })}`);
          }),
        ])(),
    ]);

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({})(properties);

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
