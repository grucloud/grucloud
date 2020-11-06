const assert = require("assert");
const fs = require("fs").promises;
const urljoin = require("url-join");
const querystring = require("querystring");

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

const { createAxiosMakerGoogle } = require("../../GoogleCommon");

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

const objectPath = (bucketName, name) => {
  assert(name);
  return `/${bucketName}/o/${querystring.escape(name)}`;
};

exports.GcpObject = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_STORAGE_BASE_URL,
    url: "/b",
    config: configProvider,
  });

  const axiosUpload = createAxiosMakerGoogle({
    config: configProvider,
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
      ({ bucket, name }) => objectPath(bucket.name, name),
      (path) =>
        retryCallOnError({
          name: `getObject ${path}`,
          fn: () =>
            axios.request(path, {
              method: "GET",
            }),
          config: configProvider,
          isExpectedException: (error) => error.response?.status === 404,
        }),
      get("data"),
      tap((result) => {
        logger.debug(`getObject ${tos(result)}`);
      }),
    ]),
    (error) => {
      logError(`getObject`, error);
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
                pipe([(bucket) => getObject({ bucket, name: resource.name })]),
                (error, params) => ({
                  error: convertError({
                    error,
                    procedure: "getObjects",
                    params,
                  }),
                })
              ),
            ])(resource)
        )(resources),
      tap((result) => {
        logger.debug(`getList #items ${result.length}`);
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
      (bucket) => getObject({ bucket, name }),
      tap((result) => {
        logger.debug(`getByName name: ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) => getByName({ name: id });

  const isDownById = isDownByIdCore({ getById, getList, findId });

  const create = ({ name, payload, dependencies }) =>
    pipe([
      tap((obj) => {
        logger.info(`create ${name}`);
        assert(name, "missing name");
        assert(dependencies.bucket, "missing bucket dependencies");
      }),
      () =>
        retryCallOnError({
          name: `upload ${name} sessionId`,
          fn: async () =>
            await axios.request(
              `/b/${
                dependencies.bucket.name
              }/o?uploadType=resumable&name=${querystring.escape(name)}`,
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
      get("headers.location"),
      (sessionUri) =>
        retryCallOnError({
          name: `upload ${name} content`,
          fn: async () =>
            await axiosUpload.request(sessionUri, {
              method: "PUT",
              data: payload.content || (await fs.readFile(payload.source)),
            }),
          config: configProvider,
        }),
      get("data"),
      tap((obj) => {
        logger.info(`object created ${name}`);
      }),
    ])();

  const update = create;

  const destroy = ({ id, name, resourcesPerType }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`destroy id: ${id}, name: ${name}`);
        }),
        () => resourcesPerType.find((resource) => resource.name === name),
        tap((resource) => {
          assert(
            resource,
            `cannot find resource to destroy: ${id}, ${tos(resourcesPerType)}`
          );
        }),
        getBucket,
        (bucket) => objectPath(bucket.name, name),
        (path) =>
          retryCallOnError({
            name: `destroy ${path}`,
            fn: async () =>
              await axios.request(path, {
                method: "DELETE",
              }),
            config: configProvider,
          }),
        get("data"),
        tap(() => {
          logger.info(`destroyed id: ${id}, name: ${name}`);
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
