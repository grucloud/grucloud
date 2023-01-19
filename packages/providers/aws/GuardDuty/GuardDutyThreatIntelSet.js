const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep, append, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const {
  ignoreErrorCodes,
  Tagger,
  ignoreErrorMessages,
} = require("./GuardDutyCommon");

const pickId = pipe([
  tap(({ DetectorId, ThreatIntelSetId }) => {
    assert(DetectorId);
    assert(ThreatIntelSetId);
  }),
  pick(["DetectorId", "ThreatIntelSetId"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ DetectorId, ThreatIntelSetId }) => {
          assert(DetectorId);
          assert(ThreatIntelSetId);
        }),
        ({ DetectorId, ThreatIntelSetId }) =>
          `arn:aws:guardduty:${
            config.region
          }:${config.accountId()}:detector/${DetectorId}/threatintelset/${ThreatIntelSetId}`,
      ]),
    }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyThreatIntelSet = () => ({
  type: "ThreatIntelSet",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: ["Arn", "DetectorId", "ThreatIntelSetId"],
  inferName:
    ({ dependenciesSpec: { detector } }) =>
    ({ Name }) =>
      pipe([
        tap((params) => {
          assert(detector);
          assert(Name);
        }),
        () => `${detector}::${Name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.Name);
        }),
        () => live,
        get("DetectorId"),
        tap((id) => {
          assert(id);
        }),
        lives.getById({
          type: "Detector",
          group: "GuardDuty",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append("::"),
        append(live.Name),
      ])(),
  findId:
    () =>
    ({ DetectorId, Name }) =>
      pipe([() => `${DetectorId}::${Name}`])(),
  dependencies: {
    detector: {
      type: "Detector",
      group: "GuardDuty",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("DetectorId")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#getThreatIntelSet-property
  getById: {
    method: "getThreatIntelSet",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listThreatIntelSets-property
  getList: {
    method: "listThreatIntelSets",
    getParam: "ThreatIntelSets",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Detector", group: "GuardDuty" },
          pickKey: pipe([pick(["DetectorId"])]),
          method: "listThreatIntelSets",
          getParam: "ThreatIntelSetIds",
          config,
          decorate: ({ parent }) =>
            pipe([
              (ThreatIntelSetId) => ({
                ThreatIntelSetId,
                DetectorId: parent.DetectorId,
              }),
              tap((params) => {
                assert(true);
              }),

              getById({}),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createThreatIntelSet-property
  create: {
    method: "createThreatIntelSet",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteThreatIntelSet-property
  destroy: {
    method: "deleteThreatIntelSet",
    pickId,
    ignoreErrorMessages,
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { detector },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(detector);
      }),
      () => otherProps,
      defaultsDeep({
        DetectorId: getField(detector, "DetectorId"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
