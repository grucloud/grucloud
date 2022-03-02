const { get, pipe, tap } = require("rubico");
const { findNameInTagsOrId, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

exports.AwsNetworkAcl = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

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
    shouldRetryOnException,
  };
};
