const Axios = require("axios");
const { pipe, tap, switchCase, tryCatch, eq, get, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { containersSpec, imagesSpec } = require("./specs");

// See https://github.com/axios/axios#request-config
const configDefault = {
  baseURL: "http://localhost/v1.41",
  socketPath: "/var/run/docker.sock",
  timeout: 10 * 60e3,
};

// Example of a spec:
// const containersSpec = () => ({
//   create: {
//     method: "post",
//     url: ({ name }) => `/containers/create?name=${name}`,
//   },
//   start: {
//     method: "post",
//     url: ({ name }) => `/containers/${name}/start`,
//   },
// })

const opsFromSpec = ({ axios }) =>
  map.entries(([opName, spec]) => [
    opName,
    tryCatch(
      pipe([
        switchCase([
          eq(spec.method, "get"),
          (params) =>
            axios.get(spec.url(params), { responseType: spec.responseType }),
          (params) => axios[spec.method](spec.url(params), params.body),
        ]),
        get("data"),
      ]),
      pipe([
        //TODO convert axios error
        (error) => {
          throw error;
        },
      ])
    ),
  ]);

exports.DockerClient = pipe([
  defaultsDeep(configDefault),
  (config) => Axios.create(config),
  (axios) => ({
    container: opsFromSpec({ axios })(containersSpec()),
    image: opsFromSpec({ axios })(imagesSpec()),
  }),
]);
