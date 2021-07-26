const assert = require("assert");
const fs = require("fs").promises;
const querystring = require("querystring");

const {
  pipe,
  tap,
  eq,
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
} = require("@grucloud/core/Common");
const { retryCallOnError } = require("@grucloud/core/Retry");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

const { createAxiosMakerGoogle } = require("../../GoogleCommon");

const {
  GCP_STORAGE_BASE_URL,
  GCP_STORAGE_UPLOAD_URL,
} = require("./GcpStorageCommon");
const { isDownByIdCore } = require("@grucloud/core/Common");
const { buildLabel } = require("../../GoogleCommon");
const logger = require("@grucloud/core/logger")({ prefix: "GcpObject" });
const { tos } = require("@grucloud/core/tos");

const findName = get("live.name");
const findId = get("live.id");

const objectPath = (bucketName, name) => {
  assert(name);
  return `/${bucketName}/o/${querystring.escape(name)}`;
};

exports.GcpObject = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);

  const { providerName } = configProvider;

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_STORAGE_BASE_URL,
    url: "/b",
    config: configProvider,
  });

  const axiosUpload = createAxiosMakerGoogle({
    config: configProvider,
    contentType: "application/x-www-form-urlencoded",
  });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Bucket",
      ids: pipe([
        () => live,
        get("bucket"),
        (bucket) => [
          pipe([
            () =>
              lives.getByType({
                type: "Bucket",
                group: "storage",
                providerName,
              }),
            find(eq(get("live.name"), bucket)),
            get("id"),
          ])(),
        ],
      ])(),
    },
  ];

  const getBucket = ({ name, dependencies = {} }) => {
    assert(name);
    const { bucket } = dependencies();
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
        assert(dependencies().bucket, "missing bucket dependencies");
      }),
      () =>
        retryCallOnError({
          name: `upload ${name} sessionId`,
          fn: async () =>
            await axios.request(
              `/b/${
                dependencies().bucket.name
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
            axiosUpload.put(
              sessionUri,
              payload.content || (await fs.readFile(payload.source))
            ),
          config: configProvider,
        }),
      get("data"),
      tap((obj) => {
        logger.info(`object created ${name}`);
      }),
    ])();

  const update = create;

  const destroy = async ({ resource }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(resource);
          logger.info(`destroy object name: ${resource.toString()}`);
        }),
        getBucket,
        (bucket) => objectPath(bucket.name, resource.name),
        (path) =>
          retryCallOnError({
            name: `destroy object ${path}`,
            fn: () => axios.delete(path),
            config: configProvider,
          }),
        get("data"),
        tap(() => {
          logger.info(`destroyed object ${resource.toString()}`);
        }),
      ]),
      (error, resource) => {
        logError(`destroyed ${resource.toString()}`, error);
        throw axiosErrorToJSON(error);
      }
    )(resource);

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
    findDependencies,
  };
};

exports.isGcpObjectOurMinion = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  if (!resource) {
    return;
  }
  const { metadata = {} } = resource;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = Object.keys(metadata).some((key) =>
    isGruLabel(key, metadata[key])
  );

  logger.debug(`isOurMinion: ${isMinion}`);
  return isMinion;
};
