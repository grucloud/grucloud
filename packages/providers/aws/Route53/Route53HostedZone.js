const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  filter,
  assign,
  flatMap,
  or,
  not,
  eq,
  and,
  pick,
  any,
} = require("rubico");
const {
  callProp,
  groupBy,
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  includes,
  differenceWith,
  isDeepEqual,
  when,
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
} = require("../Route53Domains/Route53DomainCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

// https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DomainNameFormat.html
// TODO make it generic
// parseInt("052",8) => 42
// String.fromCharCode(42) => *

const managedByOther = () =>
  pipe([get("Name"), callProp("endsWith", ".aoss.amazonaws.com.")]);

const octalReplace = pipe([callProp("replaceAll", "\\052", "*")]);

const findId = () =>
  pipe([
    get("HostedZoneId"),
    tap((id) => {
      assert(id);
    }),
  ]);

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

exports.findNsRecordByName = findNsRecordByName;

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

exports.findDnsServers = findDnsServers;

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ Id }) => {
      assert(Id);
    }),
    assign({ HostedZoneId: pipe([get("Id"), hostedZoneIdToResourceId]) }),
    assign({
      RecordSet: pipe([
        pick(["HostedZoneId"]),
        endpoint().listResourceRecordSets,
        get("ResourceRecordSets"),
        map(
          pipe([
            assign({
              Name: pipe([get("Name"), octalReplace]),
            }),
            when(
              get("AliasTarget"),
              assign({
                AliasTarget: pipe([
                  get("AliasTarget"),
                  assign({
                    DNSName: pipe([get("DNSName"), octalReplace]),
                  }),
                ]),
              })
            ),
          ])
        ),
      ]),
      Tags: pipe([
        ({ HostedZoneId }) => ({
          ResourceId: HostedZoneId,
          ResourceType: "hostedzone",
        }),
        endpoint().listTagsForResource,
        get("ResourceTagSet.Tags"),
      ]),
    }),
    ({ Config, ...other }) => ({ ...other, HostedZoneConfig: Config }),
    // arn:aws:route53:::hostedzone/hosted-zone-id
    assign({
      Arn: pipe([
        ({ HostedZoneId }) => `arn:aws:route53:::hostedzone/${HostedZoneId}`,
      ]),
    }),
  ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53HostedZone = ({ spec, config }) => {
  const route53 = createRoute53(config);
  const route53Domains = createRoute53Domains(config);
  const client = AwsClient({ spec, config })(route53);

  //Check for the final dot
  const findName = () => get("Name");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = client.getList({
    method: "listHostedZones",
    getParam: "HostedZones",
    decorate,
    // When at least one of the hosted zone is private:
    //   Get the list of VPCs
    //   For each VPCs, call listHostedZonesByVPC to get the hosted zones associated to the VPC
    //   Group the list by hosted zones
    //   Assign the hosted zones with the vpc associations
    transformListPost:
      ({ lives, endpoint }) =>
      (hostedZones) =>
        pipe([
          () => hostedZones,
          when(
            any(get("HostedZoneConfig.PrivateZone")),
            pipe([
              lives.getByType({
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
              callProp("sort", (a, b) => a.name.localeCompare(b.name)),
              pluck("live"),
              flatMap(({ VpcId /*Region */ }) =>
                pipe([
                  //TODO add region to the VPC, then
                  () => ({
                    VPCId: VpcId,
                    VPCRegion: config.region, // /*Region */
                  }),
                  endpoint().listHostedZonesByVPC,
                  get("HostedZoneSummaries"),
                  map(
                    defaultsDeep({
                      VPCId: VpcId /*, VPCRegion: config.region*/,
                    })
                  ),
                ])()
              ),
              groupBy("HostedZoneId"),
              (mapZone) =>
                pipe([
                  () => hostedZones,
                  map(
                    assign({
                      VpcAssociations: ({ HostedZoneId }) =>
                        pipe([
                          () => mapZone.get(HostedZoneId),
                          map(pick(["VPCId", "VPCRegion", "Owner"])),
                        ])(),
                    })
                  ),
                ])(),
            ])
          ),
        ])(),
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
      () => payload,
      defaultsDeep({ CallerReference: getNewCallerReference() }),
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
      tap.if(
        ({ DelegationSet }) =>
          domain &&
          DelegationSet &&
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
    preDestroy:
      ({ endpoint }) =>
      (live) =>
        pipe([
          () => live,
          ({ Id: HostedZoneId }) =>
            pipe([
              () => ({
                HostedZoneId,
              }),
              endpoint().listResourceRecordSets,
              get("ResourceRecordSets"),
              tap((ResourceRecordSet) => {
                logger.debug(`destroy ${tos(ResourceRecordSet)}`);
              }),
              filter(canDeleteRecord(live.Name)),
              map((ResourceRecordSet) => ({
                Action: "DELETE",
                ResourceRecordSet:
                  filterEmptyResourceRecords(ResourceRecordSet),
              })),
              tap((Changes) => {
                //logger.debug(`destroy ${tos(Changes)}`);
              }),
              tap.if(not(isEmpty), (Changes) =>
                endpoint().changeResourceRecordSets({
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
    ignoreErrorCodes: ["NoSuchHostedZone"],
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#updateHostedZoneComment-property
  const update = ({ name, payload, live, diff }) =>
    pipe([
      tap(() => {
        logger.info(`update hosted zone ${name}, diff: ${tos(diff)}`);
        assert(name, "name");
        assert(live, "live");
        assert(diff, "diff");
        //assert(diff.needUpdate, "diff.needUpate");
        //assert(diff.deletions, "diff.deletions");
      }),
      () => diff,
      tap.if(
        get("liveDiff.updated.HostedZoneConfig.Comment"),
        pipe([
          tap((params) => {
            assert(live.Id);
          }),
          () => live,
          ({ HostedZoneId }) => ({
            Id: HostedZoneId,
            Comment: payload.HostedZoneConfig.Comment,
          }),
          tap((params) => {
            assert(params);
          }),
          route53().updateHostedZoneComment,
          tap((params) => {
            assert(params);
          }),
        ])
      ),
      tap.if(
        get("needUpdateRecordSet"),
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
        )
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  const configDefault = ({
    name,
    properties: { Tags, ...otherProp },
    namespace,
    dependencies: { vpc },
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
      when(
        () => vpc,
        defaultsDeep({
          VPC: { VPCId: getField(vpc, "VpcId"), VPCRegion: config.region },
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  const ResourceType = "hostedzone";

  return {
    spec,
    findId,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    managedByOther,
    findNamespace: findNamespaceInTags,
    tagResource: tagResource({ ResourceType })({ endpoint: route53 }),
    untagResource: untagResource({ ResourceType })({ endpoint: route53 }),
  };
};
