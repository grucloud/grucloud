const assert = require("assert");
const fs = require("fs").promises;
const urljoin = require("url-join");
const {
  pipe,
  tap,
  map,
  get,
  filter,
  tryCatch,
  switchCase,
  not,
} = require("rubico");
const { defaultsDeep, find, isEmpty } = require("rubico/x");
const {
  logError,
  axiosErrorToJSON,
  mapPoolSize,
  convertError,
  md5FileBase64,
} = require("../../../Common");
const { retryCallOnError } = require("../../../Retry");

const AxiosMaker = require("../../../AxiosMaker");

const {
  GCP_STORAGE_BASE_URL,
  GCP_STORAGE_UPLOAD_URL,
} = require("./GcpStorageCommon");
const { isDownByIdCore } = require("../../../Common");
const { buildLabel } = require("../../GoogleCommon");
const logger = require("../../../../logger")({ prefix: "GcpObject" });
const { tos } = require("../../../../tos");

const findName = (item) => {
  assert(item, "findName");
  assert(item.name, "name");
  return item.name;
};

const findId = (item) => {
  assert(item.id, "findId item.id");
  return item.id;
};

exports.GcpObject = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);

  const axios = AxiosMaker({
    baseURL: urljoin(GCP_STORAGE_BASE_URL, "/b"),
    onHeaders: () => ({
      Authorization: `Bearer ${configProvider.accessToken}`,
    }),
  });

  const axiosUpload = AxiosMaker({
    onHeaders: () => ({
      Authorization: `Bearer ${configProvider.accessToken}`,
    }),
    contentType: "application/x-www-form-urlencoded",
  });

  const getBucket = ({ name, dependencies = {} }) => {
    assert(name);
    const { bucket } = dependencies;
    if (!bucket) {
      throw {
        code: 422,
        message: `object '${name}' is missing the bucket dependency'`,
      };
    }
    return bucket;
  };

  const configDefault = ({ name, properties }) =>
    pipe([
      () =>
        defaultsDeep({
          name,
        })(properties),
      tap((xx) => {
        logger.debug(`configDefault`);
      }),
    ])();

  const getObject = tryCatch(
    pipe([
      ({ bucket, name }) =>
        retryCallOnError({
          name: `getObject `,
          fn: () =>
            axios.request(`/${bucket.name}/o/${name}`, {
              method: "GET",
            }),
          config: configProvider,
          isExpectedException: (error) => error.response?.status === 404,
        }),
      get("data"),
      tap((result) => {
        logger.debug(`getObjects ${tos(result)}`);
      }),
    ]),
    (error) => {
      logError(`getObject`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getObjects = tryCatch(
    pipe([
      (bucket) =>
        retryCallOnError({
          name: `getObjects ${bucket.name}`,
          fn: () =>
            axios.request(`/${bucket.name}/o`, {
              method: "GET",
            }),
          config: configProvider,
          isExpectedException: (error) => error.response?.status === 404,
        }),
      get("data"),
      tap((result) => {
        logger.debug(`getObjects ${tos(result)}`);
      }),
    ]),
    (error) => {
      logError(`getObjects`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getList = async ({ resources = [] } = {}) =>
    await pipe([
      tap(() => {
        logger.debug(`getList #resources ${resources.length}`);
      }),
      async (resources) =>
        await map.pool(
          mapPoolSize,
          async (resource) =>
            await pipe([
              () => getBucket(resource),
              tryCatch(
                pipe([
                  (bucket) => getObject({ bucket, name: resource.name }),
                  tap((result) => {
                    logger.debug(`getList #result ${tos(result)}`);
                  }),
                ]),
                switchCase([
                  (error) => {
                    return error.response?.status === 404;
                  },
                  () => null,
                  (error, params) => ({
                    error: convertError({
                      error,
                      procedure: "getObjects",
                      params,
                    }),
                  }),
                ])
              ),
            ])(resource)
        )(resources),
      tap((result) => {
        logger.debug(`getList`);
      }),
      filter((result) => result),
      switchCase([
        pipe([filter((result) => result.error), not(isEmpty)]),
        (objects) => {
          throw { code: 500, errors: objects };
        },
        (objects) => objects,
      ]),
      (objects) => ({
        total: objects.length,
        items: objects,
      }),
      tap((result) => {
        logger.debug(`getList result: ${tos(result)}`);
      }),
    ])(resources);

  const getByName = ({ name, dependencies }) =>
    pipe([
      tap((obj) => {
        logger.debug(`getByName ${name}`);
      }),
      () => getBucket({ dependencies, name }),
      getObjects,
      tap((obj) => {
        logger.debug(`getByName`);
      }),
      get("items"),
      (items = []) => find((item) => item.name === name)(items),
      tap((result) => {
        logger.debug(`getByName name: ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) => getByName({ name: id });

  const isDownById = isDownByIdCore({ getById, getList, findId });

  const create = ({ name, payload, dependencies }) =>
    pipe([
      tap((obj) => {
        logger.debug(`create ${name}`);
        assert(name, "missing name");
        assert(dependencies.bucket, "missing bucket dependencies");
      }),
      () =>
        retryCallOnError({
          name: `upload sessionId`,
          fn: async () =>
            await axios.request(
              `/b/${dependencies.bucket.name}/o?uploadType=resumable&name=${name}`,
              {
                baseURL: GCP_STORAGE_UPLOAD_URL,
                method: "POST",
                data: {
                  ...payload,
                  metadata: buildLabel(configProvider),
                  md5Hash: await md5FileBase64(payload.source),
                },
              }
            ),
          config: configProvider,
        }),
      tap((obj) => {
        logger.debug(`create`);
      }),
      get("headers.location"),
      tap((obj) => {
        logger.debug(`create`);
      }),
      (sessionUri) =>
        retryCallOnError({
          name: `upload`,
          fn: async () =>
            await axiosUpload.request(sessionUri, {
              method: "PUT",
              data: payload.content || (await fs.readFile(payload.source)),
            }),
          config: configProvider,
        }),
      get("data"),
      tap((obj) => {
        logger.debug(`create`);
      }),
    ])();

  const update = create;

  const destroy = ({ id, name, resourcesPerType }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`destroy id: ${id}, name: ${name}`);
        }),
        () => resourcesPerType.find((resource) => resource.name === name),
        tap((resource) => {
          assert(
            resource,
            `cannot find resource to destroy: ${id}, ${tos(resourcesPerType)}`
          );
        }),
        getBucket,
        (bucket) =>
          retryCallOnError({
            name: `destroy ${bucket.name}/${name}`,
            fn: async () =>
              await axios.request(`/${bucket.name}/o/${name}`, {
                method: "DELETE",
              }),
            config: configProvider,
          }),
        get("data"),
        tap(() => {
          logger.debug(`destroyed id: ${id}, name: ${name}`);
        }),
      ]),
      (error) => {
        logError(`delete ${bucket.name}/${name}`, error);
        throw axiosErrorToJSON(error);
      }
    );

  return {
    spec,
    config: configProvider,
    findName,
    findId,
    getList,
    isDownById,
    create,
    update,
    destroy,
    getByName,
    configDefault,
    cannotBeDeleted: () => false,
  };
};

exports.isGcpObjectOurMinion = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  const { metadata = {} } = resource;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = Object.keys(metadata).some((key) =>
    isGruLabel(key, metadata[key])
  );

  logger.debug(`isOurMinion: ${isMinion}`);
  return isMinion;
};
