const assert = require("assert");
const { Resolver } = require("dns").promises;
const shell = require("shelljs");

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

const buildChangeCreate = pipe([
  ({ bucketName, IPAddress, resourceRecord }) => ({
    Comment: "delete current, create new",
    Changes: filter(not(isEmpty))([
      ...(resourceRecord
        ? [
            {
              Action: "DELETE",
              ResourceRecordSet: resourceRecord,
            },
          ]
        : []),
      {
        Action: "CREATE",
        ResourceRecordSet: {
          Name: bucketName,
          Type: "A",
          TTL: 300,
          ResourceRecords: [{ Value: IPAddress }],
        },
      },
    ]),
  }),
  JSON.stringify,
  tap((command) => {
    assert(command);
  }),
]);

const buildChangeDelete = pipe([
  tap(({ resourceRecord }) => {
    //assert(resourceRecord);
  }),

  ({ resourceRecord }) => ({
    Comment: "delete current",
    Changes: [
      {
        Action: "DELETE",
        ResourceRecordSet: resourceRecord,
      },
    ],
  }),
  JSON.stringify,
  tap((command) => {
    assert(command);
  }),
]);

const resourceRecordFind = ({ hostedZoneId, name, type }) =>
  pipe([
    () =>
      `aws route53 list-resource-record-sets --hosted-zone-id ${hostedZoneId}`,
    tap((command) => {
      assert(command, name, type);
    }),
    (command) =>
      shell.exec(command, {
        silent: true,
      }),
    tap((result) => {
      assert(result);
    }),
    JSON.parse,
    tap((result) => {
      assert(result);
    }),
    get("ResourceRecordSets"),
    find(and([eq(get("Name"), name), eq(get("Type"), type)])),
    tap((result) => {
      //assert(result);
    }),
  ])();

const findHostedZoneId = ({ domainName }) =>
  pipe([
    tap((result) => {
      assert(true);
    }),
    () => `aws route53 list-hosted-zones-by-name --dns-name ${domainName}`,
    (command) =>
      shell.exec(command, {
        silent: true,
      }),
    tap((result) => {
      assert(result);
    }),
    JSON.parse,
    tap((result) => {
      assert(result);
    }),
    get("HostedZones[0].Id", ""),
    callProp("replace", "/hostedzone/", ""),
    tap((result) => {
      assert(true);
    }),
  ])();

const awsRoute53ChangeResourceRecordSets = ({ hostedZoneId, changeBatch }) =>
  pipe([
    () =>
      `aws route53 change-resource-record-sets --hosted-zone-id ${hostedZoneId} --change-batch '${changeBatch}'`,
    (command) =>
      shell.exec(command, {
        silent: true,
      }),
    tap((result) => {
      //console.log(result);
    }),
    switchCase([
      eq(get("code"), 0),
      pipe([get("stdout"), (stdout) => {}]),
      ({ stderr }) => {
        throw Error(stderr);
      },
    ]),
  ])();

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
            pipe([
              tap((command) => {
                assert(true);
              }),
              fork({
                IPAddress: pipe([
                  () => globalForwardingRule,
                  get("IPAddress"),
                  tap.if(isEmpty, () => {
                    throw Error("cannot get load balancer IPAddress");
                  }),
                ]),
                hostedZoneId: pipe([
                  () => findHostedZoneId({ domainName: config.bucketName }),
                  tap.if(isEmpty, () => {
                    throw Error("cannot get hostedZoneId");
                  }),
                ]),
              }),
              assign({
                resourceRecord: pipe([
                  ({ hostedZoneId }) =>
                    resourceRecordFind({
                      hostedZoneId,
                      type: "A",
                      name: `${config.bucketName}.`,
                    }),
                ]),
              }),
              tap(({ IPAddress, hostedZoneId, resourceRecord }) =>
                awsRoute53ChangeResourceRecordSets({
                  hostedZoneId,
                  changeBatch: buildChangeCreate({
                    bucketName: config.bucketName,
                    IPAddress,
                    resourceRecord,
                  }),
                })
              ),
            ])(),
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
          command: () =>
            pipe([
              assign({
                hostedZoneId: pipe([
                  () => findHostedZoneId({ domainName: config.bucketName }),
                  tap.if(isEmpty, () => {
                    throw Error("cannot get hostedZoneId");
                  }),
                ]),
              }),
              assign({
                resourceRecord: pipe([
                  ({ hostedZoneId }) =>
                    resourceRecordFind({
                      hostedZoneId,
                      type: "A",
                      name: `${config.bucketName}.`,
                    }),
                ]),
              }),
              tap(({ hostedZoneId, resourceRecord }) =>
                pipe([
                  () => resourceRecord,
                  tap.if(not(isEmpty), () =>
                    awsRoute53ChangeResourceRecordSets({
                      hostedZoneId,
                      changeBatch: buildChangeDelete({
                        resourceRecord,
                      }),
                    })
                  ),
                ])
              ),
            ])({}),
        },
      ],
    },
  };
};
