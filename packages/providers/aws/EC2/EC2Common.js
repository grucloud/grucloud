const assert = require("assert");
const { map, tap, pipe, get } = require("rubico");
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTags-property
exports.tagResource =
  ({ ec2 }) =>
  ({ id }) =>
    pipe([(Tags) => ({ Resources: [id], Tags }), ec2().createTags]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTags-property
exports.untagResource =
  ({ ec2 }) =>
  ({ id }) =>
    pipe([
      map((Key) => ({ Key })),
      (Tags) => ({ Resources: [id], Tags }),
      ec2().deleteTags,
    ]);
