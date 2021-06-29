const assert = require("assert");
const { pipe, get, fork, any, tap } = require("rubico");
const { first, find, isEmpty } = require("rubico/x");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources, provider }) => {
  const { config } = provider;
  const { topLevelDomain, subDomainName, recordTxtValue } = config;
  assert(topLevelDomain);
  assert(recordTxtValue);

  return {
    onDeployed: {
      init: async () => {
        // const hostedZoneLive = await hostedZone.getLive();
        // assert.equal(hostedZoneLive.ResourceRecordSetCount, 3);
        // const recordALive = await recordA.getLive();
        // assert(recordALive);
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
