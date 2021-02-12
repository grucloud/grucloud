const assert = require("assert");
const urljoin = require("url-join");

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
  find,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  flatten,
} = require("rubico/x");
const { retryCall, retryCallOnError } = require("../Retry");

const logger = require("../../logger")({ prefix: "K8sClient" });
const { createAxiosMakerK8s, getServerUrl } = require("./K8sCommon");
const { tos } = require("../../tos");

const {
  getByNameCore,
  findField,
  isUpByIdCore,
  isDownByIdCore,
  logError,
  axiosErrorToJSON,
} = require("../Common");

module.exports = K8sClient = ({
  spec,
  config,
  configDefault,
  pathList,
  pathGet,
  pathCreate,
  pathDelete,
}) => {
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.accessToken);
  assert(config.kubeConfig);
  assert(pathList);
  assert(pathGet);
  assert(pathCreate);
  assert(pathDelete);

  const { kubeConfig } = config;
  const { type, providerName } = spec;

  assert(providerName);

  const resourceKey = (resource) => {
    assert(resource.provider);
    assert(resource.type);
    assert(resource.name);

    return `${resource.provider}::${resource.type}::${get(
      "namespace",
      "default"
    )(resource.meta)}::${resource.name}`;
  };

  const nameToUri = ({ name, meta }) =>
    `${providerName}::${type}::${meta.namespace}::${name}`;

  const displayName = ({ name, meta: { namespace = "default" } }) =>
    `${namespace}::${name}`;

  const findName = pipe([
    get("metadata.name"),
    tap((name) => {
      assert(name);
    }),
  ]);

  const findMeta = pipe([
    get("metadata"),
    tap((metadata) => {
      assert(metadata);
    }),
  ]);

  const findId = findName;

  const axios = () => createAxiosMakerK8s({ config });

  const getList = tryCatch(
    pipe([
      tap((params) => {
        logger.debug(`getList k8s, params: ${tos(params)}`);
      }),
      () => pathList(),
      (path) =>
        retryCallOnError({
          name: `getList type: ${type}, path ${path}`,
          fn: () => axios().get(urljoin(getServerUrl(kubeConfig()), path)),
          config,
        }),
      get("data"),
      tap((data) => {
        logger.info(`getList ${JSON.stringify({ data })}`);
      }),
    ]),
    (error) => {
      logError(`getList ${type}`, error);
      throw axiosErrorToJSON(error);
    }
  );
  const getByName = async ({ name, meta: { namespace = "default" } = {} }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`getByName ${JSON.stringify({ type, name, namespace })}`);
          assert(!isEmpty(name), `getByName ${type}: invalid name`);
        }),
        () => pathGet({ name, namespace }),
        (path) =>
          retryCallOnError({
            name: `getByName type ${type}, name: ${name}, path: ${path}`,
            fn: () => axios().get(urljoin(getServerUrl(kubeConfig()), path)),
            config,
          }),
        get("data"),
        tap((data) => {
          logger.debug(`getByName result ${name}: ${tos(data)}`);
        }),
      ]),
      switchCase([
        (error) => error.response?.status !== 404,
        (error) => {
          logError("getByName", error);
          throw axiosErrorToJSON(error);
        },
        () => {},
      ])
    )();

  const create = async ({ name, meta: { namespace }, payload, dependencies }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(
            `create ${type}/${namespace}::${name}, payload: ${tos(payload)}`
          );
          assert(name);
          assert(payload);
        }),
        () => pathCreate({ namespace }),
        tap((path) => {
          logger.info(`create ${type}/${name}, path: ${path}`);
        }),
        (path) =>
          retryCallOnError({
            name: `create ${type}/${name}`,
            //isExpectedException, //TODO
            //shouldRetryOnException,
            fn: () =>
              axios().post(urljoin(getServerUrl(kubeConfig()), path), payload),
            config: { ...config, repeatCount: 0 },
          }),
        tap((result) => {
          logger.info(
            `created ${type}/${name}, status: ${result.status}, data: ${tos(
              result.data
            )}`
          );
        }),
      ]),
      (error) => {
        logError(`create ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const destroy = async ({ name, meta: { namespace } }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`destroy ${JSON.stringify({ type, name, namespace })}`);
          assert(!isEmpty(name), `destroy ${type}: invalid name`);
          assert(!isEmpty(namespace), `destroy ${type}: invalid namespace`);
        }),
        () => pathDelete({ name, namespace }),
        (path) =>
          retryCallOnError({
            name: `destroy type ${type}, path: ${path}`,
            fn: () => axios().delete(urljoin(getServerUrl(kubeConfig()), path)),
            config,
            isExpectedException: (error) => {
              return [404].includes(error.response?.status);
            },
          }),
        get("data"),
        tap((data) => {
          logger.info(
            `destroy ${JSON.stringify({ name, type, id, data })} destroyed`
          );
        }),
      ]),
      (error) => {
        logError(`delete ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  return {
    spec,
    displayName,
    findName,
    findMeta,
    getByName,
    findId,
    getList,
    create,
    destroy,
    configDefault,
    resourceKey,
    nameToUri,
  };
};
