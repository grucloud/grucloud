const assert = require("assert");
const dig = require("node-dig-dns");
const { retryCallOnError, retryCall } = require("@grucloud/core").Retry;
const Axios = require("axios");
const { pipe, get } = require("rubico");
const { first, find } = require("rubico/x");
const { makeDomainName } = require("./iac");
const checkDigResult = ({ type, digResult, liveRecordSet }) => {
  if (!digResult.answer) {
    return false;
  }
  const entryAnswer = find((answer) => answer.type === type)(digResult.answer);

  return !!entryAnswer?.value;
};

const checkDig = async ({ nameServer, domain, type = "A", hostedZoneLive }) => {
  let commandParam = [domain, type];
  if (nameServer) {
    commandParam = [`@${nameServer}`, ...commandParam];
  }
  await retryCall({
    name: `dig ${commandParam}`,
    fn: () => dig(commandParam),
    isExpectedResult: (digResult) => {
      //console.log(result.answer);
      return checkDigResult({
        type,
        digResult,
        liveRecordSet: hostedZoneLive.RecordSet,
      });
    },
    config: { retryCount: 20, retryDelay: 5e3 },
  });
};

module.exports = ({ resources, provider }) => {
  const { DomainName, stage } = provider.config();
  const { websiteBucket, hostedZone, distribution, certificate } = resources;
  assert(websiteBucket);
  assert(hostedZone);
  assert(distribution);
  assert(DomainName);
  assert(certificate);

  const domainName = makeDomainName({
    DomainName,
    stage,
  });

  const bucketUrl = `https://${domainName}`;
  const bucketStorageUrl = `http://${websiteBucket.name}.s3.amazonaws.com`;
  const bucketUrlIndex = `${bucketStorageUrl}/index.html`;
  const bucketUrl404 = `${bucketStorageUrl}/404.html`;

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const hostedZoneLive = await hostedZone.getLive();
        assert.equal(hostedZoneLive.ResourceRecordSetCount, 4);

        const sslCertificateLive = await certificate.getLive();
        const distributionLive = await distribution.getLive();

        const distributionDomainName = distributionLive.DomainName;
        assert(distributionDomainName);
        const distrubutionUrl = `https://${distributionDomainName}`;
        return { hostedZoneLive, sslCertificateLive, distrubutionUrl };
      },
      actions: [
        {
          name: `get ${bucketUrlIndex}`,
          command: async ({}) => {
            await retryCallOnError({
              name: `get  ${bucketUrlIndex}`,
              fn: () => axios.get(bucketUrlIndex),
              shouldRetryOnException: (error) =>
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
          name: `get ${bucketStorageUrl}`,
          command: async ({}) => {
            await retryCallOnError({
              name: `get  ${bucketStorageUrl}`,
              fn: () => axios.get(bucketStorageUrl),
              shouldRetryOnException: (error) =>
                [404].includes(error.response?.status),
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
        {
          name: `get ${bucketUrl404}`,
          command: async ({}) => {
            await retryCallOnError({
              name: `get  ${bucketUrl404}`,
              fn: () => axios.get(bucketUrl404),
              shouldRetryOnException: (error) =>
                [404].includes(error.response?.status),
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
        {
          name: `get distribution default page`,
          command: async ({ distrubutionUrl }) => {
            await retryCallOnError({
              name: `get  ${distrubutionUrl}`,
              fn: () => axios.get(distrubutionUrl),
              shouldRetryOnException: (error) => {
                return [404].includes(error.response?.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
        {
          name: `ssl certificate ready`,
          command: async ({ sslCertificateLive }) => {
            //TODO retry
            assert.equal(sslCertificateLive.Status, "ISSUED");
          },
        },
        {
          name: `dig nameservers from RecordSet ${domainName}`,
          command: async ({ hostedZoneLive }) => {
            const nameServer = pipe([
              find((record) => record.Type === "NS"),
              get("ResourceRecords"),
              first,
              get("Value"),
            ])(hostedZoneLive.RecordSet);
            await checkDig({
              nameServer,
              domain: domainName,
              hostedZoneLive,
            });
          },
        },
        {
          name: `dig default nameserver ${domainName}`,
          command: async ({ hostedZoneLive }) => {
            await checkDig({
              domain: domainName,
              hostedZoneLive,
            });
          },
        },
        {
          name: `get ${bucketUrl}`,
          command: async () => {
            await retryCallOnError({
              name: `get  ${bucketUrl}`,
              fn: () => axios.get(bucketUrl),
              shouldRetryOnException: (error) =>
                [404].includes(error.response?.status),
              isExpectedResult: (result) => {
                assert.equal(result.headers["content-type"], `text/html`);
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
