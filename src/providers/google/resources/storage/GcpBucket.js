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
const { defaultsDeep } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");
const { GCP_STORAGE_BASE_URL } = require("./GcpStorageCommon");
const { buildLabel } = require("../../GoogleCommon");
const logger = require("../../../../logger")({ prefix: "GcpBucket" });
const { tos } = require("../../../../tos");
const { retryCallOnError } = require("../../../Retry");
const { mapPoolSize, getByNameCore } = require("../../../Common");

const findTargetId = (item) => item.id;

// https://cloud.google.com/storage/docs/json_api/v1/buckets
// https://cloud.google.com/storage/docs/json_api/v1/buckets/insert

exports.GcpBucket = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);
  const { project, region } = configProvider;
  const queryParam = () => `/?project=${project}`;
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

  const getIam = assign({
    iam: pipe([
      tap((item) => {
        logger.debug(`getIam name: ${tos(item.name)}`);
      }),
      (item) =>
        retryCallOnError({
          name: `getIam ${item.name}`,
          fn: () =>
            axios.request(`/${item.name}/iam`, {
              method: "GET",
            }),
          config: configProvider,
        }),
      get("data"),
      tap((result) => {
        logger.debug(`getIam result: ${tos(result)}`);
      }),
    ]),
  });

  const getById = async ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${tos({ id })}`);
      }),
      () => client.getById({ id }),
      tap((result) => {
        logger.info(`getById partial ${tos({ result })}`);
      }),
      getIam, //TODO do we need it here ?
      tap((data) => {
        logger.debug(`getById result: ${tos(data)}`);
      }),
    ])();

  const getByName = ({ provider, name }) =>
    getByNameCore({ provider, name, getList, findName: client.findName });

  const create = async ({ name, payload, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create bucket ${name}`);
      }),
      () => client.create({ name, payload, dependencies }),
      tap((result) => {
        logger.debug(`created bucket ${name}`);
      }),
      tap(
        switchCase([
          () => payload.iam,
          () =>
            retryCallOnError({
              name: `setIam`,
              fn: () =>
                axios.request(`/${name}/iam`, {
                  method: "PUT",
                  data: payload.iam,
                }),
              config: configProvider,
            }),
          () => {},
        ])
      ),
    ])();

  const getList = async ({ deep }) =>
    pipe([
      tap(() => {
        logger.info(`getList bucket, deep: ${deep}`);
      }),
      () => client.getList(),
      //
      tap((result) => {
        logger.debug(`getList #items ${result.items.length}`);
      }),
      switchCase([
        () => deep,
        pipe([
          ({ items }) => map.pool(mapPoolSize, getIam)(items),
          (items) => ({ items, total: items.length }),
        ]),
        (result) => result,
      ]),
      tap((result) => {
        logger.debug(`getList bucket result: ${tos(result)}`);
      }),
    ])();

  const destroy = async ({ id: bucketName }) =>
    await pipe([
      tap(() => {
        assert(bucketName, `destroy invalid id`);
        logger.debug(`destroy bucket ${bucketName}`);
      }),
      () =>
        retryCallOnError({
          name: `list object to destroy`,
          fn: () =>
            axios.request(`/${bucketName}/o`, {
              method: "GET",
            }),
          config: configProvider,
        }),
      get("data.items"),
      tap((items = []) => {
        logger.debug(`destroy objects in bucket: ${items.length}`);
      }),
      tap(
        async (items = []) =>
          await map.pool(mapPoolSize, (item) =>
            retryCallOnError({
              name: `destroy objects in ${bucketName}`,
              fn: () =>
                axios.request(item.selfLink, {
                  method: "DELETE",
                }),
              config: configProvider,
            })
          )(items)
      ),
      () =>
        retryCallOnError({
          name: `destroy ${bucketName}`,
          fn: async () =>
            await axios.request(`/${bucketName}`, {
              method: "DELETE",
            }),
          config: configProvider,
          isExpectedException: (error) => {
            return [404].includes(error.response?.status);
          },
        }),
      get("data"),
      tap((xx) => {
        logger.debug(`destroy done: ${bucketName}`);
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
