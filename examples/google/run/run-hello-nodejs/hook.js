const assert = require("assert");
const { retryCallOnError } = require("@grucloud/core").Retry;
const Axios = require("axios");
const { pipe, get, switchCase } = require("rubico");

module.exports = ({ provider }) => {
  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const resources = provider.resources();
        const service = await resources.run.Service[
          "starhackit-server"
        ].getLive();
        assert(service);
        const { url } = service.status;
        assert(url);

        return {
          url,
        };
      },
      actions: [
        {
          name: `get`,
          command: async ({ url }) => {
            await retryCallOnError({
              name: `get ${url}`,
              fn: () => axios.get(url),
              isExpectedResult: (result) => {
                return [200].includes(result.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
      ],
    },
  };
};
