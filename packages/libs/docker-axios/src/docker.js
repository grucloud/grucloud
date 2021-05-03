const assert = require("assert");
const Axios = require("axios");

const { pipe, tap, switchCase, tryCatch, eq, get } = require("rubico");
const { includes, defaultsDeep } = require("rubico/x");

const configDefault = {
  baseURL: "http://localhost/v1.40",
  socketPath: "/var/run/docker.sock",
  timeout: 15e3,
  withCredentials: true,
};

exports.DockerClient = ({ config = {} }) => {
  const axios = Axios.create(defaultsDeep(configDefault)(config));

  const handleError = ({ name }) => (error) => {
    console.error("Error", name, error);
    throw error;
  };

  const containerCreate = ({ name, body }) =>
    tryCatch(
      pipe([
        () => axios.post(`/containers/create?name=${name}`, body),
        get("data"),
        tap((response) => {
          assert(true);
        }),
      ]),
      handleError({ name: "create" })
    )();

  const containerStart = ({ name }) =>
    tryCatch(
      pipe([
        () => axios.post(`/containers/${name}/start`),
        get("data"),
        tap((response) => {
          assert(true);
        }),
      ]),
      handleError({ name: "start" })
    )();

  const containerWait = ({ name }) =>
    tryCatch(
      pipe([
        () => axios.post(`/containers/${name}/wait`),
        get("data"),
        tap((response) => {
          assert(true);
        }),
      ]),
      handleError({ name: "wait" })
    )();

  const containerList = ({ filters } = {}) =>
    tryCatch(
      pipe([
        () => axios.get(`/containers/json?filters=${filters}`),
        get("data"),
        tap((response) => {
          assert(true);
        }),
      ]),
      handleError({ name: "list" })
    )();

  const containerDelete = ({ name }) =>
    tryCatch(
      pipe([
        () => axios.delete(`/containers/${name}`),
        get("data"),
        tap((response) => {
          assert(true);
        }),
      ]),
      handleError({ name: "containerDelete" })
    )();

  return {
    containerList,
    containerCreate,
    containerStart,
    containerWait,
    containerDelete,
  };
};
