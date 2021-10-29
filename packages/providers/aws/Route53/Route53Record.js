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
  flatMap,
} = require("rubico");
const {
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  isDeepEqual,
  callProp,
  size,
  includes,
  identity,
  unless,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({ prefix: "Route53Record" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const { Route53New, shouldRetryOnException } = require("../AwsCommon");
const { filterEmptyResourceRecords } = require("./Route53Utils");

const omitFieldRecord = omit(["Tags", "HostedZoneId", "namespace"]);

const liveToResourceSet = pipe([omitFieldRecord, filterEmptyResourceRecords]);
const RecordKeyPrefix = "gc-record-";
const buildRecordTagKey = (name) => `${RecordKeyPrefix}${name}`;
const getNameFromTagKey = (key = "") => key.replace(RecordKeyPrefix, "");
const buildRecordTagValue = ({ Name, Type }) => `${Name}::${Type}`;

const findNameInTags = pipe([
  get("live"),
  tap((live) => {
    logger.debug(`findName live ${tos(live)}`);
    assert(live.Name);
    //assert(live.Tags);
  }),
  ({ Name, Type, Tags }) =>
    find(eq(get("Value"), buildRecordTagValue({ Name, Type })))(Tags),
  tap((tag) => {
    logger.debug(`findName tag ${tos(tag)}`);
  }),
  get("Key"),
  getNameFromTagKey,
  tap((Key) => {
    logger.debug(`findName name: ${tos(Key)}`);
  }),
]);

const findId = pipe([get("live"), buildRecordTagValue]);

const getHostedZone = ({ resource: { name, dependencies }, lives }) =>
  pipe([
    tap(() => {
      assert(dependencies);
      assert(lives);
    }),
    () => dependencies(),
    get("hostedZone"),
    switchCase([
      isEmpty,
      () => {
        throw {
          code: 422,
          message: `resource record '${name}' is missing the hostedZone dependency'`,
        };
      },
      pipe([
        (hostedZone) => hostedZone.getLive({ lives }),
        tap((live) => {
          logger.debug(`getHostedZone live ${tos(live)}`);
        }),
      ]),
    ]),
  ])();
const removeLastCharacter = callProp("slice", 0, -1);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53Record = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const { providerName } = config;
  const route53 = Route53New(config);

  const findDependencies = ({ live, lives }) => [
    { type: "HostedZone", group: "Route53", ids: [live.HostedZoneId] },
    {
      type: "LoadBalancer",
      group: "ELBv2",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "LoadBalancer",
                group: "ELBv2",
                providerName,
              }),
            filter(({ live }) =>
              pipe([() => DNSName, includes(live.DNSName)])()
            ),
            map(pick(["id", "name"])),
          ])(),
      ])(),
    },
    {
      type: "DomainName",
      group: "APIGateway",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "DomainName",
                group: "APIGateway",
                providerName,
              }),
            filter(eq(get("live.regionalDomainName"), DNSName)),
            map(pick(["id", "name"])),
          ])(),
      ])(),
    },
    {
      type: "DomainName",
      group: "ApiGatewayV2",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "DomainName",
                group: "ApiGatewayV2",
                providerName,
              }),
            filter(
              eq(
                get("live.DomainNameConfigurations[0].ApiGatewayDomainName"),
                DNSName
              )
            ),
            map(pick(["id", "name"])),
          ])(),
      ])(),
    },
    {
      type: "Distribution",
      group: "CloudFront",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "Distribution",
                group: "CloudFront",
                providerName,
              }),
            filter(eq(get("live.DomainName"), DNSName)),
            map(pick(["id", "name"])),
          ])(),
      ])(),
    },
    {
      type: "Certificate",
      group: "ACM",
      ids: pipe([
        () =>
          lives.getByType({
            type: "Certificate",
            group: "ACM",
            providerName,
          }),
        filter(
          and([
            eq(
              get("live.DomainValidationOptions[0].ResourceRecord.Name"),
              get("Name")(live)
            ),
            () => eq(get("Type"), "CNAME")(live),
          ])
        ),
        map(pick(["id", "name"])),
      ])(),
    },
  ];

  const findNameInDependencies = pipe([
    findDependencies,
    filter(not(eq(get("type"), "HostedZone"))),
    find(pipe([get("ids"), not(isEmpty)])),
    unless(
      isEmpty,
      ({ group, type, ids }) => `record::${group}::${type}::${ids[0].name}`
    ),
  ]);

  const findName = ({ live, lives }) =>
    pipe([
      () => {
        for (fn of [findNameInDependencies, findNameInTags, findId]) {
          const name = fn({ live, lives, config });
          if (!isEmpty(name)) {
            return name;
          }
        }
      },
    ])();

  const findNamespace = get("live.namespace", "");

  const findRecordInZone = ({ name, namespace, hostedZone }) =>
    pipe([
      () => hostedZone,
      tap(() => {
        logger.debug(`findRecordInZone ${tos({ name, hostedZone })}`);
      }),
      get("Tags", []),
      find(eq(get("Key"), buildRecordTagKey(name))),
      get("Value"),
      tryCatch(
        pipe([
          callProp("split", "::"),
          ([Name, Type] = []) =>
            find(
              and([
                //
                eq(get("Name"), Name),
                eq(get("Type"), Type),
              ])
            )(hostedZone.RecordSet),
        ]),
        (error) => {
          logger.debug(`findRecordInZone ${name}, cannot find record in tags`);
        }
      ),

      switchCase([
        isEmpty,
        () => undefined,
        (record) => ({
          ...record,
          Tags: hostedZone.Tags,
          HostedZoneId: hostedZone.Id,
          namespace,
        }),
      ]),
      tap((record) => {
        logger.debug(`findRecordInZone ${name}: ${tos({ record })}`);
      }),
    ])();

  const getListFromLive = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getListFromLive`);
        assert(lives);
      }),
      () =>
        lives.getByType({ providerName, type: "HostedZone", group: "Route53" }),
      flatMap((hostedZone) =>
        pipe([
          () => hostedZone,
          get("live.RecordSet"),
          map(assign({ HostedZoneId: () => hostedZone.id })),
        ])()
      ),
      tap((records) => {
        logger.debug(`getListFromLive result: ${tos(records)}`);
      }),
    ])();

  const getListFromTarget = ({ resources = [], lives } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getListFromTarget #resources ${size(resources)}`);
        assert(lives);
      }),
      () => resources,
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getListFromTarget resource ${resource.name}`);
          }),
          () => getHostedZone({ resource, lives }),
          tap((hostedZone) => {
            logger.debug(`getListFromTarget, hostedZone: ${hostedZone}`);
          }),
          switchCase([
            isEmpty,
            () => null,
            (hostedZone) =>
              findRecordInZone({
                name: resource.name,
                namespace: resource.namespace,
                hostedZone,
              }),
          ]),
        ])()
      ),
      filter(not(isEmpty)),
      tap((records) => {
        logger.debug(`getList route53 records result: ${tos(records)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = ({ resources = [], lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList Route53Record #resources ${resources.length}`);
      }),
      fork({
        recordsLive: () => getListFromLive({ lives }),
        recordsTarget: () => getListFromTarget({ resources, lives }),
      }),
      tap(({ recordsLive, recordsTarget }) => {
        logger.debug(
          `getList route53 records result: ${tos({
            recordsLive,
            recordsTarget,
          })}`
        );
      }),
      ({ recordsLive, recordsTarget }) =>
        pipe([
          () => recordsLive,
          map((recordLive) =>
            pipe([
              () => recordsTarget,
              find((recordTarget) =>
                pipe([
                  fork({
                    recordTargetFiltered: () =>
                      omit(["Tags", "namespace"])(recordTarget),
                    recordLiveFiltered: () =>
                      omit(["Tags", "namespace"])(recordLive),
                  }),
                  ({ recordTargetFiltered, recordLiveFiltered }) =>
                    isDeepEqual(recordTargetFiltered, recordLiveFiltered),
                ])()
              ),
              switchCase([isEmpty, () => recordLive, identity]),
            ])()
          ),
        ])(),
    ])();

  const getByName = ({ name, namespace, dependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
        assert(dependencies, "dependencies");
      }),
      () => getHostedZone({ resource: { dependencies, name }, lives }),
      switchCase([
        not(isEmpty),
        (hostedZone) => findRecordInZone({ name, namespace, hostedZone }),
        () => {},
      ]),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const create = ({
    name,
    payload = {},
    resolvedDependencies: { hostedZone },
  }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        assert(!payload.message);
        logger.info(`create record: ${name}`);
        logger.debug(
          `create record: ${name}, ${tos(payload)}, ${tos({
            hostedZone,
          })}`
        );
      }),
      () => payload,
      (ResourceRecordSet) => ({
        Action: "CREATE",
        ResourceRecordSet,
      }),
      (Change) =>
        route53().changeResourceRecordSets({
          HostedZoneId: hostedZone.live.Id,
          ChangeBatch: {
            Changes: [Change],
          },
        }),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
      () =>
        route53().changeTagsForResource({
          ResourceId: hostedZone.live.Id,
          AddTags: [
            {
              Key: buildRecordTagKey(name),
              Value: buildRecordTagValue(payload),
            },
          ],
          ResourceType: "hostedzone",
        }),
      tap((result) => {
        logger.info(`record created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = ({ id, name, live, lives, resource }) =>
    pipe([
      tap(() => {
        logger.info(`destroy Route53Record ${name}, ${id} ${tos({ live })}`);
        assert(!isEmpty(id), `destroy invalid id`);
        assert(name, "destroy name");
        //assert(resource, "resource");
        assert(lives);
        assert(live);
      }),
      () => live,
      switchCase([
        not(isEmpty),
        tryCatch(
          pipe([
            (live) =>
              route53().changeResourceRecordSets({
                HostedZoneId: live.HostedZoneId,
                ChangeBatch: {
                  Changes: [
                    {
                      Action: "DELETE",
                      ResourceRecordSet: liveToResourceSet(live),
                    },
                  ],
                },
              }),
            // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeTagsForResource-property
            () =>
              route53().changeTagsForResource({
                ResourceId: live.HostedZoneId,
                RemoveTagKeys: [buildRecordTagKey(name)],
                ResourceType: "hostedzone",
              }),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(
                  `error destroy Route53Record ${error}, live: ${tos(live)}`
                );
              }),
              () => error,
              switchCase([
                pipe([get("message"), includes("but it was not found")]),
                () => undefined,
                () => {
                  throw error;
                },
              ]),
            ])()
        ),
        () => {
          logger.error(`no live record for ${name}`);
        },
      ]),
      tap((result) => {
        logger.debug(
          `destroyed Route53Record, ${JSON.stringify({ name, id })}`
        );
      }),
    ])();

  const update = ({
    name,
    payload,
    live,
    diff,
    resolvedDependencies: { hostedZone },
  }) =>
    pipe([
      tap(() => {
        logger.info(
          `update ${name}, payload: ${tos(payload)}, live: ${tos(
            live
          )}, diff:  ${tos(diff)}`
        );
        assert(name, "name");
        assert(live, "live");
        assert(diff, "diff");
        assert(hostedZone, "missing the hostedZone dependency.");
        assert(hostedZone.live.Id, "hostedZone.live.Id");
      }),
      () => ({ createSet: payload, deleteSet: liveToResourceSet(live) }),
      switchCase([
        ({ createSet, deleteSet }) => isDeepEqual(createSet, deleteSet),
        () => {
          logger.info(`update route53 ${name}, same create and delete`);
        },
        ({ createSet, deleteSet }) =>
          route53().changeResourceRecordSets({
            HostedZoneId: hostedZone.live.Id,
            ChangeBatch: {
              Changes: [
                {
                  Action: "DELETE",
                  ResourceRecordSet: deleteSet,
                },
                {
                  Action: "CREATE",
                  ResourceRecordSet: createSet,
                },
              ],
            },
          }),
      ]),
      tap((result) => {
        logger.info(`record updated: ${name}`);
      }),
    ])();

  const certificateRecord = ({ certificate }) =>
    pipe([
      () => certificate,
      unless(
        isEmpty,
        pipe([
          () => ({
            Name: getField(
              certificate,
              "DomainValidationOptions[0].ResourceRecord.Name"
            ),
            ResourceRecords: [
              {
                Value: getField(
                  certificate,
                  "DomainValidationOptions[0].ResourceRecord.Value"
                ),
              },
            ],
            TTL: 300,
            Type: "CNAME",
          }),
        ])
      ),
    ])();

  const loadBalancerRecord = ({ loadBalancer, hostedZone }) =>
    pipe([
      () => loadBalancer,
      unless(isEmpty, () => ({
        Name: hostedZone.config.Name,
        Type: "A",
        AliasTarget: {
          HostedZoneId: getField(loadBalancer, "CanonicalHostedZoneId"),
          DNSName: `${getField(loadBalancer, "DNSName")}.`,
          EvaluateTargetHealth: false,
        },
      })),
    ])();

  //TODO Regional
  const apiGatewayRecord = ({ apiGatewayDomainName, hostedZone }) =>
    pipe([
      () => apiGatewayDomainName,
      unless(isEmpty, () => ({
        Name: hostedZone.config.Name,
        Type: "A",
        AliasTarget: {
          HostedZoneId: getField(apiGatewayDomainName, "regionalHostedZoneId"),
          DNSName: `${getField(apiGatewayDomainName, "regionalDomainName")}.`,
          EvaluateTargetHealth: false,
        },
      })),
    ])();

  const apiGatewayV2Record = ({ apiGatewayV2DomainName, hostedZone }) =>
    pipe([
      () => apiGatewayV2DomainName,
      unless(isEmpty, () => ({
        Name: hostedZone.config.Name,
        Type: "A",
        AliasTarget: {
          HostedZoneId: getField(
            apiGatewayV2DomainName,
            "DomainNameConfigurations[0].HostedZoneId"
          ),
          DNSName: `${getField(
            apiGatewayV2DomainName,
            "DomainNameConfigurations[0].ApiGatewayDomainName"
          )}.`,
          EvaluateTargetHealth: false,
        },
      })),
    ])();

  const distributionRecord = ({ distribution, hostedZone }) =>
    pipe([
      () => distribution,
      unless(isEmpty, () => ({
        Name: hostedZone.config.Name,
        Type: "A",
        AliasTarget: {
          HostedZoneId: "Z2FDTNDATAQYW2",
          DNSName: `${getField(distribution, "DomainName")}.`,
          EvaluateTargetHealth: false,
        },
      })),
    ])();

  const configDefault = ({
    name,
    properties,
    dependencies: {
      certificate,
      loadBalancer,
      hostedZone,
      apiGatewayDomainName,
      apiGatewayV2DomainName,
      distribution,
    },
  }) =>
    pipe([
      tap(() => {
        assert(hostedZone, "missing hostedZone dependencies");
      }),
      () => properties,
      defaultsDeep(certificateRecord({ certificate })),
      defaultsDeep(loadBalancerRecord({ loadBalancer, hostedZone })),
      defaultsDeep(apiGatewayRecord({ apiGatewayDomainName, hostedZone })),
      defaultsDeep(apiGatewayV2Record({ apiGatewayV2DomainName, hostedZone })),
      defaultsDeep(distributionRecord({ distribution, hostedZone })),
      defaultsDeep({ Name: name }),
    ])();

  const cannotBeDeleted = pipe([
    get("live.Type"),
    tap((Type) => {
      assert(Type);
    }),
    (Type) => pipe([() => ["SOA", "NS"], includes(Type)])(),
  ]);

  return {
    spec,
    findDependencies,
    findNamespace,
    findId,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    cannotBeDeleted,
    shouldRetryOnException,
  };
};
//TODO ResourceRecords: [] ?
const filterTarget = ({ config, target }) =>
  pipe([() => target, defaultsDeep({ ResourceRecords: [] })])();

const filterLive = ({ live }) => pipe([() => live, omitFieldRecord])();

exports.compareRoute53Record = pipe([
  tap((xxx) => {
    assert(true);
  }),
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareRoute53Record ${tos(diff)}`);
  }),
]);
