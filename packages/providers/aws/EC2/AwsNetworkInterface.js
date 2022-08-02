const assert = require("assert");
const { get, pipe, tap, pick, switchCase } = require("rubico");
const { isEmpty, first, unless, pluck, prepend } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "EC2NetworkInterface",
});

const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

const { AwsSecurityGroup } = require("./AwsSecurityGroup");

exports.EC2NetworkInterface = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);
  const awsSecurityGroup = AwsSecurityGroup({ config, spec });
  const findId = get("live.NetworkInterfaceId");
  const pickId = pick(["NetworkInterfaceId"]);

  const findName = ({ live, lives }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => live,
      get("Attachment.InstanceId"),
      (id) =>
        lives.getById({
          providerName: config.providerName,
          type: "Instance",
          group: "EC2",
          id,
        }),
      get("name"),
      switchCase([isEmpty, () => live.NetworkInterfaceId, prepend("eni::")]),
    ])();

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

  // const findDependencies = ({ live, lives }) => [
  //   {
  //     type: "SecurityGroup",
  //     group: "EC2",
  //     ids: pipe([() => live, get("Groups"), pluck("GroupId")])(),
  //   },
  //   {
  //     type: "Vpc",
  //     group: "EC2",
  //     ids: [live.VpcId],
  //   },
  //   {
  //     type: "Subnet",
  //     group: "EC2",
  //     ids: [live.SubnetId],
  //   },
  //   {
  //     type: "Instance",
  //     group: "EC2",
  //     ids: [
  //       pipe([
  //         () => live,
  //         get("Attachment.InstanceId"),
  //         (id) =>
  //           lives.getById({
  //             providerName: config.providerName,
  //             type: "Instance",
  //             group: "EC2",
  //             id,
  //           }),
  //         get("id"),
  //         tap((params) => {
  //           assert(true);
  //         }),
  //       ])(),
  //     ],
  //   },
  // ];

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
    cannotBeDeleted: () => true,
    findNamespace,
    findId,
    findName,
    getList,
    destroy,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
