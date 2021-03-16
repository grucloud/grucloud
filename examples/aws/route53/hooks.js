const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources, provider }) => {
  const { domainName, stage } = provider.config();
  const { hostedZone, recordA } = resources;
  assert(hostedZone);
  assert(domainName);

  return {
    onDeployed: {
      init: async () => {
        const hostedZoneLive = await hostedZone.getLive();
        assert.equal(hostedZoneLive.ResourceRecordSetCount, 3);

        const recordALive = await recordA.getLive();
        assert(recordALive);
        return { hostedZoneLive };
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
