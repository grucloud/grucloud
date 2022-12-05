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
const { defaultsDeep, identity, pluck, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./GuardDutyCommon");

const defaultName = "detector";

const ignoreErrorMessages = [
  "The request is rejected because the input detectorId is not owned by the current account",
];

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),

  tap(({ DetectorId }) => {
    assert(DetectorId);
  }),
  pick(["DetectorId"]),
]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
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
  tap((params) => {
    assert(true);
  }),
  switchCase([
    eq(get("Status"), "ENABLED"),
    () => ({ Enable: true }),
    () => ({ Enable: false }),
  ]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    defaultsDeep(live),
    assignArn({ config }),
    assign({
      DataSources: pipe([
        get("DataSources"),
        assign({
          CloudTrail: pipe([get("CloudTrail"), statusToEnable]),
          DNSLogs: pipe([get("DNSLogs"), statusToEnable]),
          FlowLogs: pipe([get("FlowLogs"), statusToEnable]),
          Kubernetes: pipe([
            get("Kubernetes"),
            assign({
              AuditLogs: pipe([get("AuditLogs"), statusToEnable]),
            }),
          ]),
          MalwareProtection: pipe([
            get("MalwareProtection"),
            assign({
              ScanEc2InstanceWithFindings: pipe([
                get("ScanEc2InstanceWithFindings"),
                assign({
                  EbsVolumes: pipe([
                    get("EbsVolumes"),
                    switchCase([
                      eq(get("Status"), "ENABLED"),
                      () => true,
                      () => false,
                    ]),
                  ]),
                }),
              ]),
            }),
            omit(["ServiceRole"]),
          ]),
          S3Logs: pipe([get("S3Logs"), statusToEnable]),
        }),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyDetector = () => ({
  type: "Detector",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: [
    "DetectorId",
    "CreatedAt",
    "ServiceRole",
    "UpdatedAt",
    "Arn",
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
      tap((params) => {
        assert(true);
      }),
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
          tap((params) => {
            assert(true);
          }),
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
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteDetector-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        endpoint().listInvitations,
        get("Invitations"),
        pluck("AccountId"),
        tap((params) => {
          assert(true);
        }),
        unless(
          isEmpty,
          pipe([(AccountIds) => ({ AccountIds }), endpoint().deleteInvitations])
        ),
      ]),
    method: "deleteDetector",
    pickId,
    ignoreErrorMessages,
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
