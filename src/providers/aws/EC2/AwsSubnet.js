const { get, switchCase, pipe, tap } = require("rubico");
const { isEmpty } = require("rubico/x");
const assert = require("assert");
const logger = require("../../../logger")({ prefix: "AwsSn" });
const { getField } = require("../../ProviderCommon");
const { tos } = require("../../../tos");
const {
  getByNameCore,
  getByIdCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("../../Common");
const {
  Ec2New,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");

module.exports = AwsSubnet = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findName = switchCase([
    (item) => item.DefaultForAz,
    () => "default",
    findNameInTags,
  ]);

  const findId = get("SubnetId");

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = ({ id }) => getByIdCore({ id, getList, findId });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property

  const create = async ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create subnet ${tos({ name })}`);
        logger.debug(tos({ payload }));
      }),
      () => ec2().createSubnet(payload),
      get("Subnet.SubnetId"),
      tap((SubnetId) =>
        pipe([
          () =>
            tagResource({
              config,
              name,
              resourceType: "subnet",
              resourceId: SubnetId,
            }),
          () => getById({ id: SubnetId }),
          tap((subnet) => {
            assert(
              CheckAwsTags({
                config,
                tags: subnet.Tags,
                name: name,
              }),
              `missing tag for ${name}`
            );
          }),
        ])()
      ),
      tap((SubnetId) => {
        logger.info(`created subnet ${tos({ name, SubnetId })}`);
      }),
      (id) => ({ id }),
    ])();

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy subnet ${tos({ name, id })}`);
      }),
      () => ec2().deleteSubnet({ SubnetId: id }),
      tap(() => {
        logger.debug(`destroyed subnet ${tos({ name, id })}`);
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

  const configDefault = async ({ name, properties, dependencies }) => {
    // Need vpc name here in parameter
    const { vpc } = dependencies;
    const config = {
      ...(vpc && { VpcId: getField(vpc, "VpcId") }),
      ...properties,
    };
    return config;
  };

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
