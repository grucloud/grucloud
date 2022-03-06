const { pipe, get } = require("rubico");
const { pluck } = require("rubico/x");
const { EC2 } = require("@aws-sdk/client-ec2");
const { createEndpoint } = require("../AwsCommon");

exports.createEC2 = createEndpoint(EC2);

exports.findDependenciesVpc = ({ live }) => ({
  type: "Vpc",
  group: "EC2",
  ids: [live.VpcId],
});

exports.findDependenciesSubnet = ({ live }) => ({
  type: "Subnet",
  group: "EC2",
  ids: pipe([() => live, get("Associations"), pluck("SubnetId")])(),
});
