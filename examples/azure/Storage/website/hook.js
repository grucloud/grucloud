const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, get, eq } = require("rubico");
const { retryCallOnError } = require("@grucloud/core/Retry");

module.exports = ({ provider }) => {
  const axios = Axios.create({
    timeout: 15e3,
  });
  return {
    onDeployed: {
      init: async () => {
        const resources = provider.resources();
        const storageAccount = await resources.Storage.StorageAccount[
          "rg-storage-web::gcstorageweb"
        ].getLive();
        assert(storageAccount);
        return { url: storageAccount.properties.primaryEndpoints.web };
      },
      actions: [
        {
          name: "get index.html",
          command: async ({ url }) =>
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
              config: { retryCount: 20, retryDelay: 5e3 },
            }),
        },
      ],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Perform check",
          command: async ({}) => {},
        },
      ],
    },
  };
};
