const { get, pipe, filter, map, tap, eq, switchCase, not } = require("rubico");
const { defaultsDeep, isEmpty, first } = require("rubico/x");
const assert = require("assert");

const logger = require("../../../logger")({ prefix: "AwsNatGateway" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  getByIdCore,
  findNameInTagsOrId,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

exports.AwsNatGateway = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = get("NatGatewayId");

  const findName = (item) => findNameInTagsOrId({ item, findId });
  const isInstanceUp = eq(get("State"), "available");
  const isInstanceDown = eq(get("State"), "deleted");
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNatGateways-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList nat ${JSON.stringify(params)}`);
      }),
      () => ec2().describeNatGateways(params),
      get("NatGateways"),
      filter(not(isInstanceDown)),
      tap((items) => {
        logger.debug(`getList nat result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #nat ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "NatGatewayIds", getList });

  const isUpById = isUpByIdCore({
    getById,
    isInstanceUp,
  });

  const isDownById = isDownByIdCore({
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNatGateway-property

  const create = async ({
    payload,
    name,
    resolvedDependencies: { eip, subnet },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create nat ${tos({ name })}`);
        assert(eip, "NatGateway is missing the dependency 'eip'");
        assert(subnet, "NatGateway is missing the dependency 'subnet'");
      }),
      () =>
        defaultsDeep({
          AllocationId: eip.live.AllocationId,
          SubnetId: subnet.live.SubnetId,
        })(payload),
      (params) => ec2().createNatGateway(params),
      get("NatGateway"),
      tap((NatGateway) => {
        logger.info(`nat created ${tos(NatGateway)}`);
      }),
      ({ NatGatewayId }) =>
        retryCall({
          name: `nat isUpById: ${name} id: ${NatGatewayId}`,
          fn: () => isUpById({ name, id: NatGatewayId }),
        }),
      ({ NatGatewayId }) => ({ id: NatGatewayId }),
    ])();

  const disassociateAddress = ({ NatGatewayId }) =>
    pipe([
      () => getById({ id: NatGatewayId }),
      get("NatGatewayAddresses"),
      map(
        pipe([
          ({ AllocationId }) => {
            () =>
              ec2().describeAddresses({
                Filters: [
                  {
                    Name: "allocation-id",
                    Values: [AllocationId],
                  },
                ],
              });
          },
          get("Addresses"),
          first,
          tap((Address) => {
            logger.debug(`disassociateAddress ${tos({ Address })}`);
          }),
          tap.if(not(isEmpty), ({ AssociationId }) =>
            ec2().disassociateAddress({
              AssociationId,
            })
          ),
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNatGateway-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy nat ${tos({ name, id })}`);
      }),
      () => disassociateAddress({ NatGatewayId: id }),
      () => ec2().deleteNatGateway({ NatGatewayId: id }),
      tap(() =>
        retryCall({
          name: `destroy nat gateway isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id, name }),
          config,
        })
      ),
      tap(() => {
        logger.debug(`destroyed nat ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      TagSpecifications: [
        {
          ResourceType: "natgateway",
          Tags: buildTags({ config, name }),
        },
      ],
    })(properties);

  return {
    type: "NatGateway",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
