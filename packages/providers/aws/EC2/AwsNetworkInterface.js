const assert = require("assert");
const { get, pipe, filter, map, tap, switchCase } = require("rubico");
const { isEmpty, first, identity, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "AwsNetworkInterface",
});
const { Ec2New, findNameInTagsOrId } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const { AwsSecurityGroup } = require("./AwsSecurityGroup");
exports.AwsNetworkInterface = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);
  const awsSecurityGroup = AwsSecurityGroup({ config, spec });
  const findId = get("live.NetworkInterfaceId");
  const pickId = pick(["NetworkInterfaceId"]);

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
          group: "EC2",
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
      group: "EC2",
      ids: pipe([() => live, get("Groups"), pluck("GroupId")])(),
    },
    {
      type: "Vpc",
      group: "EC2",
      ids: [live.VpcId],
    },
    {
      type: "Subnet",
      group: "EC2",
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
    ])();

  const destroy = client.destroy({
    pickId,
    method: "deleteNetworkInterface",
    //getById,
    ignoreErrorCodes: ["InvalidNetworkInterfaceID.NotFound"],
    config,
  });

  return {
    spec,
    managedByOther: () => true,
    findDependencies,
    findNamespace,
    findId,
    findName,
    getList,
    destroy,
  };
};
