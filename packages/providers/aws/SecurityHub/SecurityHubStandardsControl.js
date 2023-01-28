const assert = require("assert");
const { pipe, tap, get, assign, pick, eq } = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ StandardsSubscriptionArn }) => {
    assert(StandardsSubscriptionArn);
  }),
  pick(["StandardsSubscriptionArn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const managedByOther = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    eq(get("ControlStatus"), "ENABLED"),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubStandardsControl = () => ({
  type: "StandardsControl",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: [
    "StandardsStatus",
    "ControlStatusUpdatedAt",
    "ControlId",
    "RemediationUrl",
    "StandardsSubscriptionArn",
    "SeverityRating",
    "Title",
    "Description",
    "RelatedRequirements",
  ],
  managedByOther,
  inferName: () =>
    pipe([
      get("StandardsControlArn"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("StandardsControlArn"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StandardsControlArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted: () => () => true,
  dependencies: {
    standardsSubscription: {
      type: "StandardsSubscription",
      group: "SecurityHub",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("StandardsSubscriptionArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  ignoreErrorCodes,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        StandardsControlArn: pipe([
          get("StandardsControlArn"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#describeStandardsControls-property
  getById: {
    method: "describeStandardsControls",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live);
          assert(live.StandardsControlArn);
        }),
        get("Controls"),
        find(eq(get("StandardsControlArn"), live.StandardsControlArn)),
      ]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "StandardsSubscription", group: "SecurityHub" },
          pickKey: pipe([
            pick(["StandardsSubscriptionArn"]),
            tap(({ StandardsSubscriptionArn }) => {
              assert(StandardsSubscriptionArn);
            }),
          ]),
          method: "describeStandardsControls",
          getParam: "Controls",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent);
              }),
              defaultsDeep({
                StandardsSubscriptionArn: parent.StandardsSubscriptionArn,
              }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateStandardsControl-property
  create: {
    method: "updateStandardsControl",
    pickCreated: ({ payload }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(true);
        }),
      ]),
    isInstanceUp: pipe([() => true]),
    shouldRetryOnExceptionCodes: ["ResourceNotFoundException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateStandardsControls-property
  update: {
    method: "updateStandardsControl",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        //
        () => payload,
        defaultsDeep(pickId(live)),
      ])(),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { standardsSubscription },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(standardsSubscription);
      }),
      () => otherProps,
      defaultsDeep({
        StandardsSubscriptionArn: getField(
          standardsSubscription,
          "StandardsSubscriptionArn"
        ),
      }),
    ])(),
});
