const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  filter,
  assign,
  fork,
  or,
  not,
  eq,
  and,
  pick,
} = require("rubico");
const {
  first,
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  includes,
  differenceWith,
  isDeepEqual,
} = require("rubico/x");

const { AwsClient } = require("../AwsClient");
const util = require("util");

const logger = require("@grucloud/core/logger")({ prefix: "HostedZone" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  logError,
  axiosErrorToJSON,
} = require("@grucloud/core/Common");
const {
  buildTags,
  findNamespaceInTags,
  getNewCallerReference,
} = require("../AwsCommon");

const { filterEmptyResourceRecords } = require("./Route53Utils");
const {
  createRoute53,
  tagResource,
  untagResource,
  hostedZoneIdToResourceId,
} = require("./Route53Common");
const {
  createRoute53Domains,
} = require("../Route53Domain/Route53DomainCommon");

//Check for the final dot
const findName = get("live.Name");
const findId = pipe([get("live.Id"), hostedZoneIdToResourceId]);
const pickId = pick(["Id"]);

const canDeleteRecord = (zoneName) =>
  not(
    and([
      (record) => ["NS", "SOA"].includes(record.Type),
      eq(get("Name"), zoneName),
    ])
  );

const findNsRecordByName = (name) =>
  find(and([eq(get("Name"), name), eq(get("Type"), "NS")]));

const findDnsServers = (live) =>
  pipe([
    () => live.RecordSet,
    findNsRecordByName(live.Name),
    get("ResourceRecords"),
    pluck("Value"),
    tap((params) => {
      assert(true);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53HostedZone = ({ spec, config }) => {
  const route53 = createRoute53(config);
  const route53Domains = createRoute53Domains(config);
  const client = AwsClient({ spec, config })(route53);
  const { providerName } = config;

  const findDependencies = ({ live, lives }) => [
    {
      type: "Domain",
      group: "Route53Domains",
      ids: pipe([
        () =>
          lives.getByType({
            type: "Domain",
            group: "Route53Domains",
            providerName,
          }),
        filter(
          pipe([
            get("live.DomainName"),
            (DomainName) =>
              pipe([() => live.Name.slice(0, -1), includes(DomainName)])(),
          ])
        ),
        pluck("id"),
      ])(),
    },
    {
      type: "HostedZone",
      group: "Route53",
      ids: pipe([
        () =>
          lives.getByType({
            type: "HostedZone",
            group: "Route53",
            providerName,
          }),
        filter(not(eq(get("name"), live.Name))),
        filter(
          pipe([
            get("live.RecordSet"),
            findNsRecordByName(live.Name),
            get("ResourceRecords"),
            first,
            get("Value"),
            (dnsServer) => includes(dnsServer)(findDnsServers(live)),
          ])
        ),
        pluck("id"),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = client.getList({
    method: "listHostedZones",
    getParam: "HostedZones",
    decorate: () =>
      pipe([
        assign({
          RecordSet: pipe([
            (hostedZone) => ({
              HostedZoneId: hostedZone.Id,
            }),
            route53().listResourceRecordSets,
            get("ResourceRecordSets"),
          ]),
          Tags: pipe([
            (hostedZone) => ({
              ResourceId: hostedZoneIdToResourceId(hostedZone.Id),
              ResourceType: "hostedzone",
            }),
            route53().listTagsForResource,
            get("ResourceTagSet.Tags"),
          ]),
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getHostedZone-property
  const getById = client.getById({
    pickId,
    method: "getHostedZone",
    ignoreErrorCodes: ["NoSuchHostedZone"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property
  const create = ({
    name,
    namespace,
    payload = {},
    resolvedDependencies: { domain },
  }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create hosted zone: ${name}, ${tos(payload)}`);
      }),
      () => ({
        Name: payload.Name,
        //TODO other param ?
        CallerReference: getNewCallerReference(),
      }),
      route53().createHostedZone,
      tap((result) => {
        logger.debug(`created hosted zone: ${name}, result: ${tos(result)}`);
      }),
      tap(
        pipe([
          get("HostedZone.Id"),
          tap((Id) => {
            assert(Id);
          }),
          hostedZoneIdToResourceId,
          (ResourceId) => ({
            ResourceId,
            AddTags: payload.Tags,
            ResourceType: "hostedzone",
          }),
          route53().changeTagsForResource,
        ])
      ),
      // tap(({ HostedZone }) =>
      //   pipe([
      //     () => payload.RecordSet,
      //     map((ResourceRecordSet) => ({
      //       Action: "CREATE",
      //       ResourceRecordSet,
      //     })),
      //     tap.if(not(isEmpty), (Changes) =>
      //       route53().changeResourceRecordSets({
      //         HostedZoneId: HostedZone.Id,
      //         ChangeBatch: {
      //           Changes,
      //         },
      //       })
      //     ),
      //   ])()
      // ),
      tap.if(
        ({ DelegationSet }) =>
          domain &&
          !isEmpty(
            differenceWith(
              isDeepEqual,
              DelegationSet.NameServers
            )(domain.live.Nameservers.map(({ Name }) => Name))
          ),
        pipe([
          get("DelegationSet.NameServers"),
          tap((NameServers) => {
            logger.debug(
              `updateDomainNameservers ${tos(NameServers)}, old: ${tos(
                domain.live.Nameservers
              )}`
            );
          }),
          map((nameserver) => ({ Name: nameserver })),
          tryCatch(
            pipe([
              //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Domains.html#updateDomainNameservers-property
              (Nameservers) => ({
                DomainName: domain.live.DomainName,
                Nameservers,
              }),
              route53Domains().updateDomainNameservers,
              tap(({ OperationId }) => {
                logger.debug(`updateDomainNameservers ${tos({ OperationId })}`);
              }),
              ({ OperationId }) =>
                retryCall({
                  name: `updateDomainNameservers: getOperationDetail OperationId: ${OperationId}`,
                  fn: pipe([
                    () => ({ OperationId }),
                    route53Domains().getOperationDetail,
                    tap((details) => {
                      logger.debug(
                        `updateDomainNameservers details: ${util.inspect(
                          details
                        )}`
                      );
                    }),
                    tap(({ Status, Message }) =>
                      pipe([
                        tap(() => {
                          logger.debug(
                            `updateDomainNameservers Status: ${Status}, Message: ${Message}`
                          );
                        }),
                        () => ["ERROR", "FAILED"],
                        tap.if(includes(Status), () => {
                          logger.error(
                            `Cannot updateDomainNameservers: ${Message}`
                          );
                          throw Error(
                            `Cannot updateDomainNameservers: ${Message}`
                          );
                        }),
                      ])()
                    ),
                  ]),
                  isExpectedResult: or([
                    pipe([get("Status"), isEmpty]), //TODO SDK v3 does not have Status
                    pipe([eq(get("Status"), "SUCCESSFUL")]),
                  ]),
                  config,
                }),
              // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Domains.html#getOperationDetail-property
            ]),
            (error) => {
              logger.error(`updateDomainNameservers ${tos({ error })}`);
              throw error;
            }
          ),
        ])
      ),
      tap((HostedZone) => {
        logger.debug(`created done`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = client.destroy({
    pickId,
    preDestroy: ({ live, name }) =>
      pipe([
        () => live,
        ({ Id: HostedZoneId }) =>
          pipe([
            () => ({
              HostedZoneId,
            }),
            route53().listResourceRecordSets,
            get("ResourceRecordSets"),
            tap((ResourceRecordSet) => {
              logger.debug(`destroy ${tos(ResourceRecordSet)}`);
            }),
            filter(canDeleteRecord(name)),
            map((ResourceRecordSet) => ({
              Action: "DELETE",
              ResourceRecordSet: filterEmptyResourceRecords(ResourceRecordSet),
            })),
            tap((Changes) => {
              logger.debug(`destroy ${tos(Changes)}`);
            }),
            tap.if(not(isEmpty), (Changes) =>
              route53().changeResourceRecordSets({
                HostedZoneId,
                ChangeBatch: {
                  Changes,
                },
              })
            ),
          ])(),
      ])(),
    method: "deleteHostedZone",
    getById,
    //ignoreErrorCodes: [""],
    config,
  });

  const update = ({ name, live, diff }) =>
    pipe([
      tap(() => {
        logger.info(`update hosted zone ${name}, diff: ${tos(diff)}`);
        assert(name, "name");
        assert(live, "live");
        assert(diff, "diff");
        assert(diff.needUpdate, "diff.needUpate");
        assert(diff.deletions, "diff.deletions");
      }),
      switchCase([
        () => diff.needUpdateRecordSet,
        tryCatch(
          pipe([
            () =>
              map((ResourceRecordSet) => ({
                Action: "DELETE",
                ResourceRecordSet:
                  filterEmptyResourceRecords(ResourceRecordSet),
              }))(diff.deletions),
            tap((Changes) => {
              logger.debug(`update changes ${tos(Changes)}`);
            }),
            (Changes) =>
              route53().changeResourceRecordSets({
                HostedZoneId: live.Id,
                ChangeBatch: {
                  Changes,
                },
              }),
            tap(({ ChangeInfo }) => {
              logger.info(`updated ${name}, ChangeInfo: ${ChangeInfo}`);
            }),
          ]),
          (error) => {
            logError(`update`, error);
            //TODO axios here ?
            throw axiosErrorToJSON(error);
          }
        ),
      ]),
    ])();

  const configDefault = ({
    name,
    properties: { Tags, ...otherProp },
    namespace,
  }) =>
    pipe([
      () => otherProp,
      defaultsDeep({
        Name: name,
        Tags: buildTags({
          name,
          namespace,
          config,
          UserTags: Tags,
        }),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const ResourceType = "hostedzone";

  return {
    spec,
    findId,
    getByName,
    findDependencies,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    findNamespace: findNamespaceInTags(config),
    tagResource: tagResource({ route53, ResourceType }),
    untagResource: untagResource({ route53, ResourceType }),
  };
};
//TODO
// exports.compareHostedZone = ({ target, live, dependencies, lives }) =>
//   pipe([
//     tap(() => {
//       //logger.debug(`compareHostedZone ${tos({ target, live, dependencies })}`);
//       assert(live.RecordSet, "live.recordSet");
//       assert(lives);
//     }),
//     fork({
//       liveRecordSet: () => filter(canDeleteRecord(target.Name))(live.RecordSet),
//       targetRecordSet: async () =>
//         map(
//           tryCatch(
//             (resource) => {
//               return resource.resolveConfig({ lives, deep: true });
//             },
//             (error) => {
//               logger.error("compareHostedZone error in resolveConfig");
//               logger.error(tos(error));
//               return { error };
//             }
//           )
//         )([]),
//     }),
//     //TODO throw if error
//     tap((xxx) => {
//       logger.debug(`compareHostedZone `);
//     }),
//     fork({
//       deletions: ({ liveRecordSet, targetRecordSet }) =>
//         differenceWith(
//           (left, right) =>
//             and([eq(get("Name"), right.Name), eq(get("Type"), right.Type)])(
//               left
//             ),
//           liveRecordSet
//         )(targetRecordSet),
//     }),
//     tap((xxx) => {
//       logger.debug(`compareHostedZone `);
//     }),
//     assign({
//       needUpdateRecordSet: or([(diff) => !isEmpty(diff.deletions)]),
//       needUpdateManagedZone: () => target.Name !== live.Name,
//     }),
//     assign({
//       needUpdate: or([
//         get("needUpdateRecordSet"),
//         get("needUpdateManagedZone"),
//       ]),
//     }),
//     tap((diff) => {
//       logger.debug(`compareHostedZone diff:${tos(diff)}`);
//     }),
//   ])();
