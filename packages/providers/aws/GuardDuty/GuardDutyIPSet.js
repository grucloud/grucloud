const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep, append, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const {
  //ignoreErrorCodes,
  ignoreErrorMessages,
  Tagger,
} = require("./GuardDutyCommon");

const pickId = pipe([
  tap(({ DetectorId, IpSetId }) => {
    assert(DetectorId);
    assert(IpSetId);
  }),
  pick(["DetectorId", "IpSetId"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ DetectorId, IpSetId }) => {
          assert(DetectorId);
          assert(IpSetId);
        }),
        ({ DetectorId, IpSetId }) =>
          `arn:aws:guardduty:${
            config.region
          }:${config.accountId()}:detector/${DetectorId}/ipset/${IpSetId}`,
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
exports.GuardDutyIPSet = () => ({
  type: "IPSet",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: ["Arn", "DetectorId", "IpSetId"],
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
  //ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#getIPSet-property
  getById: {
    method: "getIPSet",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listIPSets-property
  getList: {
    method: "listIPSets",
    getParam: "IPSets",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Detector", group: "GuardDuty" },
          pickKey: pipe([pick(["DetectorId"])]),
          method: "listIPSets",
          getParam: "IpSetIds",
          config,
          decorate: ({ parent }) =>
            pipe([
              (IpSetId) => ({ IpSetId, DetectorId: parent.DetectorId }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createIPSet-property
  create: {
    method: "createIPSet",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteIPSet-property
  destroy: {
    method: "deleteIPSet",
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
