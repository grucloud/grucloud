const assert = require("assert");
const { get, pipe } = require("rubico");
const { first } = require("rubico/x");
const Axios = require("axios");

const { retryCallOnError } = require("@grucloud/core").Retry;

module.exports = ({ resources: { ingress } }) => {
  assert(ingress);

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const ingressLive = await ingress.getLive();
        assert(ingressLive);
        const ingressIp = pipe([
          get("status.loadBalancer.ingress"),
          first,
          get("ip"),
        ])(ingressLive);
        assert(ingressIp);
        return { ingressIp };
      },
      actions: [
        {
          name: "Check webserver with http",
          command: async ({ ingressIp }) => {
            const url = `http://${ingressIp}`;
            await retryCallOnError({
              name: `get  ${ingressIp}`,
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
          command: async ({ ingressIp }) => {
            const url = `http://${ingressIp}/api/v1/version`;
            await retryCallOnError({
              name: `get  ${ingressIp}`,
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
