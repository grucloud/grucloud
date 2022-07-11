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
  not,
  eq,
  omit,
  and,
  flatMap,
} = require("rubico");
const {
  find,
  defaultsDeep,
  isEmpty,
  isDeepEqual,
  callProp,
  includes,
  unless,
  when,
} = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "Route53Record" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const { filterEmptyResourceRecords } = require("./Route53Utils");
const { createRoute53, buildRecordName } = require("./Route53Common");

const omitFieldRecord = omit(["HostedZoneId", "namespace"]);

const liveToResourceSet = pipe([omitFieldRecord, filterEmptyResourceRecords]);

const findId = pipe([get("live"), buildRecordName]);

const getHostedZone = ({
  resource: { name, dependencies },
  lives,
  resolvedDependencies,
}) =>
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
        (hostedZone) => hostedZone.getLive({ lives, resolvedDependencies }),
        tap((live) => {
          //logger.debug(`getHostedZone live ${tos(live)}`);
        }),
      ]),
    ]),
  ])();
const removeLastCharacter = callProp("slice", 0, -1);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53Record = ({ spec, config }) => {
  const { providerName } = config;
  const route53 = createRoute53(config);
  //const client = AwsClient({ spec, config })(route53);

  const findDependencies = ({ live, lives }) => [
    { type: "HostedZone", group: "Route53", ids: [live.HostedZoneId] },
    {
      type: "HealthCheck",
      group: "Route53",
      ids: pipe([() => [live.HealthCheckId], filter(not(isEmpty))])(),
    },
    {
      type: "VpcEndpoint",
      group: "EC2",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "VpcEndpoint",
                group: "EC2",
                providerName,
              }),
            filter(({ live: endpointLive }) =>
              pipe([
                () => DNSName,
                includes(
                  pipe([() => endpointLive, get("DnsEntries[0].DnsName")])()
                ),
              ])()
            ),
            map(pick(["id", "name"])),
          ])(),
      ])(),
    },
    {
      type: "ElasticIpAddress",
      group: "EC2",
      ids: pipe([
        () => live,
        get("ResourceRecords"),
        map(({ Value }) =>
          pipe([
            () =>
              lives.getByType({
                type: "ElasticIpAddress",
                group: "EC2",
                providerName,
              }),
            find(eq(get("live.PublicIp"), Value)),
            pick(["id", "name"]),
          ])()
        ),
        filter(not(isEmpty)),
      ])(),
    },
    {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "LoadBalancer",
                group: "ElasticLoadBalancingV2",
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
      type: "UserPoolDomain",
      group: "CognitoIdentityServiceProvider",
      ids: pipe([
        () => live,
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "UserPoolDomain",
                group: "CognitoIdentityServiceProvider",
                providerName,
              }),
            filter(({ live }) =>
              pipe([() => DNSName, includes(live.CloudFrontDistribution)])()
            ),
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

  const findNameInDependencies = ({ live, lives }) =>
    pipe([
      () => ({ live, lives }),
      findDependencies,
      filter(not(eq(get("type"), "HostedZone"))),
      tap((params) => {
        assert(true);
      }),
      find(pipe([get("ids"), not(isEmpty)])),
      unless(
        isEmpty,
        pipe([
          tap((params) => {
            assert(true);
          }),
          tap(({ ids }) => {
            if (!ids[0].name) {
              assert(ids[0].name);
            }
          }),
          switchCase([
            eq(get("type"), "VpcEndpoint"),
            ({ group, type }) =>
              `record::${group}::${type}::${live.Type}::${live.Name}`,
            ({ group, type, ids }) =>
              `record::${group}::${type}::${live.Type}::${ids[0].name}`,
          ]),
        ])
      ),
    ])();

  const findName = ({ live, lives }) =>
    pipe([
      () => {
        for (fn of [findNameInDependencies, findId]) {
          const name = fn({ live, lives, config });
          if (!isEmpty(name)) {
            return name;
          }
        }
      },
    ])();

  const findNamespace = get("live.namespace", "");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList record`);
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
    ])();

  const getByName = ({
    name,
    properties,
    dependencies,
    lives,
    resolvedDependencies = {},
  }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
        assert(dependencies, "dependencies");
      }),
      tap((params) => {
        assert(true);
      }),
      () =>
        configDefault({
          name,
          properties: properties({ getId: () => undefined, config }),
          dependencies: resolvedDependencies,
        }),
      tap((params) => {
        assert(true);
      }),
      buildRecordName,
      (targetRecordName) =>
        pipe([
          tap(() => {
            logger.debug(`getByName recordName ${targetRecordName}`);
          }),
          () =>
            getHostedZone({
              resource: { dependencies, name },
              lives,
              resolvedDependencies,
            }),
          tap((params) => {
            assert(targetRecordName);
          }),
          get("RecordSet"),
          tap((RecordSet) => {
            // logger.debug(
            //   `getByName RecordSet ${JSON.stringify(RecordSet, null, 4)}`
            // );
          }),
          find(
            pipe([buildRecordName, callProp("startsWith", targetRecordName)])
          ),
        ])(),
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
      (Change) => ({
        HostedZoneId: hostedZone.live.Id,
        ChangeBatch: {
          Changes: [Change],
        },
      }),
      route53().changeResourceRecordSets,
      tap((result) => {
        logger.info(`record created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = ({ name, live, lives }) =>
    pipe([
      tap(() => {
        logger.info(`destroy Route53Record ${name}, ${tos({ live })}`);
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
            (live) => ({
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
            route53().changeResourceRecordSets,
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
        logger.debug(`destroyed Route53Record, ${JSON.stringify({ name })}`);
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
        logger.debug(
          `update ${name}, payload: ${tos(payload)}, live: ${tos(
            live
          )}, diff: ${tos(diff)}`
        );
        assert(hostedZone, "missing the hostedZone dependency.");
        assert(hostedZone.live.Id, "hostedZone.live.Id");
      }),
      () => ({ createSet: payload, deleteSet: liveToResourceSet(live) }),
      switchCase([
        ({ createSet, deleteSet }) => isDeepEqual(createSet, deleteSet),
        () => {
          logger.info(`update route53 ${name}, same create and delete`);
        },
        pipe([
          ({ createSet, deleteSet }) => ({
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
          route53().changeResourceRecordSets,
        ]),
      ]),
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
          DNSName: `dualstack.${getField(loadBalancer, "DNSName")}.`,
          EvaluateTargetHealth: true,
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

  const userPoolDomainRecord = ({ userPoolDomain, hostedZone }) =>
    pipe([
      () => userPoolDomain,
      unless(isEmpty, () => ({
        Name: `${getField(userPoolDomain, "Domain")}.`,
        Type: "A",
        AliasTarget: {
          HostedZoneId: "Z2FDTNDATAQYW2",
          DNSName: `${getField(userPoolDomain, "CloudFrontDistribution")}.`,
          EvaluateTargetHealth: false,
        },
      })),
    ])();

  const vpcEndpointRecord = ({ vpcEndpoint, hostedZone }) =>
    pipe([
      () => vpcEndpoint,
      unless(isEmpty, () => ({
        Type: "A",
        AliasTarget: {
          DNSName: `${getField(vpcEndpoint, "DnsEntries[0].DnsName")}.`,
          HostedZoneId: getField(vpcEndpoint, "DnsEntries[0].HostedZoneId"),
          EvaluateTargetHealth: false,
        },
      })),
    ])();

  const configDefault = ({
    name,
    properties = {},
    dependencies: {
      certificate,
      loadBalancer,
      hostedZone,
      apiGatewayV2DomainName,
      distribution,
      userPoolDomain,
      vpcEndpoint,
      healthCheck,
    },
  }) =>
    pipe([
      tap(() => {
        //assert(hostedZone, "missing hostedZone dependencies");
      }),
      () => properties,
      when(
        () => healthCheck,
        defaultsDeep({ HealthCheckId: getField(healthCheck, "Id") })
      ),
      defaultsDeep(certificateRecord({ certificate })),
      defaultsDeep(loadBalancerRecord({ loadBalancer, hostedZone })),
      defaultsDeep(apiGatewayV2Record({ apiGatewayV2DomainName, hostedZone })),
      defaultsDeep(distributionRecord({ distribution, hostedZone })),
      defaultsDeep(userPoolDomainRecord({ userPoolDomain, hostedZone })),
      defaultsDeep(vpcEndpointRecord({ vpcEndpoint })),
      defaultsDeep({ Name: name }),
    ])();

  const cannotBeDeleted = pipe([
    get("live.Type"),
    tap((Type) => {
      assert(Type);
    }),
    (Type) => pipe([() => ["SOA", "NS"], includes(Type)])(),
  ]);

  const isOurMinion = ({ live, lives, config }) =>
    pipe([
      () => live,
      tap((HostedZoneId) => {
        assert(HostedZoneId);
      }),
      get("HostedZoneId"),
      (id) =>
        lives.getById({
          id,
          type: "HostedZone",
          group: "Route53",
          providerName: config.providerName,
        }),
      tap.if(isEmpty, () => {
        logger.error(`missing hostedZone ${live.HostedZoneId} in cache`);
      }),
      get("managedByUs"),
      tap((params) => {
        assert(true);
      }),
    ])();

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
    isOurMinion,
  };
};
exports.compareRoute53Record = pipe([
  compareAws({ getTargetTags: () => [], getLiveTags: () => [] })({
    filterTarget: () => pipe([defaultsDeep({})]),
    filterLive: () => pipe([omitFieldRecord]),
  }),
  tap((diff) => {
    //logger.debug(`compareRoute53Record ${tos(diff)}`);
  }),
]);
