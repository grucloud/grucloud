const assert = require("assert");
const dig = require("node-dig-dns");
const { retryCallOnError, retryCall } = require("@grucloud/core").Retry;
const Axios = require("axios");
const { pipe, get } = require("rubico");
const { first, find } = require("rubico/x");

const checkDigResult = ({ type, digResult, liveRecordSet }) => {
  if (!digResult.answer) {
    return false;
  }
  const entryAnswer = find((answer) => answer.type === type)(digResult.answer);
  const entryExpected = find((liveRecord) => liveRecord.Type === type)(
    liveRecordSet
  );

  return (
    entryAnswer && entryAnswer.value === entryExpected.ResourceRecord[0].Value
  );
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
    retryCount: 20,
    retryDelay: 5e3,
  });
};

module.exports = ({ resources, provider }) => {
  const { domainName } = provider.config();
  assert(domainName);
  const bucketUrl = `https://${domainName}`;
  const bucketStorageUrl = `http://${resources.websiteBucket.name}.s3.amazonaws.com`;
  const bucketUrlIndex = `${bucketStorageUrl}/index.html`;
  const bucketUrl404 = `${bucketStorageUrl}/404.html`;
  assert(resources.hostedZone);

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const hostedZoneLive = await resources.hostedZone.getLive();
        assert.equal(hostedZoneLive.ResourceRecordSetCount, 3);

        const sslCertificateLive = await resources.certificate.getLive();
        return { hostedZoneLive, sslCertificateLive };
      },
      actions: [
        {
          name: `get ${bucketUrlIndex}`,
          command: async ({}) => {
            await retryCallOnError({
              name: `get  ${bucketUrlIndex}`,
              fn: () => axios.get(bucketUrlIndex),
              shouldRetryOnException: (error) => {
                return (
                  ["ECONNABORTED", "ECONNRESET"].includes(error.code) ||
                  [404].includes(error.response?.status)
                );
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
              shouldRetryOnException: (error) => {
                return (
                  ["ECONNABORTED", "ECONNRESET"].includes(error.code) ||
                  [404].includes(error.response?.status)
                );
              },
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
              shouldRetryOnException: (error) => {
                return (
                  ["ECONNABORTED", "ECONNRESET"].includes(error.code) ||
                  [404].includes(error.response?.status)
                );
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
        {
          name: `ssl certificate ready`,
          command: async ({ sslCertificateLive }) => {
            //TODO find Status
            assert.equal(sslCertificateLive.Status, "READY");
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
              shouldRetryOnException: (error) => {
                return (
                  ["ECONNABORTED", "ECONNRESET", "ENOTFOUND"].includes(
                    error.code
                  ) || [404].includes(error.response?.status)
                );
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
      ],
    },
  };
};
