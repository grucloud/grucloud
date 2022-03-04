const { get, pipe, tap } = require("rubico");
const { findDependenciesVpc, findDependenciesSubnet } = require("./EC2Common");

const { findNameInTagsOrId } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

exports.AwsNetworkAcl = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId = get("live.NetworkAclId");
  const findName = findNameInTagsOrId({ findId });
  const isDefault = get("live.IsDefault");

  // findDependencies for NetworkAcl
  const findDependencies = ({ live }) => [
    findDependenciesVpc({ live }),
    findDependenciesSubnet({ live }),
  ];

  const getList = client.getList({
    method: "describeNetworkAcls",
    getParam: "NetworkAcls",
  });

  return {
    spec,
    findId,
    isDefault,
    findName,
    findDependencies,
    getList,
  };
};
