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
const { defaultsDeep, isDeepEqual, isEmpty } = require("rubico/x");
const urljoin = require("url-join");
const { differenceWith, isEqual } = require("lodash/fp");
const { GCP_DNS_BASE_URL } = require("./GcpDnsCommon");
const AxiosMaker = require("../../../AxiosMaker");
const {
  logError,
  axiosErrorToJSON,
  getByNameCore,
  isDownByIdCore,
} = require("../../../Common");
const { retryCallOnError } = require("../../../Retry");

const logger = require("../../../../logger")({ prefix: "GcpDnsManagedZone" });
const { tos } = require("../../../../tos");

exports.compareDnsManagedZone = async ({ target, live }) =>
  pipe([
    tap(() => {
      logger.debug(`compareDnsManagedZone ${tos({ target, live })}`);
      assert(target.recordSet, "target.recordSet");
      assert(live.recordSet, "live.recordSet");
    }),
    () => filterNonDeletableRecords(live.recordSet),
    fork({
      additions: (liveRecordSet) =>
        differenceWith(isEqual, target.recordSet, liveRecordSet),
      deletions: (liveRecordSet) =>
        differenceWith(isEqual, liveRecordSet, target.recordSet),
    }),
    assign({
      needUpdateRecordSet: or([
        (diff) => !isEmpty(diff.additions),
        (diff) => !isEmpty(diff.deletions),
      ]),
      needUpdateManagedZone: () => target.dnsName !== live.dnsName,
    }),
    assign({
      needUpdate: or([
        (diff) => diff.needUpdateRecordSet,
        (diff) => diff.needUpdateManagedZone,
      ]),
    }),
    tap((diff) => {
      logger.debug(`compareDnsManagedZone ${tos(diff)}`);
    }),
  ])();

const filterNonDeletableRecords = pipe([
  filter((record) => !["SOA", "NS"].includes(record.type)),
  map(omit(["kind", "signatureRrdatas"])),
  tap((liveRecordSet) => {
    logger.debug(`filterNonDeletableRecords: ${tos(liveRecordSet)}`);
  }),
]);

// https://cloud.google.com/dns/docs/reference/v1/managedZones
exports.GcpDnsManagedZone = ({ spec, config }) => {
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

  const axios = AxiosMaker({
    baseURL: urljoin(GCP_DNS_BASE_URL, `/projects/${project}/managedZones`),
    onHeaders: () => ({
      Authorization: `Bearer ${config.accessToken}`,
    }),
  });

  const getList = async ({ provider }) =>
    tryCatch(
      pipe([
        () =>
          retryCallOnError({
            name: `getList`,
            fn: async () =>
              await axios.request("/", {
                method: "GET",
              }),
            config,
          }),
        tap((xxx) => {
          logger.debug(`getList`);
        }),
        get("data.managedZones"),
        tap((xxx) => {
          logger.debug(`getList`);
        }),
        map(
          assign({
            recordSet: pipe([
              (managedZone) => {
                return retryCallOnError({
                  name: `getList`,
                  fn: async () =>
                    await axios.request(`/${managedZone.name}/rrsets`, {
                      method: "GET",
                    }),
                  config,
                });
              },
              get("data.rrsets"),
            ]),
          })
        ),
        tap((xxx) => {
          logger.debug(`getList`);
        }),
        (items) => ({ length: items.length, items }),
      ]),
      () => {
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
              await axios.request(`/${id}`, {
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

  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.debug(`create ${name}, payload: ${tos(payload)}`);
        assert(name, "name");
        assert(payload.name, "missing name");
        assert(payload.recordSet, "missing recordSet");
      }),
      tryCatch(
        pipe([
          () =>
            retryCallOnError({
              name: `create ${name}`,
              fn: async () =>
                await axios.request(`/`, {
                  method: "POST",
                  data: omit(["recordSet"])(payload),
                }),
              config,
            }),
          get("data"),
          tap((result) => {
            logger.debug(`create ${result}`);
          }),
        ]),
        (error) => {
          logError(`create`, error);
          throw axiosErrorToJSON(error);
        }
      ),
    ])();

  // https://cloud.google.com/dns/docs/reference/v1beta2/changes/create
  const update = async ({ name, payload, live, diff }) =>
    pipe([
      tap(() => {
        logger.debug(`update ${name}, payload: ${tos(payload)}`);
        assert(name, "name");
        assert(live, "live");
        assert(diff, "diff");
        assert(payload.recordSet, "missing recordSet");
        assert(diff.needUpdate, "diff.needUpate");
      }),
      switchCase([
        () => diff.needUpdateManagedZone,
        tryCatch(
          pipe([
            () =>
              retryCallOnError({
                name: `update dns managed zone ${name}`,
                fn: async () =>
                  await axios.request(`/${name}`, {
                    method: "PATCH",
                    data: omit(["recordSet"])(payload),
                  }),
                config,
              }),
            get("data"),
            tap((result) => {
              logger.debug(`update ${result}`);
            }),
          ]),
          (error) => {
            logError(`update`, error);
            throw axiosErrorToJSON(error);
          }
        ),
        () => diff.needUpdateRecordSet,
        tryCatch(
          pipe([
            () =>
              retryCallOnError({
                name: `update dns changes ${name}`,
                fn: async () =>
                  await axios.request(`/${name}/changes`, {
                    method: "POST",
                    data: {
                      additions: diff.additions,
                      deletions: diff.deletions,
                    },
                  }),
                config,
              }),
            get("data"),
            tap((result) => {
              logger.debug(`update ${result}`);
            }),
          ]),
          (error) => {
            logError(`update`, error);
            throw axiosErrorToJSON(error);
          }
        ),
      ]),
    ])();

  const destroy = async ({ id, name }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`destroy ${name}`);
        }),
        () =>
          retryCallOnError({
            name: `destroy ${name}`,
            fn: async () =>
              await axios.request(`/${name}/rrsets`, {
                method: "GET",
              }),
            config,
          }),
        get("data.rrsets"),
        tap((rrsets) => {
          logger.debug(`destroy ${name}`);
        }),
        filterNonDeletableRecords,
        tap((rrsets) => {
          logger.debug(`destroy ${name}`);
        }),
        (rrsets) =>
          retryCallOnError({
            name: `destroy change ${name}`,
            fn: async () =>
              await axios.request(`/${name}/changes`, {
                method: "POST",
                data: { deletions: rrsets },
              }),
            config,
          }),
        tap((rrsets) => {
          logger.debug(`destroy ${name}`);
        }),
        () =>
          retryCallOnError({
            name: `destroy ${name}`,
            fn: async () =>
              await axios.request(`/${name}`, {
                method: "DELETE",
              }),
            config,
          }),
        get("data"),
        tap((result) => {
          logger.debug(`destroy`);
        }),
      ]),
      (error) => {
        logError(`delete ${name}`, error);
        throw axiosErrorToJSON(error);
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
    create,
    update,
    destroy,
    findName,
    getByName,
    getById,
    isDownById,
    findId,
    cannotBeDeleted: () => false,
  };
};
