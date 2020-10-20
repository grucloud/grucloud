const assert = require("assert");
const path = require("path");
const { tap, map, pipe, get, flatten, tryCatch, flatMap } = require("rubico");

const { defaultsDeep } = require("rubico/x");
const urljoin = require("url-join");
const { retryCallOnError } = require("../../../Retry");

const { GCP_DNS_BASE_URL } = require("./GcpDnsCommon");
const AxiosMaker = require("../../../AxiosMaker");
const { logError, axiosErrorToJSON } = require("../../../Common");
const logger = require("../../../../logger")({
  prefix: "GcpDnsResourceRecordSet",
});
const { tos } = require("../../../../tos");

// https://cloud.google.com/dns/docs/reference/v1/resourceRecordSets
exports.GcpDnsResourceRecordSet = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
    })(properties);

  const axios = AxiosMaker({
    baseURL: urljoin(GCP_DNS_BASE_URL, `/projects/${project}/managedZones`),
    onHeaders: () => ({
      Authorization: `Bearer ${config.accessToken}`,
    }),
  });

  const getList = async ({ provider }) =>
    pipe([
      () => provider.getResourcesByType("DnsManagedZone"),
      flatMap(
        pipe([
          (managedZone) =>
            retryCallOnError({
              name: `getList ${managedZone.name}`,
              fn: () =>
                axios.request(`${managedZone.name}/rrsets`, {
                  method: "GET",
                }),
              config,
            }),
          get("data"),
          get("rrsets"),
          tap((result) => {
            logger.debug("getList");
          }),
        ])
      ),
      tap((result) => {
        logger.debug("getList");
      }),
      (items) => ({ length: items.length, items }),
    ])();
  /*
    )
    try {
      const managedZone = provider.getResourcesByType("DnsManagedZone");
      const path = pathList({ resources });
      const result = await retryCallOnError({
        name: `getList type: ${spec.type}, path ${path}`,
        fn: async () =>
          await axios.request(path, {
            method: verbList,
          }),
        config,
      });

      const data = onResponseList(result.data);
      return data;
    } catch (error) {
      logError(`getList ${spec.type}`, error);
      throw axiosErrorToJSON(error);
    }
    */
  const create = async ({ name, payload, dependencies }) =>
    pipe([
      tap(() => {
        logger.debug(`create ${name}, payload: ${tos(payload)}`);
        assert(name);
        assert(
          dependencies.dnsManagedZone,
          "missing dnsManagedZone dependencies"
        );
      }),
      () => `${dependencies.dnsManagedZone}/rrsets`,
      tryCatch(
        pipe([
          (path) =>
            retryCallOnError({
              name: `create ${name}`,
              fn: async () =>
                await axios.request(path, {
                  method: "POST",
                  data: payload,
                }),
              config,
            }),
        ]),
        () => {
          logError(`create ${type}/${name}`, error);
          throw axiosErrorToJSON(error);
        }
      ),
    ])();
  return {
    spec,
    getList,
    create,
    findName: (item) => item.name,
    findId: (item) => item.id,
  };
};
