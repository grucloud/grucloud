const assert = require("assert");
const { pipe, tap, get, pick, not, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("VerifiedAccessGroupId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const managedByOther = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    not(eq(get("Owner"), config.accountId())),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VerifiedAccessGroup = () => ({
  type: "VerifiedAccessGroup",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "VerifiedAccessInstanceId",
    "VerifiedAccessGroupId",
    "Owner",
    "VerifiedAccessGroupArn",
    "CreationTime",
    "LastUpdatedTime",
    "DeletionTime",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["InvalidVerifiedAccessGroupId.NotFound"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    verifiedAccessInstance: {
      type: "VerifiedAccessInstance",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("VerifiedAccessInstanceId"),
          tap((VerifiedAccessInstanceId) => {
            assert(VerifiedAccessInstanceId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessGroups-property
  getById: {
    method: "describeVerifiedAccessGroups",
    getField: "VerifiedAccessGroups",
    pickId: pipe([
      tap(({ VerifiedAccessGroupId }) => {
        assert(VerifiedAccessGroupId);
      }),
      ({ VerifiedAccessGroupId }) => ({
        VerifiedAccessGroupIds: [VerifiedAccessGroupId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessGroups-property
  getList: {
    method: "describeVerifiedAccessGroups",
    getParam: "VerifiedAccessGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVerifiedAccessGroup-property
  create: {
    method: "createVerifiedAccessGroup",
    pickCreated: ({ payload }) => pipe([get("VerifiedAccessGroup")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVerifiedAccessGroup-property
  destroy: {
    method: "deleteVerifiedAccessGroup",
    pickId: pipe([pick(["VerifiedAccessGroupId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { verifiedAccessInstance },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(verifiedAccessInstance);
      }),
      () => otherProps,
      defaultsDeep({
        VerifiedAccessInstanceId: getField(
          verifiedAccessInstance,
          "VerifiedAccessInstanceId"
        ),
        TagSpecifications: [
          {
            ResourceType: "verified-access-group",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
