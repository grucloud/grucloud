const assert = require("assert");
const fs = require("fs").promises;
const querystring = require("querystring");

const { pipe, tap, eq, map, get, filter, tryCatch, not } = require("rubico");
const { callProp, find, isEmpty, when } = require("rubico/x");
const {
  logError,
  axiosErrorToJSON,
  mapPoolSize,
  convertError,
  md5FileBase64,
} = require("@grucloud/core/Common");
const { retryCallOnError } = require("@grucloud/core/Retry");

const { createAxiosMakerGoogle } = require("../../GoogleCommon");
const GoogleClient = require("../../GoogleClient");

const {
  GCP_STORAGE_BASE_URL,
  GCP_STORAGE_UPLOAD_URL,
} = require("./GcpStorageCommon");
const { isDownByIdCore } = require("@grucloud/core/Common");
const { buildLabel } = require("../../GoogleCommon");
const logger = require("@grucloud/core/logger")({ prefix: "GcpObject" });
const { tos } = require("@grucloud/core/tos");

const findName = pipe([
  get("live"),
  ({ bucket, name }) => `${bucket}::${name}`,
]);
const findId = get("live.id");
const findTargetId = () => get("id");

const objectPath = ({ bucket, name }) =>
  pipe([
    tap(() => {
      assert(bucket);
      assert(name);
    }),
    () => `/${bucket}/o/${querystring.escape(name)}`,
  ])();

exports.GcpObject = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);

  const { providerName } = configProvider;

  const client = GoogleClient({
    spec,
    config: configProvider,
    findTargetId,
  });

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_STORAGE_BASE_URL,
    url: "/b",
    config: configProvider,
  });

  const axiosUpload = createAxiosMakerGoogle({
    baseURL: GCP_STORAGE_BASE_URL,
    config: configProvider,
    contentType: "application/x-www-form-urlencoded",
  });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Bucket",
      group: "storage",
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

  const getBucket = ({ name, dependencies }) => {
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

  const getObject = tryCatch(
    pipe([
      objectPath,
      (path) =>
        retryCallOnError({
          name: `getObject ${path}`,
          fn: () => axios.get(path),
          config: configProvider,
          isExpectedException: eq(get("response.status"), 404),
        }),
      get("data"),
      tap((result) => {
        //logger.debug(`getObject ${tos(result)}`);
      }),
    ]),
    (error) => {
      logError(`getObject`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getList = ({ resources = [] } = {}) =>
    pipe([
      () => resources,
      tap(() => {
        logger.debug(`getList #resources ${resources.length}`);
      }),
      map.pool(mapPoolSize, (resource) =>
        pipe([
          () => resource,
          getBucket,
          tryCatch(
            pipe([
              (bucket) =>
                getObject({ bucket: bucket.name, name: resource.name }),
            ]),
            (error, params) => ({
              error: convertError({
                error,
                procedure: "getObjects",
                params,
              }),
            })
          ),
        ])()
      ),
      tap((result) => {
        logger.debug(`getList #items ${result.length}`);
      }),
      filter(not(isEmpty)),
      when(pipe([filter(get("error")), not(isEmpty)]), (objects) => {
        const error = new Error("get object error");
        error.status = 500;
        error.objects = objects;
        throw error;
      }),
      tap((result) => {
        logger.debug(`getList result: ${tos(result)}`);
      }),
    ])();

  const getByName = ({ name, dependencies, properties }) =>
    pipe([
      tap((obj) => {
        logger.debug(`getByName ${name}`);
        assert(properties);
      }),
      () => name,
      callProp("split", "::"),
      ([bucket, name]) => getObject({ bucket, name }),
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
          fn: pipe([
            () => payload.source,
            md5FileBase64,
            (md5Hash) =>
              axios.request(
                `/b/${
                  dependencies().bucket.name
                }/o?uploadType=resumable&name=${querystring.escape(
                  payload.name
                )}`,
                {
                  baseURL: GCP_STORAGE_UPLOAD_URL,
                  method: "POST",
                  data: {
                    ...payload,
                    metadata: buildLabel(configProvider),
                    md5Hash,
                  },
                }
              ),
          ]),
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

  const destroy = ({ live }) =>
    pipe([
      () => live,
      tryCatch(
        pipe([
          tap(({ bucket, name }) => {
            assert(bucket);
            assert(name);
            logger.info(`destroy object name: ${bucket}::${name}`);
          }),
          objectPath,
          (path) =>
            retryCallOnError({
              name: `destroy object ${path}`,
              fn: () => axios.delete(path),
              config: configProvider,
            }),
          get("data"),
          tap(() => {
            logger.debug(`destroyed object ${live.id}`);
          }),
        ]),
        (error, { bucket, name }) => {
          logError(`destroyed ${bucket}::${name}`, error);
          throw axiosErrorToJSON(error);
        }
      ),
    ])();

  return {
    ...client,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
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
