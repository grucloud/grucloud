const assert = require("assert");
const Axios = require("axios");
const { get, eq } = require("rubico");
const { find } = require("rubico/x");
const { retryCallOnError } = require("@grucloud/core").Retry;

module.exports = ({ stacks }) => {
  assert(stacks);
  const stackAws = find(eq(get("provider.name"), "aws"))(stacks);
  assert(stackAws);
  const { domainName } = stackAws.provider.config.certificate;
  assert(domainName);

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {},
      actions: [
        {
          name: `Check http://${domainName}`,
          command: async ({}) => {
            const url = `http://${domainName}`;
            await retryCallOnError({
              name: `get ${domainName}`,
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
          name: `Check https://${domainName}`,
          command: async ({}) => {
            const url = `https://${domainName}`;
            await retryCallOnError({
              name: `get ${domainName}`,
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
          name: `Check https://${domainName}/api/v1/version`,
          command: async () => {
            const url = `https://${domainName}/api/v1/version`;
            await retryCallOnError({
              name: `get ${domainName}`,
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
  };
};
