const assert = require("assert");
const { get, pipe, tap, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByIdCore, buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { findNameInTagsOrId, findNamespaceInTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

exports.AwsElasticIpAddress = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId = get("live.AllocationId");
  const pickId = pick(["AllocationId"]);

  const findName = findNameInTagsOrId({ findId });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property
  const getList = client.getList({
    method: "describeAddresses",
    getParam: "Addresses",
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
    ({ AllocationId }) => ({ id: AllocationId }),
    getByIdCore({ fieldIds: "AllocationIds", getList }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#allocateAddress-property
  const create = client.create({
    method: "allocateAddress",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#releaseAddress-property
  const destroy = client.destroy({
    pickId,
    method: "releaseAddress",
    getById,
    ignoreErrorCodes: ["InvalidAllocationID.NotFound"],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
  }) =>
    pipe([
      () => ({}),
      defaultsDeep(otherProps),
      defaultsDeep({
        Domain: "vpc",
        TagSpecifications: [
          {
            ResourceType: "elastic-ip",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    getList,
    create,
    destroy,
    configDefault,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
