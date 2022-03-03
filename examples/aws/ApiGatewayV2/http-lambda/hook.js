const assert = require("assert");
const { pipe, tap, get, eq, fork, or } = require("rubico");
const { find, first } = require("rubico/x");
const Axios = require("axios");
const { retryCallOnError } = require("@grucloud/core/Retry");

const getHttpUrl = ({ provider }) =>
  pipe([
    () => ({ options: { types: ["ApiGatewayV2::Api"] } }),
    provider.listLives,
    get("results"),
    find(eq(get("groupType"), "ApiGatewayV2::Api")),
    get("resources"),
    first,
    get("live.ApiEndpoint"),
    tap((ApiEndpoint) => {
      assert(ApiEndpoint);
    }),
  ]);

const getStage = ({ provider }) =>
  pipe([
    () => ({ options: { types: ["ApiGatewayV2::Stage"] } }),
    provider.listLives,
    get("results"),
    find(eq(get("groupType"), "ApiGatewayV2::Stage")),
    get("resources"),
    first,
    tap((params) => {
      assert(true);
    }),
    get("name"),
    tap((stageName) => {
      assert(stageName);
    }),
  ]);

module.exports = ({ provider }) => {
  return {
    name: "Http",
    onDeployed: {
      init: pipe([
        fork({
          httpUrl: getHttpUrl({ provider }),
          stageName: getStage({ provider }),
        }),
        ({ httpUrl, stageName }) => ({
          axios: Axios.create({
            timeout: 15e3,
            baseURL: `${httpUrl}/${stageName}`,
            //headers: { "x-api-key": apiKey },
          }),
        }),
      ]),
      actions: [
        {
          name: "Query",
          command: pipe([
            ({ axios }) =>
              retryCallOnError({
                name: `GET`,
                fn: () => axios.get("/my-function"),
                shouldRetryOnException: or([
                  eq(get("error.code"), "ENOTFOUND"),
                ]),
                isExpectedResult: pipe([
                  tap((params) => {
                    assert(true);
                  }),
                  eq(get("status"), 200),
                ]),
                config: { retryCount: 50, retryDelay: 5e3 },
              }),
          ]),
        },
      ],
    },
  };
};
