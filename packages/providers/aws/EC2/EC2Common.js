const assert = require("assert");
const { map, tap, pipe, get } = require("rubico");
const { pluck } = require("rubico/x");
const { createEndpoint } = require("../AwsCommon");

exports.createEC2 = createEndpoint("ec2", "EC2");

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
  ({ endpoint }) =>
  ({ id }) =>
    pipe([(Tags) => ({ Resources: [id], Tags }), endpoint().createTags]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTags-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      map((Key) => ({ Key })),
      (Tags) => ({ Resources: [id], Tags }),
      endpoint().deleteTags,
    ]);
