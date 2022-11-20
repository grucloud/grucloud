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
  append,
  values,
  first,
} = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "Route53Record" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const { filterEmptyResourceRecords } = require("./Route53Utils");
const { createRoute53, buildRecordName } = require("./Route53Common");

const omitFieldRecord = omit(["HostedZoneId", "namespace"]);

const liveToResourceSet = pipe([omitFieldRecord, filterEmptyResourceRecords]);

const findId = () => pipe([buildRecordName]);

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
exports.removeLastCharacter = removeLastCharacter;

const Route53RecordDependencies = {
  elasticIpAddress: {
    type: "ElasticIpAddress",
    group: "EC2",
    parent: true,
    parentForName: true,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("ResourceRecords"),
        map(({ Value }) =>
          pipe([
            () =>
              lives.getByType({
                type: "ElasticIpAddress",
                group: "EC2",
                providerName: config.providerName,
              }),
            find(eq(get("live.PublicIp"), Value)),
            pick(["id", "name"]),
          ])()
        ),
        filter(not(isEmpty)),
        first,
      ]),
  },
  loadBalancer: {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    parent: true,
    parentForName: true,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "LoadBalancer",
                group: "ElasticLoadBalancingV2",
                providerName: config.providerName,
              }),
            find(({ live }) => pipe([() => DNSName, includes(live.DNSName)])()),
            pick(["id", "name"]),
          ])(),
      ]),
  },
  certificate: {
    type: "Certificate",
    group: "ACM",
    parent: true,
    parentForName: true,
    dependencyId:
      ({ lives, config }) =>
      (live) =>
        pipe([
          () =>
            lives.getByType({
              type: "Certificate",
              group: "ACM",
              providerName: config.providerName,
            }),
          find(
            and([
              eq(
                get("live.DomainValidationOptions[0].ResourceRecord.Name"),
                get("Name")(live)
              ),
              () => eq(get("Type"), "CNAME")(live),
            ])
          ),
          pick(["id", "name"]),
        ])(),
  },
  distribution: {
    type: "Distribution",
    group: "CloudFront",
    parent: true,
    parentForName: true,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "Distribution",
                group: "CloudFront",
                providerName: config.providerName,
              }),
            find(eq(get("live.DomainName"), DNSName)),
            pick(["id", "name"]),
          ])(),
      ]),
  },
  userPoolDomain: {
    type: "UserPoolDomain",
    group: "CognitoIdentityServiceProvider",
    parent: true,
    parentForName: true,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "UserPoolDomain",
                group: "CognitoIdentityServiceProvider",
                providerName: config.providerName,
              }),
            find(({ live }) =>
              pipe([
                () => DNSName,
                //TODO
                includes(live.CloudFrontDistribution),
              ])()
            ),
            pick(["id", "name"]),
          ])(),
      ]),
  },
  apiGatewayV2DomainName: {
    type: "DomainName",
    group: "ApiGatewayV2",
    parent: true,
    parentForName: true,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "DomainName",
                group: "ApiGatewayV2",
                providerName: config.providerName,
              }),
            find(
              eq(
                get("live.DomainNameConfigurations[0].ApiGatewayDomainName"),
                DNSName
              )
            ),
            pick(["id", "name"]),
          ])(),
      ]),
  },
  vpcEndpoint: {
    type: "VpcEndpoint",
    group: "EC2",
    parent: true,
    parentForName: true,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("AliasTarget.DNSName", ""),
        removeLastCharacter,
        (DNSName) =>
          pipe([
            () =>
              lives.getByType({
                type: "VpcEndpoint",
                group: "EC2",
                providerName: config.providerName,
              }),
            tap((params) => {
              assert(true);
            }),
            find(({ live: endpointLive }) =>
              pipe([
                () => DNSName,
                includes(
                  pipe([() => endpointLive, get("DnsEntries[0].DnsName")])()
                ),
              ])()
            ),
            tap((params) => {
              assert(true);
            }),
            pick(["id", "name"]),
          ])(),
      ]),
  },
};

exports.Route53RecordDependencies = Route53RecordDependencies;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53Record = ({ spec, config }) => {
  const { providerName } = config;
  const route53 = createRoute53(config);

  const findNameInDependencies =
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => Route53RecordDependencies,
        values,
        tap((params) => {
          assert(true);
        }),
        //TODO
        map(({ type, group, dependencyId }) =>
          pipe([
            () => live,
            dependencyId({ lives, config }),
            (id) => ({ type, group, id }),
          ])()
        ),
        tap((params) => {
          assert(true);
        }),
        find(pipe([get("id"), not(isEmpty)])),
        unless(
          isEmpty,
          pipe([
            tap(({ id }) => {
              assert(id);
            }),
            switchCase([
              eq(get("type"), "VpcEndpoint"),
              ({ group, type }) =>
                `record::${group}::${type}::${live.Type}::${live.Name}`,
              pipe([
                ({ group, type, id }) =>
                  `record::${group}::${type}::${live.Type}::${id.name}`,
                when(
                  () => live.SetIdentifier,
                  append(`::${live.SetIdentifier}`)
                ),
              ]),
            ]),
          ])
        ),
      ])();

  const findName =
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => {
          for (fn of [findNameInDependencies, findId]) {
            const name = fn({ lives, config })(live);
            if (!isEmpty(name)) {
              return name;
            }
          }
        },
      ])();

  const findNamespace = () => get("namespace", "");

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
        assert(hostedZone);
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

  const cannotBeDeleted = () =>
    pipe([
      get("Type"),
      tap((Type) => {
        assert(Type);
      }),
      (Type) => pipe([() => ["SOA", "NS"], includes(Type)])(),
    ]);

  const isOurMinion =
    ({ lives, config }) =>
    (live) =>
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
