const assert = require("assert");
const AWS = require("aws-sdk");
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
  omit,
} = require("rubico");
const {
  find,
  defaultsDeep,
  isEmpty,
  differenceWith,
  isDeepEqual,
} = require("rubico/x");

const logger = require("../../../logger")({ prefix: "HostedZone" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  logError,
  axiosErrorToJSON,
} = require("../../Common");
const { buildTags } = require("../AwsCommon");

//Check for the final dot
const findName = (item) => item.Name;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsHostedZone = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const route53 = new AWS.Route53();

  const findId = (item) => {
    assert(item);
    const id = item.Id;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listHostedZones-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${tos(params)}`);
      }),
      () => route53.listHostedZones(params).promise(),
      get("HostedZones"),
      map(async (hostedZone) => ({
        ...hostedZone,
        RecordSet: await pipe([
          () =>
            route53
              .listResourceRecordSets({
                HostedZoneId: hostedZone.Id,
              })
              .promise(),
          get("ResourceRecordSets"),
        ])(),
        Tags: await pipe([
          () =>
            route53
              .listTagsForResource({
                ResourceId: hostedZone.Id,
                ResourceType: "hostedzone",
              })
              .promise(),
          get("ResourceTagSet.Tags"),
        ])(),
      })),
      (hostedZones) => ({
        total: hostedZones.length,
        items: hostedZones,
      }),
      tap((hostedZones) => {
        logger.debug(`getList hostedZone result: ${tos(hostedZones)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getHostedZone-property
  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => route53.getHostedZone({ Id: id }).promise(),
      switchCase([
        (error) => error.code !== "NoSuchHostedZone",
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchHostedZone`);
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createHostedZone-property
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create hosted zone: ${name}, ${tos(payload)}`);
      }),
      () =>
        route53
          .createHostedZone(pick(["Name", "CallerReference"])(payload))
          .promise(),
      tap(({ HostedZone }) => {
        logger.debug(
          `created hosted zone: ${name}, result: ${tos(HostedZone)}`
        );
      }),
      tap(({ HostedZone }) =>
        route53
          .changeTagsForResource({
            ResourceId: HostedZone.Id,
            AddTags: buildTags({ name, config }),
            ResourceType: "hostedzone",
          })
          .promise()
      ),
      tap(({ HostedZone }) =>
        pipe([
          map((ResourceRecordSet) => ({
            Action: "CREATE",
            ResourceRecordSet,
          })),
          tap.if(
            (Changes) => !isEmpty(Changes),
            (Changes) =>
              route53
                .changeResourceRecordSets({
                  HostedZoneId: HostedZone.Id,
                  ChangeBatch: {
                    Changes,
                  },
                })
                .promise()
          ),
        ])(payload.RecordSet)
      ),
      tap(({ HostedZone }) => {
        logger.debug(`created done`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        route53
          .listResourceRecordSets({
            HostedZoneId: id,
          })
          .promise(),
      get("ResourceRecordSets"),
      tap((ResourceRecordSet) => {
        logger.debug(`destroy ${tos(ResourceRecordSet)}`);
      }),
      filter((record) => !["NS", "SOA"].includes(record.Type)),
      map((ResourceRecordSet) => ({
        Action: "DELETE",
        ResourceRecordSet,
      })),
      tap((Changes) => {
        logger.debug(`destroy ${tos(Changes)}`);
      }),
      tap.if(
        (Changes) => !isEmpty(Changes),
        (Changes) =>
          route53
            .changeResourceRecordSets({
              HostedZoneId: id,
              ChangeBatch: {
                Changes,
              },
            })
            .promise()
      ),
      () =>
        route53
          .deleteHostedZone({
            Id: id,
          })
          .promise(),
      tap(() =>
        retryExpectOk({
          name: `isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.debug(`destroy done, ${tos({ name, id })}`);
      }),
    ])();

  const update = async ({ name, live, diff }) =>
    pipe([
      tap(() => {
        logger.info(`update ${name}, diff: ${tos(diff)}`);
        assert(name, "name");
        assert(live, "live");
        assert(diff, "diff");
        assert(diff.needUpdate, "diff.needUpate");
        assert(diff.deletions, "diff.deletions");
        assert(diff.additions, "diff.additions");
      }),
      switchCase([
        () => diff.needUpdateRecordSet,
        tryCatch(
          pipe([
            () => [
              ...map((ResourceRecordSet) => ({
                Action: "DELETE",
                ResourceRecordSet,
              }))(diff.deletions),
              ...map((ResourceRecordSet) => ({
                Action: "CREATE",
                ResourceRecordSet,
              }))(diff.additions),
            ],
            tap((Changes) => {
              logger.debug(`update changes ${tos(Changes)}`);
            }),
            (Changes) =>
              route53
                .changeResourceRecordSets({
                  HostedZoneId: live.Id,
                  ChangeBatch: {
                    Changes,
                  },
                })
                .promise(),
            tap(({ ChangeInfo }) => {
              logger.info(`updated ${name}, ChangeInfo: ${ChangeInfo}`);
            }),
          ]),
          (error) => {
            logError(`update`, error);
            throw axiosErrorToJSON(error);
          }
        ),
      ]),
    ])();

  const configDefault = async ({ name, properties, dependencies }) => {
    const CallerReference = `grucloud-${name}-${new Date()}`;
    return defaultsDeep({ Name: name, CallerReference, RecordSet: [] })(
      properties
    );
  };

  return {
    type: "HostedZone",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
  };
};

const filterNonDeletableRecords = ({ targetRecordSet, liveRecordSet }) =>
  pipe([
    () =>
      filter(
        (type) =>
          !find((targetRecord) => targetRecord.Type === type)(targetRecordSet)
      )(["SOA", "NS"]),
    tap((types) => {
      logger.debug(`filterNonDeletableRecords: types: ${types}`);
    }),
    (types) => filter((record) => !types.includes(record.Type))(liveRecordSet),
    tap((liveRecordSet) => {
      logger.debug(`filterNonDeletableRecords: ${tos(liveRecordSet)}`);
    }),
  ])();

exports.compareHostedZone = async ({ target, live }) =>
  pipe([
    tap(() => {
      logger.debug(`compareHostedZone ${tos({ target, live })}`);
      assert(target.RecordSet, "target.recordSet");
      assert(live.RecordSet, "live.recordSet");
    }),
    () =>
      filterNonDeletableRecords({
        targetRecordSet: target.RecordSet,
        liveRecordSet: live.RecordSet,
      }),
    fork({
      additions: (liveRecordSet) =>
        differenceWith(isDeepEqual, target.RecordSet)(liveRecordSet),
      deletions: (liveRecordSet) =>
        differenceWith(isDeepEqual, liveRecordSet)(target.RecordSet),
    }),
    tap((xxx) => {
      logger.debug(`compareHostedZone `);
    }),
    assign({
      needUpdateRecordSet: or([
        (diff) => !isEmpty(diff.additions),
        (diff) => !isEmpty(diff.deletions),
      ]),
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
