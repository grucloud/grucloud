const assert = require("assert");

const { map, pipe, get, tap, filter, switchCase, not } = require("rubico");
const { pluck, isEmpty } = require("rubico/x");

const AxiosMaker = require("@grucloud/core/AxiosMaker");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleProvider" });

const { retryCallOnError } = require("@grucloud/core/Retry");

const createAxiosGeneric = ({ accessToken }) =>
  AxiosMaker({
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const createAxiosService = ({ accessToken, projectId }) =>
  AxiosMaker({
    baseURL: `https://serviceusage.googleapis.com/v1/projects/${projectId}`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

exports.serviceEnable = async ({
  accessToken,
  projectId,
  region,
  servicesApiMap,
}) => {
  assert(region);
  const axiosService = createAxiosService({ accessToken, projectId });
  const axios = createAxiosGeneric({ accessToken, projectId });
  const servicesApis = Object.keys(servicesApiMap);
  return pipe([
    tap(() => {
      console.log(
        `Enabling ${servicesApis.length} services: ${servicesApis.join(", ")}`
      );
    }),
    () =>
      retryCallOnError({
        name: `get("/services?filter=state:ENABLED")`,
        fn: () => axiosService.get("/services?filter=state:ENABLED"),
        config: { retryCount: 20, retryDelay: 2e3 },
        shouldRetryOnException: ({ error }) => {
          return [403].includes(error.response?.status);
        },
      }),
    get("data.services"),
    tap((xxx) => {
      logger.debug("services");
    }),
    pluck("config.name"),
    (servicesEnabled = []) =>
      filter((service) => !servicesEnabled.includes(service))(servicesApis),
    switchCase([
      not(isEmpty),
      pipe([
        tap((serviceIds) => {
          logger.info(`Enabling ${serviceIds.length} services`);
        }),
        tap((serviceIds) =>
          axiosService.post("/services:batchEnable", { serviceIds })
        ),
        tap(() => {
          console.log(
            `Waiting for services to take off, may take up to 10 minutes`
          );
        }),
        map((serviceId) =>
          pipe([
            () => servicesApiMap[serviceId].url({ projectId, region }),
            (url) =>
              retryCallOnError({
                name: `check for serviceId ${serviceId}, getting ${url}`,
                fn: () =>
                  axios.request({
                    url,
                    method: servicesApiMap[serviceId].method || "GET",
                  }),
                config: { retryCount: 120, retryDelay: 10e3 },
                shouldRetryOnException: ({ error }) => {
                  return [403].includes(error.response?.status);
                },
              }),
            tap(() => {
              console.log(`Service ${serviceId} is up`);
            }),
          ])()
        ),
        tap(() => {
          logger.info(`services up and running`);
        }),
      ]),
      tap(() => {
        console.log("Services already enabled");
      }),
    ]),
  ])();
};

exports.serviceDisable = async ({ accessToken, projectId, servicesApiMap }) => {
  const axios = createAxiosService({ accessToken, projectId });
  const servicesApis = Object.keys(servicesApiMap);

  return pipe([
    tap(() => {
      console.log(
        `Disabling ${servicesApis.length} services: ${servicesApis.join(", ")}`
      );
    }),
    () => axios.get("/services?filter=state:ENABLED"),
    get("data.services"),
    tap((xxx) => {
      logger.debug("services");
    }),
    pluck("config.name"),
    (servicesEnabled = []) =>
      filter((service) => servicesEnabled.includes(service))(servicesApis),
    switchCase([
      (serviceIds) => !isEmpty(serviceIds),
      pipe([
        tap((serviceIds) => {
          logger.info(`Disabled ${serviceIds.length} services`);
        }),
        map((serviceId) =>
          axios.post(`/services/${serviceId}:disable`, {
            disableDependentServices: true,
          })
        ),
        tap((xxx) => {
          console.log("Services disabled");
        }),
      ]),
      tap(() => {
        console.log("Services already disabled");
      }),
    ]),
  ])();
};
