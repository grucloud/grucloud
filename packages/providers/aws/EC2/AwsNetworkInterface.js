const assert = require("assert");
const { get, pipe, tap } = require("rubico");
const { isEmpty, first, unless, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "AwsNetworkInterface",
});
const { findNameInTagsOrId } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

const { AwsSecurityGroup } = require("./AwsSecurityGroup");
exports.AwsNetworkInterface = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);
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
      unless(
        isEmpty,
        pipe([
          tap(({ live }) => {
            assert(live);
          }),
          ({ live }) => awsSecurityGroup.findNamespace({ live, lives }),
        ])
      ),
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

  const getList = client.getList({
    method: "describeNetworkInterfaces",
    getParam: "NetworkInterfaces",
  });

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
    tagResource: tagResource({ ec2 }),
    untagResource: untagResource({ ec2 }),
  };
};
