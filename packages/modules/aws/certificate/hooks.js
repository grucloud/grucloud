const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources, provider }) => {
  const { config } = provider;
  assert(config.certificate);
  const { rootDomainName } = config.certificate;
  assert(rootDomainName);

  const { hostedZone, certificate, certificateRecordValidation } = resources;
  assert(hostedZone);
  assert(certificate);

  return {
    onDeployed: {
      init: async () => {
        const hostedZoneLive = await hostedZone.getLive();
        assert.equal(hostedZoneLive.ResourceRecordSetCount, 3);

        const certificateRecordValidationLive = await certificateRecordValidation.getLive();
        assert(certificateRecordValidationLive);
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
