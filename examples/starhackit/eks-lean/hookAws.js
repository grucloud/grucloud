const assert = require("assert");
const Axios = require("axios");

const { retryCallOnError } = require("@grucloud/core").Retry;

module.exports = ({
  resources: {
    lbc: { loadBalancer },
  },
}) => {
  assert(ingress);

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const loadBalancerLive = await loadBalancer.getLive();
        return { dnsName: loadBalancerLive.DNSName };
      },
      actions: [
        {
          name: "Check webserver with http",
          command: async ({ dnsName }) => {
            const url = `http://${dnsName}`;
            await retryCallOnError({
              name: `get  ${dnsName}`,
              fn: () => axios.get(url),
              shouldRetryOnException: ({ error }) =>
                [404].includes(error.response?.status),
              isExpectedResult: (result) => {
                assert(result.headers["content-type"], `text/html`);
                return [200].includes(result.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
        {
          name: "Check api version",
          command: async ({ dnsName }) => {
            const url = `http://${dnsName}/api/v1/version`;
            await retryCallOnError({
              name: `get  ${dnsName}`,
              fn: () => axios.get(url),
              shouldRetryOnException: ({ error }) =>
                [502].includes(error.response?.status),
              isExpectedResult: (result) => {
                return [200].includes(result.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
      ],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [],
    },
  };
};
