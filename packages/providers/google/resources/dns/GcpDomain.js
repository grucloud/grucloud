const assert = require("assert");
const { tap, map, pipe, get, flatten, tryCatch } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { GCP_DOMAIN_BASE_URL } = require("./GcpDnsCommon");
const { createAxiosMakerGoogle } = require("../../GoogleCommon");

const {
  logError,
  axiosErrorToJSON,
  getByNameCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const { retryCallOnError } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({ prefix: "GcpDomain" });
const { tos } = require("@grucloud/core/tos");

exports.compareDomain = async ({ target, live }) =>
  pipe([
    tap(() => {
      logger.debug(`compareDomain ${tos({ target, live })}`);
      //assert(target.recordSet, "target.recordSet");
    }),
    tap((diff) => {
      logger.debug(`compareDomain ${tos(diff)}`);
    }),
  ])();

// https://cloud.google.com/domains/docs/

exports.GcpDomain = ({ spec, config }) => {
  const { projectId, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
      recordSet: [],
    })(properties);

  const findName = () => get("name");
  const findId = findName;

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_DOMAIN_BASE_URL,
    url: `/projects/${projectId}`,
    config,
  });

  const getList = () =>
    tryCatch(
      pipe([
        () =>
          retryCallOnError({
            name: `getList`,
            fn: () => axios.get("/locations/global/registrations"),
            config,
          }),
        get("data.registrations"),
        tap((xxx) => {
          logger.debug(`getList`);
        }),
      ]),
      (error) => {
        logError(`list`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const getById = ({ id }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`getById id: ${id}`);
        }),
        () =>
          retryCallOnError({
            name: `getById ${id}`,
            fn: () => axios.get(`/locations/global/registrations/${id}`),
            config,
          }),
        get("data"),
        tap((result) => {
          logger.debug(`getById ${tos(result)}`);
        }),
      ]),
      (error) => {
        if (error.response?.status !== 404) {
          logError(`getById ${id}`, error);
          throw axiosErrorToJSON(error);
        }
        logger.debug(`getById ${id} not found`);
      }
    )();

  const getByName = getByNameCore({ getList, findName });

  const isDownById = isDownByIdCore({ getById, findId });

  return {
    spec,
    configDefault,
    getList,
    findName,
    getByName,
    getById,
    isDownById,
    findId,
    cannotBeDeleted: () => () => true,
  };
};
