const assert = require("assert");
const {
  tap,
  map,
  pipe,
  get,
  flatten,
  tryCatch,
  assign,
  omit,
  filter,
  fork,
  or,
  switchCase,
} = require("rubico");
const { defaultsDeep, isDeepEqual, isEmpty, find } = require("rubico/x");
const { GCP_DOMAIN_BASE_URL } = require("./GcpDnsCommon");
const { createAxiosMakerGoogle } = require("../../GoogleCommon");

const {
  logError,
  axiosErrorToJSON,
  getByNameCore,
  isDownByIdCore,
} = require("../../../Common");
const { retryCallOnError } = require("../../../Retry");

const logger = require("../../../../logger")({ prefix: "GcpDomain" });
const { tos } = require("../../../../tos");

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
  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
      recordSet: [],
    })(properties);

  const findName = (item) => {
    assert(item.name, "item.name");
    return item.name;
  };

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_DOMAIN_BASE_URL,
    url: `/projects/${project}`,
    config,
  });

  const getList = async () =>
    tryCatch(
      pipe([
        () =>
          retryCallOnError({
            name: `getList`,
            fn: () => axios.get("/locations/global/registrations"),
            config,
          }),
        tap((xxx) => {
          logger.debug(`getList`);
        }),
        get("data.registrations"),
        tap((xxx) => {
          logger.debug(`getList`);
        }),
        (items = []) => ({ length: items.length, items }),
      ]),
      (error) => {
        logError(`list`, error);
        throw axiosErrorToJSON(error);
      }
    )();

  const getById = async ({ id }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`getById id: ${id}`);
        }),
        () =>
          retryCallOnError({
            name: `getById ${id}`,
            fn: async () =>
              await axios.request(`/locations/global/registrations/${id}`, {
                method: "GET",
              }),
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

  const findId = (item) => item.name;

  const getByName = ({ provider, name }) =>
    getByNameCore({ provider, name, getList, findName });

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
    cannotBeDeleted: () => true,
  };
};
