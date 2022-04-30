const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createEC2,
  tagResource,
  untagResource,
  findDependenciesVpc,
} = require("./EC2Common");

const findId = get("live.PrefixListId");
const findName = get("live.PrefixListName");
const ignoreErrorCodes = ["InvalidPrefixListID.NotFound"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ManagedPrefixList = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findDependencies = ({ live, lives, config }) => [
    findDependenciesVpc({ live }),
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeManagedPrefixLists-property
  const getList = client.getList({
    method: "describeManagedPrefixLists",
    getParam: "PrefixLists",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeManagedPrefixLists-property
  const getById = client.getById({
    pickId: pipe([
      tap(({ PrefixListId }) => {
        assert(PrefixListId);
      }),
      ({ PrefixListId }) => ({ PrefixListIds: [PrefixListId] }),
    ]),
    method: "describeManagedPrefixLists",
    getField: "PrefixLists",
    ignoreErrorCodes,
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createManagedPrefixList-property
  const create = client.create({
    method: "createManagedPrefixList",
    pickCreated: () => pipe([get("ManagedPrefixList")]),
    isInstanceUp: eq(get("State"), "create-complete"),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyManagedPrefixList-property
  const update = client.update({
    method: "modifyManagedPrefixList",
    getById,
  });

  // TODO isInstanceDown ?
  // State "delete-complete"
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteManagedPrefixList-property
  const destroy = client.destroy({
    pickId: pick(["PrefixListId"]),
    method: "deleteManagedPrefixList",
    getById,
    ignoreErrorCodes,
    ignoreErrorMessages: [
      "The action is not supported for an AWS-managed prefix list",
    ],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        PrefixListName: name,
        TagSpecifications: [
          {
            ResourceType: "prefix-list",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])();

  const cannotBeDeleted = eq(get("live.OwnerId"), "AWS");

  return {
    spec,
    findId,
    findDependencies,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    managedByOther: cannotBeDeleted,
    cannotBeDeleted: cannotBeDeleted,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
  };
};
