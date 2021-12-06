const assert = require("assert");
const {
  get,
  pipe,
  assign,
  filter,
  not,
  map,
  tap,
  tryCatch,
} = require("rubico");
const { defaultsDeep, isEmpty, callProp } = require("rubico/x");
const { retryCallOnError } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "GcpRunServiceIamMember",
});

const { createAxiosMakerGoogle } = require("../../GoogleCommon");

// https://cloud.google.com/run/docs/reference/rest/v1/projects.locations.services
exports.GcpRunServiceIamMember = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, region, providerName } = config;

  const findName = pipe([
    get("live"),
    ({ service, location }) => `${service}::${location}`,
  ]);
  const findId = findName;

  const getByName = ({ name }) =>
    pipe([
      () => name,
      callProp("split", "::"),
      ([service, location]) => ({ service, location }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependencies = ({ live, lives }) => [
    {
      type: "Service",
      group: "run",
      ids: [
        pipe([
          () =>
            lives.getByName({
              providerName,
              group: "run",
              type: "Service",
              name: live.service,
            }),
          tap((service) => {
            assert(service);
          }),
          get("id"),
        ])(),
      ],
    },
  ];

  const axios = createAxiosMakerGoogle({
    baseURL: `https://${region}-run.googleapis.com/v1`,
    url: `/projects/${projectId}/locations/${region}/services`,
    config,
  });

  const configDefault = ({ name, properties, dependencies: { service } }) =>
    pipe([
      tap(() => {
        assert(service);
      }),
      () => properties,
      defaultsDeep({
        service: service.resource.name,
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getIamPolicy = ({ service }) =>
    pipe([
      tap(() => {
        assert(service);
      }),
      tryCatch(
        () => axios.get(`/${service}:getIamPolicy`),
        (error) => {
          throw error;
        }
      ),
      get("data"),
    ])();

  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName,
          type: "Service",
          group: "run",
        }),
      map(
        pipe([
          get("live.metadata"),
          ({ name, labels }) => ({
            service: name,
            location: labels["cloud.googleapis.com/location"],
          }),
          assign({
            policy: getIamPolicy,
          }),
        ])
      ),
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const create = ({ payload }) =>
    pipe([
      tap((xx) => {
        logger.info("create");
      }),
      () => payload,
      getIamPolicy,
      ({ etag }) =>
        retryCallOnError({
          name: `setIamPolicy`,
          fn: () =>
            axios.request(`/${payload.service}:setIamPolicy`, {
              method: "POST",
              data: { policy: { ...payload.policy, etag } },
            }),
          config,
        }),
      tap((xx) => {
        logger.info("created");
      }),
    ])();

  const update = pipe([
    tap((xx) => {
      logger.info("update");
    }),
    ({ payload, live }) =>
      retryCallOnError({
        name: `setIamPolicy`,
        fn: () =>
          axios.request(`/${payload.service}:setIamPolicy`, {
            method: "POST",
            data: { policy: { ...payload.policy, etag: live.policy.etag } },
          }),
        config,
      }),
    tap((xx) => {
      logger.info("updated");
    }),
  ]);

  return {
    spec,
    getList,
    findName,
    findId,
    getByName,
    configDefault,
    create,
    update,
    findDependencies,
    cannotBeDeleted: () => true,
  };
};
