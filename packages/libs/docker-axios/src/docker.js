const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, switchCase, tryCatch, eq, get, map } = require("rubico");
const { includes, defaultsDeep } = require("rubico/x");

const configDefault = {
  baseURL: "http://localhost/v1.40",
  socketPath: "/var/run/docker.sock",
  timeout: 15e3,
};

const containersSpec = () => ({
  create: {
    method: "post",
    url: ({ name }) => `/containers/create?name=${name}`,
  },
  start: {
    method: "post",
    url: ({ name }) => `/containers/${name}/start`,
  },
  wait: {
    method: "post",
    url: ({ name }) => `/containers/${name}/wait`,
  },
  delete: {
    method: "delete",
    url: ({ name }) => `/containers/${name}`,
  },
  list: {
    method: "get",
    url: ({ filters }) => `/containers/json?filters=${filters}`, //TODO
  },
});

const opsFromSpec = ({ axios }) =>
  map.entries(([opName, spec]) => [
    opName,
    tryCatch(
      pipe([
        switchCase([
          eq(spec.method, "get"),
          (params) => axios.get(spec.url(params)),
          (params) => axios[spec.method](spec.url(params), params.body),
        ]),
        get("data"),
      ]),
      pipe([
        tap((error) => {
          console.error("Error", opName, error);
        }),
        (error) => {
          throw error;
        },
      ])
    ),
  ]);

exports.DockerClient = pipe([
  defaultsDeep(configDefault),
  (config) => Axios.create(config),
  (axios) => ({ container: opsFromSpec({ axios })(containersSpec()) }),
]);
