const {
  get,
  pipe,
  filter,
  map,
  tap,
  eq,
  switchCase,
  not,
  tryCatch,
} = require("rubico");
const { defaultsDeep, isEmpty, first, identity, pluck } = require("rubico/x");
const assert = require("assert");

const logger = require("@grucloud/core/logger")({
  prefix: "AwsNetworkInterface",
});
const { tos } = require("@grucloud/core/tos");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");

const { AwsSecurityGroup } = require("./AwsSecurityGroup");
exports.AwsNetworkInterface = ({ spec, config }) => {
  const ec2 = Ec2New(config);
  const awsSecurityGroup = AwsSecurityGroup({ config, spec });
  const findId = get("live.NetworkInterfaceId");

  const findName = findNameInTagsOrId({ findId });
  const findNamespace = ({ live, lives }) =>
    pipe([
      () => live,
      get("Groups"),
      first,
      get("GroupId"),
      (GroupId) =>
        lives.getById({
          providerName: config.providerName,
          type: "SecurityGroup",
          id: GroupId,
        }),
      switchCase([
        isEmpty,
        identity,
        ({ live }) => awsSecurityGroup.findNamespace({ live, lives }),
      ]),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  const findDependencies = ({ live }) => [
    {
      type: "SecurityGroup",
      ids: pipe([() => live, get("Groups"), pluck("GroupId")])(),
    },
    {
      type: "Vpc",
      ids: [live.VpcId],
    },
    {
      type: "Subnet",
      ids: [live.SubnetId],
    },
  ];

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList network interfaces ${JSON.stringify(params)}`);
      }),
      () => ec2().describeNetworkInterfaces(params),
      get("NetworkInterfaces"),
      tap((items) => {
        logger.debug(`getList network interfaces result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #network interfaces ${total}`);
      }),
    ])();

  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy network interface`);
      }),
      () => ({ NetworkInterfaceId: findId({ live }) }),
      ({ NetworkInterfaceId }) =>
        pipe([
          tap(() => {}),
          tap(() => {
            logger.debug(`network interface destroyed ${NetworkInterfaceId}`);
          }),
          tryCatch(
            () => ec2().deleteNetworkInterface({ NetworkInterfaceId }),
            switchCase([
              eq(get("code"), "InvalidNetworkInterfaceID.NotFound"),
              () => undefined,
              (error) => {
                logger.error(
                  `deleteNetworkInterface error code: ${error.code}`
                );
                throw error;
              },
            ])
          ),
          tap(() => {
            logger.debug(`network interface destroyed ${NetworkInterfaceId}`);
          }),
        ])(),
    ])();

  return {
    spec,
    findDependencies,
    findNamespace,
    findId,
    findName,
    getList,
    destroy,
    shouldRetryOnException,
  };
};
