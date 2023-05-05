const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("VerifiedAccessInstanceId"),
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

const attachVerifiedAccessTrustProvider = ({ endpoint, live }) =>
  pipe([
    tap(({ VerifiedAccessTrustProviderId }) => {
      assert(VerifiedAccessTrustProviderId);
      assert(live.VerifiedAccessInstanceId);
    }),
    pick(["VerifiedAccessTrustProviderId"]),
    defaultsDeep({
      VerifiedAccessInstanceId: live.VerifiedAccessInstanceId,
    }),
    endpoint().attachVerifiedAccessTrustProvider,
  ]);

const detachVerifiedAccessTrustProvider = ({ endpoint, live }) =>
  pipe([
    tap(({ VerifiedAccessTrustProviderId }) => {
      assert(VerifiedAccessTrustProviderId);
      assert(live.VerifiedAccessInstanceId);
    }),
    pick(["VerifiedAccessTrustProviderId"]),
    defaultsDeep({
      VerifiedAccessInstanceId: live.VerifiedAccessInstanceId,
    }),
    endpoint().detachVerifiedAccessTrustProvider,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VerifiedAccessInstance = () => ({
  type: "VerifiedAccessInstance",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "VerifiedAccessInstanceId",
    "VerifiedAccessTrustProviders",
    "Owner",
    "VerifiedAccessInstanceArn",
    "CreationTime",
    "LastUpdatedTime",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["InvalidVerifiedAccessInstanceId.NotFound"],
  dependencies: {
    verifiedAccessTrustProviders: {
      type: "VerifiedAccessTrustProvider",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("VerifiedAccessTrustProviders"),
          pluck("VerifiedAccessTrustProviderId"),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessInstances-property
  getById: {
    method: "describeVerifiedAccessInstances",
    getField: "VerifiedAccessInstances",
    pickId: pipe([
      tap(({ VerifiedAccessInstanceId }) => {
        assert(VerifiedAccessInstanceId);
      }),
      ({ VerifiedAccessInstanceId }) => ({
        VerifiedAccessInstanceIds: [VerifiedAccessInstanceId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVerifiedAccessInstances-property
  getList: {
    method: "describeVerifiedAccessInstances",
    getParam: "VerifiedAccessInstances",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVerifiedAccessInstance-property
  create: {
    method: "createVerifiedAccessInstance",
    pickCreated: ({ payload }) => pipe([get("VerifiedAccessInstance")]),
    postCreate:
      ({
        payload,
        endpoint,
        resolvedDependencies: { verifiedAccessTrustProviders },
      }) =>
      (live) =>
        pipe([
          () => verifiedAccessTrustProviders,
          map(
            pipe([
              get("live"),
              attachVerifiedAccessTrustProvider({ endpoint, live }),
            ])
          ),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "VerifiedAccessTrustProviders",
          onAdd: attachVerifiedAccessTrustProvider,
          onRemove: detachVerifiedAccessTrustProvider,
        }),
      ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVerifiedAccessInstance-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap((live) =>
        pipe([
          () => live,
          get("VerifiedAccessTrustProviders"),
          map(pipe([detachVerifiedAccessTrustProvider({ endpoint, live })])),
        ])()
      ),
    method: "deleteVerifiedAccessInstance",
    pickId: pipe([
      pick(["VerifiedAccessInstanceId"]),
      tap(({ VerifiedAccessInstanceId }) => {
        assert(VerifiedAccessInstanceId);
      }),
    ]),
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
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "verified-access-instance",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
