const assert = require("assert");
const shell = require("shelljs");
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
      //assert(result);
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

exports.dnsEntryAdd = ({ config, globalForwardingRule }) =>
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
  ])();

exports.dnsEntryRemove = ({ config }) =>
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
  ])({});
