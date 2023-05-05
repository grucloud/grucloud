const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("VerifiedAccessTrustProviderId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VerifiedAccessTrustProvider = () => ({
  type: "VerifiedAccessTrustProvider",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "VerifiedAccessTrustProviderId",
    "VerifiedAccessTrustProviderId",
    "Owner",
    "VerifiedAccessTrustProviderArn",
    "CreationTime",
    "LastUpdatedTime",
    "DeletionTime",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["InvalidVerifiedAccessTrustProviderId.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessTrustProviders-property
  getById: {
    method: "describeVerifiedAccessTrustProviders",
    getField: "VerifiedAccessTrustProviders",
    pickId: pipe([
      tap(({ VerifiedAccessTrustProviderId }) => {
        assert(VerifiedAccessTrustProviderId);
      }),
      ({ VerifiedAccessTrustProviderId }) => ({
        VerifiedAccessTrustProviderIds: [VerifiedAccessTrustProviderId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessTrustProviders-property
  getList: {
    method: "describeVerifiedAccessTrustProviders",
    getParam: "VerifiedAccessTrustProviders",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVerifiedAccessTrustProvider-property
  create: {
    method: "createVerifiedAccessTrustProvider",
    pickCreated: ({ payload }) => pipe([get("VerifiedAccessTrustProvider")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVerifiedAccessTrustProvider-property
  destroy: {
    method: "deleteVerifiedAccessTrustProvider",
    pickId: pipe([pick(["VerifiedAccessTrustProviderId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "verified-access-trust-provider",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
