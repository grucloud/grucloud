const assert = require("assert");
const { get, switchCase, pipe, tap, map, tryCatch, any } = require("rubico");
const { defaultsDeep, forEach } = require("rubico/x");

const { retryCall } = require("@grucloud/core/Retry");
const logger = require("@grucloud/core/logger")({ prefix: "AwsSubnet" });
const { getField } = require("@grucloud/core/ProviderCommon");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  getByIdCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  findNameInTags,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

exports.AwsSubnet = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findName = switchCase([
    get("DefaultForAz"),
    () => "default",
    findNameInTags,
  ]);

  const findId = get("SubnetId");

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = ({ id }) => getByIdCore({ id, getList, findId });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property

  const create = async ({ payload, attributes, name }) =>
    pipe([
      tap(() => {
        logger.info(`create subnet ${JSON.stringify({ name })}`);
        logger.debug(tos({ payload }));
      }),
      () => ec2().createSubnet(payload),
      get("Subnet.SubnetId"),
      tap((SubnetId) =>
        retryCall({
          name: `create subnet isDownById: ${name} SubnetId: ${SubnetId}`,
          fn: () => isUpById({ id: SubnetId }),
          config,
        })
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifySubnetAttribute-property
      tap((SubnetId) =>
        pipe([
          () => Object.entries(attributes()),
          forEach(
            tryCatch(
              pipe([
                ([key, value]) => ({ [key]: value, SubnetId }),
                tap((params) => {
                  logger.debug(
                    `modifySubnetAttribute ${JSON.stringify(params)}`
                  );
                }),
                (params) => ec2().modifySubnetAttribute(params),
              ]),
              (error, entry) =>
                pipe([
                  tap(() => {
                    logger.error(
                      `modifySubnetAttribute ${JSON.stringify({
                        error,
                        entry,
                      })}`
                    );
                  }),
                  () => ({ error, entry }),
                ])()
            )
          ),
          tap.if(any(get("error")), (results) => {
            throw Error(`modifySubnetAttribute error: ${tos(results)}`);
          }),
        ])()
      ),
      tap((SubnetId) => {
        logger.info(`created subnet ${JSON.stringify({ name, SubnetId })}`);
      }),
      (id) => ({ id }),
    ])();

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy subnet ${JSON.stringify({ name, id })}`);
      }),
      () => ec2().deleteSubnet({ SubnetId: id }),
      tap(() =>
        retryCall({
          name: `destroy subnet isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroyed subnet ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList subnet ${JSON.stringify(params)}`);
      }),
      () => ec2().describeSubnets(params),
      get("Subnets"),
      tap((items) => {
        logger.debug(`getList subnet result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #subnet ${total}`);
      }),
    ])();

  const configDefault = async ({
    name,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
  }) =>
    defaultsDeep({
      ...(vpc && { VpcId: getField(vpc, "VpcId") }),
      TagSpecifications: [
        {
          ResourceType: "subnet",
          Tags: buildTags({ config, name, UserTags: Tags }),
        },
      ],
    })(otherProps);

  const cannotBeDeleted = get("resource.DefaultForAz");

  return {
    type: "Subnet",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
