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
const { mapPoolSize } = require("../../../Common");

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

  const create = async ({ name, payload, dependencies }) =>
    pipe([
      tap(() => {
        logger.debug(`create bucket ${name}`);
      }),
      () => client.create({ name, payload, dependencies }),
      //
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
        logger.debug(`getList bucket`);
      }),
      () => client.getList(),
      //
      switchCase([
        () => deep,
        pipe([
          ({ items }) =>
            map.pool(
              mapPoolSize,
              assign({
                iam: pipe([
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
                ]),
              })
            )(items),
          (items) => ({ items, total: items.length }),
        ]),
        (result) => result,
      ]),
      tap((result) => {
        logger.debug(`getList bucket`);
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
        }),
      get("data"),
      tap((xx) => {
        logger.debug(`destroy done: ${bucketName}`);
      }),
    ])();

  return {
    ...client,
    getList,
    create,
    destroy,
  };
};
