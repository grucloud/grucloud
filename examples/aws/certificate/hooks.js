const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources, provider }) => {
  const { DomainName, stage } = provider.config();
  const { hostedZone, certificate, recordValidation } = resources;
  assert(hostedZone);
  assert(DomainName);

  return {
    onDeployed: {
      init: async () => {
        const hostedZoneLive = await hostedZone.getLive();
        assert.equal(hostedZoneLive.ResourceRecordSetCount, 3);

        const recordValidationLive = await recordValidation.getLive();
        assert(recordValidationLive);
        return { hostedZoneLive };
      },
      actions: [
        {
          name: `ssl certificate ready`,
          command: async () => {
            await retryCall({
              name: `getting certificate status`,
              fn: () => certificate.getLive(),
              isExpectedResult: (sslCertificateLive) => {
                return sslCertificateLive.Status == "ISSUED";
              },
              config: { retryCount: 500, retryDelay: 5e3 },
            });
          },
        },
      ],
    },
  };
};
