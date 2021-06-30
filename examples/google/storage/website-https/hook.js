const assert = require("assert");
const { retryCallOnError, retryCall } = require("@grucloud/core").Retry;
const Axios = require("axios");
const {
  pipe,
  get,
  fork,
  any,
  tap,
  switchCase,
  eq,
  assign,
  and,
  not,
  filter,
  or,
} = require("rubico");
const { first, find, isEmpty, callProp } = require("rubico/x");

const { dnsEntryAdd, dnsEntryRemove } = require("./route53Utils");

module.exports = ({ resources, provider }) => {
  const { config } = provider;
  const bucketUrl = `https://${resources.bucketPublic.name}`;
  const bucketStorageUrl = `https://storage.googleapis.com/${resources.bucketPublic.name}`;
  const bucketUrlIndex = `${bucketStorageUrl}/index.html`;
  const bucketUrl404 = `${bucketStorageUrl}/404.html`;
  assert(resources.globalForwardingRule);

  const axios = Axios.create({
    timeout: 5e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: pipe([
        fork({
          sslCertificate: () => resources.sslCertificate.getLive(),
          globalForwardingRule: () => resources.globalForwardingRule.getLive(),
        }),
        tap.if(any(isEmpty), (result) => {
          throw Error(`cannot get live resources`);
        }),
      ]),
      actions: [
        {
          name: `add dns record for the load balancer`,
          command: ({ globalForwardingRule }) =>
            dnsEntryAdd({ globalForwardingRule, config }),
        },
        {
          name: `get ${bucketUrlIndex}`,
          command: async ({}) => {
            await retryCallOnError({
              name: `get  ${bucketUrlIndex}`,
              fn: () => axios.get(bucketUrlIndex),
              shouldRetryOnException: ({ error }) => {
                return [404].includes(error.response?.status);
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
              shouldRetryOnException: ({ error }) => {
                return [404].includes(error.response?.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
          },
        },
        // {
        //   name: `get ${bucketUrl404}`,
        //   command: async ({}) => {
        //     await retryCallOnError({
        //       name: `get  ${bucketUrl404}`,
        //       fn: () => axios.get(bucketUrl404),
        //       shouldRetryOnException: ({ error }) => {
        //         return [404].includes(error.response?.status);
        //       },
        //       config: { retryCount: 20, retryDelay: 5e3 },
        //     });
        //   },
        // },
        {
          name: `ssl certificate ready`,
          command: async ({ sslCertificate }) => {
            await retryCall({
              name: `check certificate status`,
              fn: pipe([
                () => resources.sslCertificate.getLive(),
                tap((result) => {
                  //console.log("certificate", result);
                }),
                get("certificate"),
              ]),
              isExpectedResult: not(isEmpty),
              config: { retryCount: 500, retryDelay: 10e3 },
            });
          },
        },
        {
          name: `get ${bucketUrl}`,
          command: async () => {
            await retryCallOnError({
              name: `get  ${bucketUrl}`,
              fn: () => axios.get(bucketUrl),
              shouldRetryOnException: ({ error }) =>
                pipe([
                  tap(() => {
                    assert(true);
                  }),
                  () => error,
                  or([
                    eq(get("response.status"), 404),
                    eq(get("code"), "EPROTO"),
                  ]),
                  tap((xxx) => {
                    assert(true);
                  }),
                ])(),
              config: { retryCount: 500, retryDelay: 5e3 },
            });
          },
        },
      ],
    },
    onDestroyed: {
      init: pipe([() => ({})]),
      actions: [
        {
          name: `remove the load balancer A DNS record`,
          command: () => dnsEntryRemove({ config }),
        },
      ],
    },
  };
};
