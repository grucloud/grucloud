const assert = require("assert");

const { map, tap, pipe, get } = require("rubico");
const { pluck, unless, isEmpty } = require("rubico/x");
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
const tagResource = ({ ec2, diff, id }) =>
  pipe([
    () => diff,
    get("tags.targetTags"),
    (Tags) => ({ Resources: [id], Tags }),
    ec2().createTags,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTags-property
const untagResource = ({ ec2, diff, id }) =>
  pipe([
    () => diff,
    get("tags.removedKeys"),
    unless(
      isEmpty,
      pipe([
        map((Key) => ({ Key })),
        (Tags) => ({ Resources: [id], Tags }),
        ec2().deleteTags,
      ])
    ),
  ]);

exports.updateTags =
  ({ ec2 }) =>
  ({ diff, id }) =>
    pipe([tagResource({ ec2, diff, id }), untagResource({ ec2, diff, id })])();
