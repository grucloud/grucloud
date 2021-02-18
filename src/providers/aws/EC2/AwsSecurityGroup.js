const assert = require("assert");
const { get, pipe, map, eq, or, tap, fork } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const {
  Ec2New,
  getByIdCore,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { retryCall } = require("../../Retry");
const { getField } = require("../../ProviderCommon");

const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const logger = require("../../../logger")({ prefix: "AwsSg" });
const { tos } = require("../../../tos");

exports.AwsSecurityGroup = ({ spec, config }) => {
  const { managedByDescription } = config;
  assert(managedByDescription);

  const ec2 = Ec2New(config);

  const findName = get("GroupName");
  const findId = get("GroupId");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`list sg ${JSON.stringify(params)}`);
      }),
      () => ec2().describeSecurityGroups(params),
      get("SecurityGroups"),
      tap((securityGroups) => {
        logger.debug(`list sg result: ${tos(securityGroups)}`);
      }),
      (securityGroups) => ({
        total: securityGroups.length,
        items: securityGroups,
      }),
      tap(({ total }) => {
        logger.info(`list #sg ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "GroupIds", getList });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = pipe([
    get("resource"),
    or([
      eq(get("GroupName"), "default"),
      pipe([get("Tags"), find(eq(get("Key"), "aws:eks:cluster-name"))]),
    ]),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property

  const create = async ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create sg ${tos({ name })}`);
      }),
      () =>
        ec2().createSecurityGroup({
          Description: managedByDescription,
          GroupName: name,
          ...payload.create,
        }),
      get("GroupId"),
      tap((GroupId) =>
        pipe([
          () =>
            retryCall({
              name: `sg create isUpById: ${name} id: ${GroupId}`,
              fn: () => isUpById({ id: GroupId, name }),
              config,
            }),
          fork({
            ingress: tap.if(
              () => payload.ingress,
              () =>
                ec2().authorizeSecurityGroupIngress({
                  GroupId,
                  ...payload.ingress,
                })
            ),
            egress: tap.if(
              () => payload.egress,
              () =>
                ec2().authorizeSecurityGroupEgress({
                  GroupId,
                  ...payload.egress,
                })
            ),
          }),
        ])()
      ),
      tap((GroupId) => {
        logger.info(`created sg ${tos({ name, GroupId })}`);
      }),
      (GroupId) => ({ id: GroupId }),
    ])();

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy sg ${JSON.stringify({ name, id })}`);
      }),
      () => ec2().deleteSecurityGroup({ GroupId: id }),
      tap(() =>
        retryCall({
          name: `destroy sg isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.debug(`destroyed sg ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({
    name,
    properties: { Tags, ...otherProps },
    dependencies,
  }) => {
    const { vpc } = dependencies;
    assert(vpc, "missing vpc dependency");
    return defaultsDeep(otherProps)({
      create: {
        ...(vpc && { VpcId: getField(vpc, "VpcId") }),
        TagSpecifications: [
          {
            ResourceType: "security-group",
            Tags: buildTags({ config, name, UserTags: Tags }),
          },
        ],
      },
    });
  };

  return {
    type: "SecurityGroup",
    spec,
    findId,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    isUpById,
    isDownById,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
