const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get, switchCase } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "HostedZone" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { buildTags } = require("../AwsCommon");

// Remove the final dot
const findName = (item) => item.Name.slice(0, -1);

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
  const create = async ({ name, payload = {} }) => {
    return pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create hosted zone: ${name}, ${tos(payload)}`);
      }),
      () => route53.createHostedZone(payload).promise(),
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
      tap(({ HostedZone }) => {
        logger.debug(`created done`);
      }),
    ])();
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteHostedZone-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
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

  const configDefault = async ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ dependencies })}`);
    const CallerReference = `grucloud-${name}-${new Date()}`;
    return defaultsDeep({ Name: name, CallerReference })(properties);
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
    destroy,
    getList,
    configDefault,
  };
};
