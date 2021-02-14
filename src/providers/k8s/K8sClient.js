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
  or,
  omit,
  assign,
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
const {
  createAxiosMakerK8s,
  getServerUrl,
  getNamespace,
  displayNameResourceNamespace,
  displayNameNamespace,
  resourceKeyNamespace,
} = require("./K8sCommon");
const { tos } = require("../../tos");

const {
  getByNameCore,
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
  pathGetStatus,
  pathCreate,
  pathDelete,
  pathUpdate,
  resourceKey = resourceKeyNamespace,
  displayNameResource = displayNameResourceNamespace,
  displayName = displayNameNamespace,
  isUpByIdFactory = ({ getById }) => isUpByIdCore({ getById }),
  isDownByIdFactory = ({ getById }) => isDownByIdCore({ getById }),
  cannotBeDeleted = () => false,
}) => {
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.accessToken);
  assert(config.kubeConfig);
  assert(pathList);
  assert(pathGet);

  const { kubeConfig } = config;
  const { type, providerName } = spec;

  assert(providerName);

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

  const filterList = (data) =>
    pipe([
      get("items"),
      map(omit(["metadata.managedFields"])),
      tap((items) => {
        logger.debug(`filterList items ${tos(items)}`);
      }),
      (items) => assign({ items: () => items })(data),
      tap((result) => {
        //logger.debug(`filterList result ${tos(result)}`);
      }),
    ])(data);

  const getList = tryCatch(
    pipe([
      tap((params) => {
        logger.debug(`getList k8s, params: ${tos(params)}`);
      }),
      pathList,
      (path) => urljoin(getServerUrl(kubeConfig()), path),
      (fullPath) =>
        retryCallOnError({
          name: `getList type: ${type}, path ${fullPath}`,
          fn: () => axios().get(fullPath),
          config,
        }),
      get("data"),
      filterList,
      tap((data) => {
        logger.info(`getList k8s ${JSON.stringify({ data })}`);
      }),
    ]),
    (error) => {
      logError(`getList ${type}`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getByKey = ({ name, namespace, resolvePath }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`getByKey ${JSON.stringify({ name, namespace })}`);
          assert(name);
          //assert(namespace);
        }),
        () => resolvePath({ name, namespace }),
        (path) => urljoin(getServerUrl(kubeConfig()), path),
        (fullPath) =>
          retryCallOnError({
            name: `getByKey type ${type}, name: ${name}, path: ${fullPath}`,
            fn: () => axios().get(fullPath),
            config,
          }),
        get("data"),
        tap((data) => {
          logger.debug(`getByKey result ${name}: ${tos(data)}`);
        }),
      ]),
      switchCase([
        eq(get("response.status"), 404),
        () => {},
        (error) => {
          logError("getByKey", error);
          throw axiosErrorToJSON(error);
        },
      ])
    )();

  const getByName = ({ name, dependencies }) =>
    getByKey({
      resolvePath: pathGet,
      name,
      namespace: getNamespace(dependencies.namespace),
    });

  const getById = ({ live }) =>
    getByKey({
      resolvePath: pathGetStatus || pathGet,
      name: findName(live),
      namespace: get("namespace")(findMeta(live)),
      suffix: "status",
    });

  const isUpById = isUpByIdFactory({ getById });
  const isDownById = isDownByIdFactory({ getById });

  const create = async ({ name, payload, dependencies }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`create ${type}::${name}, payload: ${tos(payload)}`);
          assert(name);
          assert(payload);
        }),
        () =>
          pathCreate({ name, namespace: getNamespace(dependencies.namespace) }),
        tap((path) => {
          logger.info(`create ${type}/${name}, path: ${path}`);
        }),
        (path) => urljoin(getServerUrl(kubeConfig()), path),
        (fullPath) =>
          retryCallOnError({
            name: `create ${type}/${name} path: ${fullPath}`,
            fn: () => axios().post(fullPath, payload),
            config: { ...config, repeatCount: 0 },
          }),
        tap((result) => {
          logger.info(`created ${type}/${name}, status: ${result.status}`);
        }),
        get("data"),
        tap((live) =>
          retryCall({
            name: `create ${type}, name: ${name}, isUpById`,
            fn: () => isUpById({ live }),
            config: { retryDelay: 5e3, retryCount: 5 * 12e3 },
          })
        ),
        tap((live) => {
          logger.debug(`created ${type}/${name}, live: ${tos(live)}`);
        }),
      ]),
      (error) => {
        logError(`create ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const update = async ({ name, payload, dependencies, live, diff }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`update ${type}/${name}, diff: ${tos(diff)}`);
          assert(name);
          assert(payload);
        }),
        () =>
          pathUpdate({ name, namespace: getNamespace(dependencies.namespace) }),
        tap((path) => {
          logger.info(`update ${type}/${name}, path: ${path}`);
        }),
        (path) => urljoin(getServerUrl(kubeConfig()), path),
        (fullPath) =>
          retryCallOnError({
            name: `update ${type}/${name} path: ${fullPath}`,
            fn: () => axios().put(fullPath, payload),
            config: { ...config, repeatCount: 0 },
          }),
        tap((result) => {
          logger.info(`updated ${type}/${name}, status: ${result.status}`);
          logger.debug(`updated ${type}/${name} data: ${tos(result.data)}`);
        }),
        get("data"),
      ]),
      (error) => {
        logError(`update ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const destroy = async ({ live }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(!isEmpty(live), `destroy invalid live`);
          logger.info(`destroy ${JSON.stringify({ live })}`);
        }),
        () => ({ name: findName(live), namespace: findMeta(live).namespace }),
        tap((params) => {
          logger.info(`destroy k8s ${JSON.stringify({ params })}`);
        }),
        pathDelete,
        (path) => urljoin(getServerUrl(kubeConfig()), path),
        (fullPath) =>
          retryCallOnError({
            name: `destroy type ${type}, path: ${fullPath}`,
            fn: () => axios().delete(fullPath),
            config,
          }),
        get("data"),
        tap((data) => {
          logger.info(`destroy ${JSON.stringify({ type, data })} destroyed`);
        }),
        tap(() =>
          retryCall({
            name: `destroy ${type}, name: ${findName(live)}, isDownById`,
            fn: () => isDownById({ live }),
            config: { retryDelay: 5e3, retryCount: 5 * 12e3 },
          })
        ),
      ]),
      (error) => {
        logError(`delete ${type} ${tos({ live })}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const cannotBeDeletedDefault = pipe([
    get("resource.metadata"),
    or([
      ({ name = "" }) => name.startsWith("kube"),
      ({ namespace = "" }) => namespace.startsWith("kube"),
    ]),
  ]);

  return {
    spec,
    displayName,
    displayNameResource,
    resourceKey,
    findName,
    findMeta,
    getByName,
    findId,
    getList,
    create,
    update,
    destroy,
    cannotBeDeleted: or([cannotBeDeletedDefault, cannotBeDeleted]),
    configDefault,
  };
};
