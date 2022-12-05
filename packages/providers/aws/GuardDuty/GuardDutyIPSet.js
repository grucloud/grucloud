const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./GuardDutyCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ DetectorId, IpSetId }) => {
    assert(DetectorId);
    assert(IpSetId);
  }),
  pick(["DetectorId", "IpSetId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const ignoreErrorMessages = [];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyIPSet = () => ({
  type: "IPSet",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: ["DetectorId", "IpSetId"],
  inferName:
    ({ dependenciesSpec: { detector } }) =>
    ({ Name }) =>
      pipe([
        tap((params) => {
          assert(detector);
        }),
        () => `${detector}::${Name}`,
      ])(),
  findName: () => (live) =>
    pipe([
      () => live,
      get("DetectorId"),
      tap((id) => {
        assert(id);
      }),
      lives.getById({
        type: "Detector",
        group: "GuardDuty",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#getIPSet-property
  getById: {
    method: "getIPSet",
    pickId,
    decorate,
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
          decorate: () => pipe([(IpSetId) => ({ IpSetId }), getById]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createIPSets-property
  create: {
    method: "createIPSet",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteIPSet-property
  destroy: {
    method: "deleteIPSet",
    pickId,
    ignoreErrorMessages,
  },
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
