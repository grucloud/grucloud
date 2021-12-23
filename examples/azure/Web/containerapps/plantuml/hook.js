const assert = require("assert");
const { retryCallOnError } = require("@grucloud/core").Retry;
const Axios = require("axios");

module.exports = ({ provider }) => {
  const axios = Axios.create({
    timeout: 15e3,
  });

  return {
    onDeployed: {
      init: async () => {
        const resources = provider.resources();
        const containerApp = await resources.Web.ContainerApp[
          "plantuml"
        ].getLive();
        assert(containerApp);
        const url = `https://${containerApp.properties.configuration.ingress.fqdn}`;
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
