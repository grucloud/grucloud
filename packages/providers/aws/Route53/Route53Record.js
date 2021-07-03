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
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  isDeepEqual,
  callProp,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({ prefix: "Route53Record" });
const { tos } = require("@grucloud/core/tos");
const { Route53New, shouldRetryOnException } = require("../AwsCommon");
const { filterEmptyResourceRecords } = require("./Route53Utils");

const omitFieldRecord = omit(["Tags", "hostedZoneId", "namespace"]);

const liveToResourceSet = pipe([omitFieldRecord, filterEmptyResourceRecords]);
const RecordKeyPrefix = "gc::record-";
const buildRecordTagKey = (name) => `${RecordKeyPrefix}${name}`;
const getNameFromTagKey = (key = "") => key.replace(RecordKeyPrefix, "");
const buildRecordTagValue = ({ Name, Type }) => `${Name}::${Type}`;

const findName = pipe([
  tap((live) => {
    logger.debug(`findName live ${tos(live)}`);
    assert(live.Name);
    assert(live.Tags);
  }),
  ({ Name, Type, Tags }) =>
    find(eq(get("Value"), buildRecordTagValue({ Name, Type })))(Tags),
  tap((tag) => {
    logger.debug(`findName tag ${tos(tag)}`);
  }),
  get("Key"),
  getNameFromTagKey,
  tap((Key) => {
    logger.info(`findName name: ${tos(Key)}`);
  }),
]);

const findId = ({ Name, Type }) => `${Type}::${Name}`;

const getHostedZone = ({ name, dependencies = {} }) =>
  pipe([
    () => dependencies,
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
        (hostedZone) => hostedZone.getLive(),
        tap((live) => {
          logger.debug(`getHostedZone live ${tos(live)}`);
        }),
      ]),
    ]),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.Route53Record = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const route53 = Route53New(config);

  const findDependencies = ({ live }) => [
    // TODO findDependencies
    { type: "HostedZone", ids: [live.hostedZoneId] },
  ];

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
      tap((xxx) => {
        assert(true);
      }),
      tryCatch(
        pipe([
          callProp("split", "::"),
          tap((xxx) => {
            logger.debug(`findRecordInZone ${xxx}`);
          }),
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

      tap((xxx) => {
        assert(true);
      }),
      switchCase([
        isEmpty,
        () => undefined,
        (record) => ({
          ...record,
          Tags: hostedZone.Tags,
          hostedZoneId: hostedZone.Id,
          namespace,
        }),
      ]),
      tap((record) => {
        logger.debug(`findRecordInZone ${name}: ${tos({ record })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = async ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList Route53Record #resources ${resources.length}`);
      }),
      () => resources,
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getList Route53Record resource ${resource.name}`);
          }),
          () => getHostedZone(resource),
          tap((hostedZone) => {
            logger.debug(`getList Route53Record, hostedZone: ${hostedZone}`);
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
      (records) => ({
        total: records.length,
        items: records,
      }),
      tap(({ total }) => {
        logger.info(`getList #route53records: ${total}`);
      }),
    ])();

  const getByName = async ({ name, namespace, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
        assert(dependencies, "dependencies");
      }),
      () => getHostedZone({ dependencies, name }),
      switchCase([
        not(isEmpty),
        (hostedZone) => findRecordInZone({ name, namespace, hostedZone }),
        () => {},
      ]),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const create = async ({
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
  const destroy = async ({ id, name, live, resource }) =>
    pipe([
      tap(() => {
        logger.info(`destroy Route53Record ${tos({ name, id, live })}`);
        assert(!isEmpty(id), `destroy invalid id`);
        assert(name, "destroy name");
        assert(resource, "resource");
      }),
      () => resource,
      getHostedZone,
      (hostedZone) =>
        pipe([
          () => live,
          switchCase([
            not(isEmpty),
            pipe([
              (live) =>
                route53().changeResourceRecordSets({
                  HostedZoneId: hostedZone.Id,
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
                  ResourceId: hostedZone.Id,
                  RemoveTagKeys: [buildRecordTagKey(name)],
                  ResourceType: "hostedzone",
                }),
            ]),
            () => {
              logger.error(`no live record for ${name}`);
            },
          ]),
        ])(),
      tap((result) => {
        logger.debug(`destroy Route53Record done, ${tos({ name, id })}`);
      }),
    ])();

  const update = async ({
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

  const configDefault = async ({ name, properties, dependencies }) => {
    return defaultsDeep({ Name: name })(properties);
  };

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
    shouldRetryOnException,
  };
};
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
