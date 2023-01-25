const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("GroupId"),
    tap((GroupId) => {
      assert(GroupId);
    }),
  ]);

const pickId = pipe([
  tap(({ GroupName }) => {
    assert(GroupName);
  }),
  pick(["GroupName"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkPlacementGroup.html
exports.EC2PlacementGroup = ({ compare }) => ({
  type: "PlacementGroup",
  package: "ec2",
  client: "EC2",
  inferName: () => pipe([get("GroupName")]),
  findName: () => get("GroupName"),
  findId,
  omitProperties: ["State", "GroupId", "GroupArn", "PartitionCount"],
  ignoreErrorCodes: ["InvalidPlacementGroup.Unknown"],
  dependencies: {},

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describePlacementGroups-property
  getById: {
    pickId: pipe([
      tap(({ GroupName }) => {
        assert(GroupName);
      }),
      ({ GroupName }) => ({ GroupNames: [GroupName] }),
    ]),
    method: "describePlacementGroups",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describePlacementGroups-property
  getList: {
    method: "describePlacementGroups",
    getParam: "PlacementGroups",
    decorate: ({ endpoint, getById }) => pipe([assign({})]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createPlacementGroup-property
  create: {
    method: "createPlacementGroup",
    pickCreated: ({ payload }) => pipe([get("PlacementGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deletePlacementGroup-property
  destroy: {
    method: "deletePlacementGroup",
    pickId,
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "placement-group",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
