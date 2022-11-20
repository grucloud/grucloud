const { get, pipe, tap } = require("rubico");

const { findNameInTagsOrId } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

exports.EC2NetworkAcl = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId = () => get("NetworkAclId");
  const findName = findNameInTagsOrId({ findId });
  const isDefault = () => get("IsDefault");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNetworkAcl-property

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkAcls-property
  const getList = client.getList({
    method: "describeNetworkAcls",
    getParam: "NetworkAcls",
  });

  return {
    spec,
    findId,
    isDefault,
    managedByOther: isDefault,
    findName,
    getList,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
