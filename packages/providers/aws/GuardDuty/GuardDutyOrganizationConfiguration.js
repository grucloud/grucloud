const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./GuardDutyCommon");

const ignoreErrorMessages = [
  "The request is rejected because the input detectorId is not owned by the current account",
];
const cannotBeDeleted = () => () => true;

const pickId = pipe([
  tap(({ DetectorId }) => {
    assert(DetectorId);
  }),
  pick(["DetectorId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyOrganizationConfiguration = () => ({
  type: "OrganizationConfiguration",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: ["DetectorId", "MemberAccountLimitReached"],
  cannotBeDeleted,
  inferName:
    ({ dependenciesSpec: { detector } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(detector);
        }),
        () => detector,
      ])(),
  findName: ({ lives, config }) =>
    pipe([
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
    ]),
  findId: () =>
    pipe([
      get("DetectorId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    detector: {
      type: "Detector",
      group: "GuardDuty",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("DetectorId")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#describeOrganizationConfiguration-property
  getById: {
    method: "describeOrganizationConfiguration",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listOrganizationConfigurations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Detector", group: "GuardDuty" },
          pickKey: pipe([pick(["DetectorId"])]),
          method: "describeOrganizationConfiguration",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent);
                assert(parent.DetectorId);
              }),
              defaultsDeep({ DetectorId: parent.DetectorId }),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#updateOrganizationConfiguration-property
  create: {
    method: "updateOrganizationConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: () => true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#updateOrganizationConfiguration-property
  update: {
    method: "updateOrganizationConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
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
      }),
    ])(),
});
