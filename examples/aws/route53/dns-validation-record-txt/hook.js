const assert = require("assert");
const { pipe, get, fork, any, tap } = require("rubico");
const { first, find, isEmpty } = require("rubico/x");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ provider }) => {
  const { config } = provider;
  const { topLevelDomain, subDomainName, recordTxtValue } = config;
  assert(topLevelDomain);
  assert(recordTxtValue);

  return {
    onDeployed: {
      init: async () => {
        // return { hostedZoneLive };
      },
      actions: [
        {
          name: `up`,
          command: async () => {},
        },
      ],
    },
  };
};
