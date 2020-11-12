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
  const entryExpected = find((liveRecord) => liveRecord.type === type)(
    liveRecordSet
  );

  return entryAnswer && entryAnswer.value === entryExpected.rrdatas[0];
};

const checkDig = async ({
  nameServer,
  domain,
  type = "A",
  dnsManagedZoneLive,
}) => {
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
        liveRecordSet: dnsManagedZoneLive.recordSet,
      });
    },
    retryCount: 20,
    retryDelay: 5e3,
  });
};

module.exports = ({ resources, provider }) => {
  const bucketUrl = `https://${resources.bucketPublic.name}`;
  const bucketStorageUrl = `https://storage.googleapis.com/${resources.bucketPublic.name}`;
  const bucketUrlIndex = `${bucketStorageUrl}/index.html`;
  const bucketUrl404 = `${bucketStorageUrl}/404.html`;
  assert(resources.dnsManagedZone);

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const dnsManagedZoneLive = await resources.dnsManagedZone.getLive();
        assert(dnsManagedZoneLive.nameServers);
        return { dnsManagedZoneLive };
      },
      actions: [
        {
          name: `dig nameservers managedZone ${resources.bucketPublic.name}`,
          command: async ({ dnsManagedZoneLive }) => {
            const nameServer = dnsManagedZoneLive.nameServers[0];
            await checkDig({
              nameServer,
              domain: resources.bucketPublic.name,
              dnsManagedZoneLive,
            });
          },
        },
        {
          name: `dig nameservers recordSet ${resources.bucketPublic.name}`,
          command: async ({ dnsManagedZoneLive }) => {
            const nameServer = pipe([
              find((record) => record.type === "NS"),
              get("rrdatas"),
              first,
            ])(dnsManagedZoneLive.recordSet);
            await checkDig({
              nameServer,
              domain: resources.bucketPublic.name,
              dnsManagedZoneLive,
            });
          },
        },
        {
          name: `dig default nameserver ${resources.bucketPublic.name}`,
          command: async ({ dnsManagedZoneLive }) => {
            await checkDig({
              domain: resources.bucketPublic.name,
              dnsManagedZoneLive,
            });
          },
        },
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
