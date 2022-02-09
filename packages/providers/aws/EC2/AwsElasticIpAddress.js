const assert = require("assert");
const { get, pipe, tap, filter, map, not } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEip" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByIdCore, buildTags } = require("../AwsCommon");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  findNameInTagsOrId,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

exports.AwsElasticIpAddress = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

  const findId = get("live.AllocationId");
  const findName = findNameInTagsOrId({ findId });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property

  const findDependencies = ({ live }) => [
    {
      type: "NetworkInterface",
      group: "EC2",
      ids: pipe([
        () => live,
        get("NetworkInterfaceId"),
        (NetworkInterfaceId) => [NetworkInterfaceId],
        filter(not(isEmpty)),
      ])(),
    },
  ];

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList eip ${JSON.stringify(params)}`);
      }),
      () => ec2().describeAddresses(params),
      get("Addresses"),
    ])();
  const getByName = getByNameCore({ getList, findName });
  const getById = getByIdCore({ fieldIds: "AllocationIds", getList });
  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#allocateAddress-property

  const create = ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create elastic ip address ${JSON.stringify({ name })}`);
        logger.debug(`eip payload ${tos({ payload })}`);
      }),
      () => ec2().allocateAddress(payload),
      get("AllocationId"),
      tap((AllocationId) =>
        retryCall({
          name: `eip isUpById: ${name} id: ${AllocationId}`,
          fn: () => isUpById({ id: AllocationId }),
          config,
        })
      ),
      tap(() => {
        logger.info(`created elastic ip address ${JSON.stringify({ name })}`);
      }),
      (AllocationId) => ({ id: AllocationId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#releaseAddress-property
  const destroy = ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(
          `destroy elastic ip address ${JSON.stringify({ name, id })}`
        );
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => ec2().releaseAddress({ AllocationId: id }),
      () =>
        retryCall({
          name: `destroy eip isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        }),
      tap(() => {
        logger.info(
          `destroyed elastic ip address ${JSON.stringify({ name, id })}`
        );
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
  }) =>
    pipe([
      () => ({}),
      defaultsDeep(otherProps),
      defaultsDeep({
        Domain: "vpc",
        TagSpecifications: [
          {
            ResourceType: "elastic-ip",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
