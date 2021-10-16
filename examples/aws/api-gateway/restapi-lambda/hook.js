const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { find, append } = require("rubico/x");
const Axios = require("axios");
const { retryCallOnError } = require("@grucloud/core/Retry");

const buildUrl =
  ({ provider }) =>
  ({ restApiId, stageName }) =>
    `https://${restApiId}.execute-api.${
      provider.getConfig().region
    }.amazonaws.com/${stageName}`;

module.exports = ({ provider }) => {
  const axios = Axios.create({
    timeout: 15e3,
  });

  return {
    name: "RestApi",
    onDeployed: {
      init: pipe([
        () => ({ options: { types: ["APIGateway::Stage"] } }),
        provider.listLives,
        get("results"),
        find(eq(get("groupType"), "APIGateway::Stage")),
        get("resources"),
        find(eq(get("name"), "dev")),
        get("live"),
      ]),
      actions: [
        {
          name: "Get /",
          command: pipe([
            tap(({ restApiId, stageName }) => {
              assert(restApiId);
              assert(stageName);
            }),
            buildUrl({ provider }),
            (url) =>
              retryCallOnError({
                name: `get ${url}`,
                fn: () => axios.get(url),
                shouldRetryOnException: eq(get("error.response.status"), 404),
                isExpectedResult: pipe([
                  tap(({ headers }) => {
                    assert.equal(headers["content-type"], `text/html`);
                  }),
                  eq(get("status"), 200),
                ]),
                config: { retryCount: 10, retryDelay: 5e3 },
              }),
          ]),
        },
        {
          name: "Get Pets",
          command: pipe([
            buildUrl({ provider }),
            append("/pets"),
            (url) =>
              retryCallOnError({
                name: `get ${url}`,
                fn: () => axios.get(url),
                shouldRetryOnException: eq(get("error.response.status"), 404),
                isExpectedResult: pipe([eq(get("status"), 200)]),
                config: { retryCount: 10, retryDelay: 5e3 },
              }),
          ]),
        },
        {
          name: "Create Pet",
          command: pipe([
            buildUrl({ provider }),
            append("/pets"),
            (url) =>
              retryCallOnError({
                name: `get ${url}`,
                fn: () => axios.post(url, { type: "cat", price: 10 }),
                isExpectedResult: pipe([
                  tap((params) => {
                    assert(true);
                  }),
                  eq(get("status"), 200),
                ]),
                config: { retryCount: 10, retryDelay: 5e3 },
              }),
          ]),
        },
      ],
    },
  };
};
