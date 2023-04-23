const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  switchCase,
  eq,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  identity,
  pluck,
  isEmpty,
  unless,
  filterOut,
  isIn,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorMessages } = require("./GuardDutyCommon");

const defaultName = "detector";

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DetectorId }) => {
    assert(DetectorId);
  }),
  pick(["DetectorId"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ DetectorId }) =>
          `arn:aws:guardduty:${
            config.region
          }:${config.accountId()}:detector/${DetectorId}`,
      ]),
    }),
  ]);

const statusToEnable = pipe([
  switchCase([
    eq(get("Status"), "ENABLED"),
    defaultsDeep({ Enable: true }),
    defaultsDeep({ Enable: false }),
  ]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    defaultsDeep(live),
    statusToEnable,
    omit(["Status"]),
    assignArn({ config }),
    // Remove read only features
    assign({
      Features: pipe([
        get("Features"),
        filterOut(
          pipe([get("Name"), isIn(["CLOUD_TRAIL", "DNS_LOGS", "FLOW_LOGS"])])
        ),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyDetector = () => ({
  type: "Detector",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: { Enable: true },
  omitProperties: [
    "DetectorId",
    "CreatedAt",
    "ServiceRole",
    "UpdatedAt",
    "Arn",
    "DataSources",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DetectorId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // filterLive: ({ lives, providerConfig }) =>
  //   pipe([
  //     assign({
  //       DataSources: pipe([
  //         get("DataSources"),
  //         assign({
  //           MalwareProtection: pipe([
  //             get("MalwareProtection"),
  //             assign({
  //               ServiceRole: pipe([
  //                 get("ServiceRole"),
  //                 replaceAccountAndRegion({ providerConfig, lives }),
  //               ]),
  //             }),
  //           ]),
  //         }),
  //       ]),
  //     }),
  //   ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#getDetector-property
  getById: {
    method: "getDetector",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listDetectors-property
  getList: {
    method: "listDetectors",
    getParam: "DetectorIds",
    decorate:
      ({ getById, index }) =>
      (DetectorId) =>
        pipe([
          () => ({ DetectorId }),
          getById,
          switchCase([
            eq(() => index, 0),
            defaultsDeep({ Name: defaultName }),
            defaultsDeep({ Name: `${defaultName}_${index}` }),
          ]),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createDetector-property
  create: {
    method: "createDetector",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#updateDetector-property
  update: {
    method: "updateDetector",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteDetector-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          endpoint().listInvitations,
          get("Invitations"),
          pluck("AccountId"),
          unless(
            isEmpty,
            pipe([
              (AccountIds) => ({ AccountIds }),
              endpoint().deleteInvitations,
            ])
          ),
        ])
      ),
    method: "deleteDetector",
    pickId,
    ignoreErrorMessages,
    // TODO Retry on "The request is rejected because the current account cannot delete detector while it has invited or associated members"
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
