const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources, provider }) => {
  const { config } = provider;
  assert(config.certificate);
  const { rootDomainName } = config.certificate;
  assert(rootDomainName);

  const { hostedZone, certificate } = resources;
  assert(hostedZone);
  assert(certificate);
  assert(certificate.certificateRecordValidation);

  return {
    onDeployed: {
      init: async () => {
        const hostedZoneLive = await hostedZone.getLive();
        const certificateRecordValidationLive = await certificate.certificateRecordValidation.getLive();
        assert(certificateRecordValidationLive);
        return { hostedZoneLive };
      },
      actions: [
        {
          name: `ssl certificate ready`,
          command: async () => {
            await retryCall({
              name: `getting certificate status`,
              fn: () => certificate.certificate.getLive(),
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
