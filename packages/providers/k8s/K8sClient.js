const assert = require("assert");
const urljoin = require("url-join");

const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  omit,
  assign,
  fork,
  not,
} = require("rubico");
const {
  size,
  defaultsDeep,
  isEmpty,
  includes,
  isFunction,
  append,
} = require("rubico/x");

const { retryCall, retryCallOnError } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { logError, axiosErrorToJSON } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "K8sClient" });
const {
  createAxiosMakerK8s,
  getServerUrl,
  getNamespace,
  displayNameResourceNamespace,
  displayNameNamespace,
  inferNameNamespace,
} = require("./K8sCommon");

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
  displayNameResource = displayNameResourceNamespace,
  displayName = displayNameNamespace,
  isInstanceUp = not(isEmpty),
  cannotBeDeleted = () => false,
  findDependencies,
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

  const findNameShort = ({ live }) =>
    pipe([
      tap(() => {
        assert(live, `findName: no live`);
      }),
      () => live,
      get("metadata.name"),
    ])();

  const findName = ({ live }) =>
    pipe([
      tap(() => {
        assert(live, `findName: no live`);
      }),
      () => live,
      get("metadata"),
      ({ name, namespace }) =>
        pipe([
          tap(() => {
            assert(name);
          }),
          () => namespace,
          switchCase([isEmpty, () => "", append("::")]),
          append(name),
        ])(),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findMeta = ({ live }) =>
    pipe([
      tap(() => {
        if (!live) {
          assert(live, `findMeta: no live`);
        }
      }),
      () => live,
      get("metadata"),
      tap((metadata) => {
        assert(metadata);
      }),
    ])();

  const findId = findName;

  const findNamespace = ({ live }) =>
    pipe([
      tap(() => {
        assert(live, `findNamespace: no live`);
      }),
      () => live,
      get("metadata.namespace", ""),
    ])();

  const findNamespaceFromTarget = ({ properties }) =>
    get("live.metadata.namespace", "")(properties({ dependencies: {} }));

  const axios = () => createAxiosMakerK8s({ config });

  const filterList =
    ({ type }) =>
    (data) =>
      pipe([
        get("items"),
        map(omit(["metadata.managedFields"])),
        tap((items) => {
          assert(true);
        }),
        (items) => assign({ type: () => type, items: () => items })(data),
        tap((result) => {
          //logger.debug(`filterList result ${tos(result)}`);
        }),
      ])(data);

  const getList = tryCatch(
    pipe([
      tap((params) => {
        logger.debug(`getList k8s ${type}`);
      }),
      pathList,
      (path) => urljoin(getServerUrl(kubeConfig()), path),
      (fullPath) =>
        retryCallOnError({
          name: `getList type: ${type}, path ${fullPath}`,
          fn: () => axios().get(fullPath),
          isExpectedException: pipe([
            tap((ex) => {
              logger.info(`getList  type: ${type}, ex: ${ex}`);
            }),
            eq(get("response.status"), 404),
            tap((result) => {
              logger.info(
                `getList type: ${type} isExpectedException ${result}`
              );
            }),
          ]),
          config,
        }),
      get("data", []),
      filterList({ type }),
      tap(({ items }) => {
        logger.info(`getList k8s ${type}, #items ${size(items)}`);
      }),
    ]),
    (error) => {
      logError(`getList ${type}`, error);
      throw Error(axiosErrorToJSON(error));
    }
  );

  const getByKey = ({ name, namespace, resolvePath }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`getByKey ${JSON.stringify({ name, namespace })}`);
          //assert(name);
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
          logger.debug(`getByKey result ${name}: ${tos(data.status)}`);
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

  const getByName = ({ name, dependencies, properties = ({}) => ({}) }) =>
    pipe([
      tap(() => {
        assert(isFunction(dependencies));
      }),
      () => properties({ dependencies: {} }),
      (props) =>
        getByKey({
          resolvePath: pathGet,
          name: get("metadata.name", name)(props),
          namespace: get("metadata.namespace")(props),
        }),
    ])();

  const getById = ({ live }) =>
    getByKey({
      resolvePath: pathGetStatus || pathGet,
      name: findNameShort({ live }),
      namespace: get("namespace")(findMeta({ live })),
    });

  const isUpById = pipe([getById, isInstanceUp]);
  const isDownById = pipe([getById, isEmpty]);

  const create = ({ name, payload, dependencies }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`create ${type}::${name}, payload: ${tos(payload)}`);
          assert(name);
          assert(payload);
        }),
        () =>
          pathCreate({
            name,
            apiVersion: payload.apiVersion,
            namespace: payload.metadata.namespace,
          }),
        tap((path) => {
          logger.info(`create ${type}/${name}, path: ${path}`);
        }),
        (path) => urljoin(getServerUrl(kubeConfig()), path),
        (fullPath) =>
          retryCallOnError({
            name: `create ${type}/${name} path: ${fullPath}`,
            fn: () => axios().post(fullPath, payload),
            config: { ...config, repeatCount: 0 },
            shouldRetryOnException: ({ error }) =>
              pipe([
                () => error,
                get("response.status"),
                //TODO 404 on Create ?
                (status) => includes(status)([404, 500]),
                tap((retry) => {
                  logger.info(
                    `shouldRetryOnException create ${type}/${name}, status: ${error.status}, retry: ${retry}`
                  );
                }),
              ])(),
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
          //logger.debug(`created ${type}/${name}, live: ${tos(live)}`);
        }),
      ]),
      (error) => {
        logError(`create ${type}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const update = ({ name, payload, dependencies, live, diff }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`update ${type}/${name}, diff: ${tos(diff)}`);
          assert(name);
          assert(payload);
          assert(live);
          assert(payload.metadata.name);
        }),
        fork({
          fullPath: pipe([
            () =>
              pathUpdate({
                name: payload.metadata.name,
                namespace:
                  payload.metadata.namespace ||
                  getNamespace(dependencies().namespace),
              }),
            tap((path) => {
              logger.info(`update ${type}/${name}, path: ${path}`);
            }),
            (path) => urljoin(getServerUrl(kubeConfig()), path),
          ]),
          data: pipe([() => payload, defaultsDeep(omit(["status"])(live))]),
        }),
        ({ fullPath, data }) =>
          retryCallOnError({
            name: `update ${type}/${name} path: ${fullPath}`,
            fn: () => axios().put(fullPath, data),
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

  const destroy = ({ live }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(!isEmpty(live), `destroy invalid live`);
        }),
        () => ({
          name: findNameShort({ live }),
          namespace: findMeta({ live }).namespace,
        }),
        tap((params) => {
          logger.info(`destroy k8s ${JSON.stringify({ params })}`);
        }),
        pathDelete,
        //TODO check gracePeriodSeconds
        (path) =>
          urljoin(getServerUrl(kubeConfig()), path, "?gracePeriodSeconds=10"),
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
            name: `destroy ${type}, name: ${findName({ live })}, isDownById`,
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

  return {
    spec,
    displayName,
    displayNameResource,
    findName,
    findMeta,
    getByName,
    findId,
    getList,
    getById,
    create,
    update,
    destroy,
    cannotBeDeleted,
    configDefault,
    findDependencies,
    findNamespace,
    findNamespaceFromTarget,
  };
};
