const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  assign,
  fork,
  or,
  not,
  eq,
  omit,
  and,
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
  flatten,
  identity,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "HostedZone" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  logError,
  axiosErrorToJSON,
} = require("@grucloud/core/Common");
const {
  Route53New,
  Route53DomainsNew,
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
  getNewCallerReference,
} = require("../AwsCommon");

const { filterEmptyResourceRecords } = require("./Route53Utils");

//Check for the final dot
const findName = get("Name");
const findId = get("Id");

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
    tap((xxx) => {
      logger.debug(``);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsHostedZone = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  const route53 = Route53New(config);
  const route53domains = Route53DomainsNew(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "HostedZone",
      ids: pipe([
        tap(() => {
          logger.debug(``);
        }),
        () => lives.getByType({ type: "HostedZone", providerName }),
        tap((xxx) => {
          logger.debug(``);
        }),
        filter(not(eq(get("name"), live.Name))),
        tap((xxx) => {
          logger.debug(``);
        }),
        filter(
          pipe([
            tap((xxx) => {
              logger.debug(``);
            }),
            get("live.RecordSet"),
            findNsRecordByName(live.Name),
            tap((xxx) => {
              logger.debug(``);
            }),
            get("ResourceRecords"),
            first,
            get("Value"),
            tap((xxx) => {
              logger.debug(``);
            }),
            (dnsServer) => includes(dnsServer)(findDnsServers(live)),
            tap((xxx) => {
              logger.debug(``);
            }),
          ])
        ),
        pluck("id"),
        tap((xxx) => {
          logger.debug(``);
        }),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = async () =>
    pipe([
      tap(() => {
        logger.debug(`getList hostedZone`);
      }),
      () => route53().listHostedZones({}),
      get("HostedZones"),
      map(
        assign({
          RecordSet: pipe([
            (hostedZone) =>
              route53().listResourceRecordSets({
                HostedZoneId: hostedZone.Id,
              }),
            get("ResourceRecordSets"),
          ]),
          Tags: pipe([
            (hostedZone) =>
              route53().listTagsForResource({
                ResourceId: hostedZone.Id,
                ResourceType: "hostedzone",
              }),
            get("ResourceTagSet.Tags"),
          ]),
        })
      ),
      tap((hostedZones) => {
        logger.debug(`getList hostedZone result: ${tos(hostedZones)}`);
      }),
      (hostedZones) => ({
        total: hostedZones.length,
        items: hostedZones,
      }),
      tap(({ total }) => {
        logger.info(`getList #hostedZone: ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getHostedZone-property
  const getById = pipe([
    tap(({ id, name }) => {
      logger.info(`getById ${id}, name: ${name}`);
    }),
    tryCatch(
      ({ id }) => route53().getHostedZone({ Id: id }),
      switchCase([
        eq(get("code"), "NoSuchHostedZone"),
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchHostedZone`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  const createReusableDelegationSet = pipe([
    () => route53().listReusableDelegationSets(),
    get("DelegationSets"),
    tap((ReusableDelegationSets) => {
      logger.info(
        `createReusableDelegationSet: #ReusableDelegationSets ${ReusableDelegationSets.length}`
      );
    }),
    find(pipe([get("CallerReference"), includes("grucloud")])),
    tap((ReusableDelegation) => {
      logger.info(
        `createReusableDelegationSet: ReusableDelegation: ${ReusableDelegation}`
      );
    }),
    switchCase([
      isEmpty,
      pipe([
        () =>
          route53().createReusableDelegationSet({
            CallerReference: getNewCallerReference(),
          }),
        get("DelegationSet.Id"),
      ]),
      get("Id"),
    ]),
    tap((DelegationSetId) => {
      logger.info(
        `createReusableDelegationSet: DelegationSetId: ${DelegationSetId}`
      );
    }),
    (DelegationSetId) => DelegationSetId.replace("/delegationset/", ""),
    tap((DelegationSetId) => {
      logger.info(`create DelegationSet: ${DelegationSetId}`);
    }),
  ]);

  const findOrCreateReusableDelegationSet = pipe([
    tap(() => {
      logger.debug(`findOrCreateReusableDelegationSet`);
    }),
    getList,
    get("items"),
    pluck("Tags"),
    filter(not(isEmpty)),
    flatten,
    find(eq(get("Key"), "DelegationSetId")),
    get("Value"),
    tap((DelegationSetId) => {
      logger.info(
        `findOrCreateReusableDelegationSet DelegationSetId: ${DelegationSetId}`
      );
    }),
    switchCase([isEmpty, createReusableDelegationSet, identity]),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property
  const create = async ({
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
      findOrCreateReusableDelegationSet,
      (DelegationSetId) =>
        pipe([
          () =>
            route53().createHostedZone({
              Name: payload.Name,
              CallerReference: getNewCallerReference(),
              DelegationSetId,
            }),
          tap((result) => {
            logger.debug(
              `created hosted zone: ${name}, result: ${tos(result)}`
            );
          }),
          tap(({ HostedZone }) =>
            route53().changeTagsForResource({
              ResourceId: HostedZone.Id,
              AddTags: [
                ...buildTags({ name, namespace, config }),
                { Key: "DelegationSetId", Value: DelegationSetId },
              ],
              ResourceType: "hostedzone",
            })
          ),
          tap(({ HostedZone }) =>
            pipe([
              () => payload.RecordSet,
              map((ResourceRecordSet) => ({
                Action: "CREATE",
                ResourceRecordSet,
              })),
              tap.if(not(isEmpty), (Changes) =>
                route53().changeResourceRecordSets({
                  HostedZoneId: HostedZone.Id,
                  ChangeBatch: {
                    Changes,
                  },
                })
              ),
            ])()
          ),
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
              (Nameservers) =>
                route53domains().updateDomainNameservers({
                  DomainName: domain.live.DomainName,
                  Nameservers,
                }),
              tap(({ OperationId }) => {
                logger.debug(`updateDomainNameservers ${tos({ OperationId })}`);
              }),
            ])
          ),
          tap((HostedZone) => {
            logger.debug(`created done`);
          }),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
        assert(name, "destroy name");
      }),
      () =>
        route53().listResourceRecordSets({
          HostedZoneId: id,
        }),
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
      tap.if(
        (Changes) => !isEmpty(Changes),
        (Changes) =>
          route53().changeResourceRecordSets({
            HostedZoneId: id,
            ChangeBatch: {
              Changes,
            },
          })
      ),
      () =>
        route53().deleteHostedZone({
          Id: id,
        }),
      tap(() =>
        retryCall({
          name: `hostedZone isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id, name }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy done, ${tos({ name, id })}`);
      }),
    ])();

  const update = async ({ name, live, diff }) =>
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

  const configDefault = async ({ name, properties, dependencies }) => {
    return defaultsDeep({
      Name: name,
      RecordSet: [],
    })(properties);
  };

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
    shouldRetryOnException,
    findNamespace: findNamespaceInTags(config),
  };
};

exports.compareHostedZone = async ({
  usedBySet,
  target,
  live,
  dependencies,
  lives,
}) =>
  pipe([
    tap(() => {
      //logger.debug(`compareHostedZone ${tos({ target, live, dependencies })}`);
      assert(target.RecordSet, "target.recordSet");
      assert(live.RecordSet, "live.recordSet");
      assert(usedBySet, "usedBySet");
      assert(lives);
    }),
    fork({
      liveRecordSet: () => filter(canDeleteRecord(target.Name))(live.RecordSet),
      targetRecordSet: async () =>
        map(
          tryCatch(
            (resource) => {
              return resource.resolveConfig({ lives, deep: true });
            },
            (error) => {
              logger.error("compareHostedZone error in resolveConfig");
              logger.error(tos(error));
              return { error };
            }
          )
        )([...usedBySet.values()]),
    }),
    //TODO throw if error
    tap((xxx) => {
      logger.debug(`compareHostedZone `);
    }),
    fork({
      deletions: ({ liveRecordSet, targetRecordSet }) =>
        differenceWith(
          (left, right) =>
            and([eq(get("Name"), right.Name), eq(get("Type"), right.Type)])(
              left
            ),
          liveRecordSet
        )(targetRecordSet),
    }),
    tap((xxx) => {
      logger.debug(`compareHostedZone `);
    }),
    assign({
      needUpdateRecordSet: or([(diff) => !isEmpty(diff.deletions)]),
      needUpdateManagedZone: () => target.Name !== live.Name,
    }),
    assign({
      needUpdate: or([
        (diff) => diff.needUpdateRecordSet,
        (diff) => diff.needUpdateManagedZone,
      ]),
    }),
    tap((diff) => {
      logger.debug(`compareHostedZone diff:${tos(diff)}`);
    }),
  ])();
