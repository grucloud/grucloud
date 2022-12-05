const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./GuardDutyCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ DetectorId, FilterName }) => {
    assert(DetectorId);
    assert(FilterName);
  }),
  pick(["DetectorId", "FilterName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Name, ...other }) => ({ FilterName: Name, ...other }),
  ]);

const ignoreErrorMessages = [];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyFilter = () => ({
  type: "Filter",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: ["DetectorId"],
  inferName:
    ({ dependenciesSpec: { detector } }) =>
    ({ FilterName }) =>
      pipe([
        tap((params) => {
          assert(detector);
        }),
        () => `${detector}::${FilterName}`,
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
      append(live.FilterName),
    ])(),
  findId:
    () =>
    ({ DetectorId, FilterName }) =>
      pipe([() => `${DetectorId}::${FilterName}`])(),
  dependencies: {
    detector: {
      type: "Detector",
      group: "GuardDuty",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("DetectorId")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#getFilter-property
  getById: {
    method: "getFilter",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listFilters-property
  getList: {
    method: "listFilters",
    getParam: "Filters",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Detector", group: "GuardDuty" },
          pickKey: pipe([pick(["DetectorId"])]),
          method: "listFilters",
          getParam: "FilterNames",
          config,
          decorate: () => pipe([(FilterName) => ({ FilterName }), getById]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createFilters-property
  create: {
    // filterPayload: ({ DetectorId, ...payload }) =>
    //   pipe([() => ({ DetectorId, AccountDetails: [payload] })])(),
    method: "createFilter",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteFilter-property
  destroy: {
    method: "deleteFilter",
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
