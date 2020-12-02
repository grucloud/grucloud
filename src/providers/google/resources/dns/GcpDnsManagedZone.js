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
const { differenceWith, isEqual } = require("lodash/fp");
const { GCP_DNS_BASE_URL } = require("./GcpDnsCommon");
const { createAxiosMakerGoogle } = require("../../GoogleCommon");

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
    () =>
      filterNonDeletableRecords({
        targetRecordSet: target.recordSet,
        liveRecordSet: live.recordSet,
      }),
    fork({
      additions: (liveRecordSet) =>
        differenceWith(isEqual, target.recordSet)(liveRecordSet),
      deletions: (liveRecordSet) =>
        differenceWith(isEqual, liveRecordSet)(target.recordSet),
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

const filterNonDeletableRecords = ({ targetRecordSet, liveRecordSet }) =>
  pipe([
    () =>
      filter(
        (type) =>
          !find((targetRecord) => targetRecord.type === type)(targetRecordSet)
      )(["SOA", "NS"]),
    tap((types) => {
      logger.debug(`filterNonDeletableRecords: types: ${types}`);
    }),
    (types) => filter((record) => !types.includes(record.type))(liveRecordSet),
    map(omit(["kind", "signatureRrdatas"])),
    tap((liveRecordSet) => {
      logger.debug(`filterNonDeletableRecords: ${tos(liveRecordSet)}`);
    }),
  ])();

// https://cloud.google.com/dns/docs/reference/v1/managedZones
exports.GcpDnsManagedZone = ({ spec, config }) => {
  const { projectId, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
      recordSet: [],
    })(properties);

  const findName = get("name");
  const findId = findName;

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_DNS_BASE_URL,
    url: `/projects/${projectId(config)}/managedZones`,
    config,
  });

  const getList = async () =>
    tryCatch(
      pipe([
        () =>
          retryCallOnError({
            name: `getList`,
            fn: () => axios.get("/"),
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
              fn: () =>
                axios.request(`/`, {
                  method: "POST",
                  data: omit(["recordSet"])(payload),
                }),
              config,
            }),
          get("data"),
          tap((result) => {
            logger.debug(`create ${result}`);
          }),
          () =>
            retryCallOnError({
              name: `list change ${name}`,
              fn: () =>
                axios.request(`/${name}/rrsets`, {
                  method: "GET",
                }),
              config,
            }),
          get("data.rrsets"),
          tap((rrsets) => {
            logger.debug(`create changes ${tos(rrsets)}`);
          }),
          (rrsets) => ({
            additions: payload.recordSet,
            deletions: filter(({ type }) =>
              find((record) => record.type === type)(payload.recordSet)
            )(rrsets),
          }),
          tap((data) => {
            logger.debug(`create changes data ${tos(data)}`);
          }),
          (data) =>
            retryCallOnError({
              name: `create recordSet ${name}`,
              fn: () =>
                axios.request(`/${name}/changes`, {
                  method: "POST",
                  data,
                }),
              config,
            }),
          get("data"),
          tap((result) => {
            logger.debug(`create recordset ${result}`);
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
        logger.info(`update ${name}, payload: ${tos(payload)}`);
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
              logger.info(`update ${result}`);
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
          logger.info(`destroy ${name}`);
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
        (rrsets) =>
          filterNonDeletableRecords({
            targetRecordSet: [],
            liveRecordSet: rrsets,
          }),
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
          logger.info(`destroyed`);
        }),
      ]),
      (error) => {
        logError(`delete ${name}`, error);
        throw axiosErrorToJSON(error);
      }
    )();

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
  };
};
