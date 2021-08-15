const assert = require("assert");
const {
  pipe,
  tap,
  map,
  get,
  filter,
  tryCatch,

  switchCase,
  assign,
} = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");
const { GCP_STORAGE_BASE_URL } = require("./GcpStorageCommon");
const { buildLabel } = require("../../GoogleCommon");
const logger = require("@grucloud/core/logger")({ prefix: "GcpBucket" });
const { tos } = require("@grucloud/core/tos");
const { retryCallOnError } = require("@grucloud/core/Retry");
const { mapPoolSize } = require("@grucloud/core/Common");

const findTargetId = get("id");

// https://cloud.google.com/storage/docs/json_api/v1/buckets
// https://cloud.google.com/storage/docs/json_api/v1/buckets/insert

exports.GcpBucket = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);
  const { projectId, region } = configProvider;
  const queryParam = () => `/?project=${projectId}`;
  const pathList = queryParam;
  const pathCreate = queryParam;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      location: region,
      labels: buildLabel(configProvider),
    })(properties);

  const client = GoogleClient({
    spec,
    baseURL: GCP_STORAGE_BASE_URL,
    url: `/b`,
    config: configProvider,
    findTargetId,
    pathList,
    pathCreate,
    configDefault,
  });

  const { axios } = client;

  const getIam = pipe([
    tap((item) => {
      assert(item.name, "item.name");
      logger.debug(`getIam name: ${tos(item.name)}`);
    }),
    (item) =>
      retryCallOnError({
        name: `getIam ${item.name}`,
        fn: () => axios.get(`/${item.name}/iam`),
        config: configProvider,
      }),
    get("data"),
    tap((result) => {
      logger.debug(`getIam result: ${tos(result)}`);
    }),
  ]);

  const assignIam = assign({ iam: getIam });

  const getById = async ({ id, name, deep }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${JSON.stringify({ id, name })}`);
      }),
      () => client.getById({ id, name }),
      switchCase([(result) => result && deep, assignIam, identity]),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const getByName = ({ name, deep }) => getById({ id: name, name, deep });

  const create = async ({ name, payload, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create bucket ${name}`);
        logger.debug(`bucket create payload ${tos(payload)}`);
      }),
      () => client.create({ name, payload, dependencies }),
      tap((result) => {
        logger.debug(`created bucket ${name}`);
      }),
      // https://cloud.google.com/storage/docs/json_api/v1/buckets/setIamPolicy
      tap.if(
        () => payload.iam,
        pipe([
          getIam,
          tap((iamCurrent) => {
            logger.info(`create bucket ${name}`);
            logger.debug(`bucket ${name} assignIam ${tos(iamCurrent)}`);
          }),
          //TODO assign
          (iamCurrent) => ({
            ...iamCurrent,
            bindings: [...iamCurrent.bindings, ...payload.iam.bindings],
          }),
          tap((updatedIam) => {
            logger.info(`create bucket ${name}`);
            logger.debug(`bucket ${name} updatedIam ${tos(updatedIam)}`);
          }),
          (data) =>
            retryCallOnError({
              name: `setIam ${name}`,
              fn: () => axios.put(`/${name}/iam`, data),
              config: configProvider,
            }),
        ])
      ),
    ])();

  const getList = ({ deep }) =>
    pipe([
      tap(() => {
        logger.info(`getList bucket, deep: ${deep}`);
      }),
      () => client.getList({ deep }),
      when(() => deep, map.pool(mapPoolSize, assignIam)),
      tap((result) => {
        logger.debug(`getList bucket result: ${tos(result)}`);
      }),
    ])();

  const destroy = ({ id: bucketName }) =>
    pipe([
      tap(() => {
        assert(bucketName, `destroy invalid id`);
        logger.info(`destroy bucket ${bucketName}`);
      }),
      () =>
        retryCallOnError({
          name: `list object to destroy on bucket ${bucketName}`,
          fn: () => axios.get(`/${bucketName}/o`),
          config: configProvider,
        }),
      get("data.items", []),
      tap((items = []) => {
        logger.debug(`destroy objects in bucket: ${items.length}`);
      }),
      map.pool(mapPoolSize, (item) =>
        retryCallOnError({
          name: `destroy objects in ${bucketName}`,
          fn: () => axios.delete(item.selfLink),
          config: configProvider,
        })
      ),
      () =>
        retryCallOnError({
          name: `destroy ${bucketName}`,
          fn: () => axios.delete(`/${bucketName}`),
          config: configProvider,
          //TODO may not need that
          isExpectedException: (error) => {
            return [404].includes(error.response?.status);
          },
        }),
      get("data"),
      tap((xx) => {
        logger.info(`destroy bucket done: ${bucketName}`);
      }),
    ])();

  return {
    ...client,
    getById,
    getByName,
    getList,
    create,
    destroy,
  };
};
