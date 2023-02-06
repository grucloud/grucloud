const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, find, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./AuditManagerCommon");

const pickId = pipe([
  tap(({ requestId }) => {
    assert(requestId);
  }),
]);

const toRequestId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id, ...other }) => ({ ...other, requestId: id }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ id }) => {
      assert(id);
    }),
    toRequestId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerAssessmentFrameworkShare = () => ({
  type: "AssessmentFrameworkShare",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: [
    "requestId",
    "expirationTime",
    "creationTime",
    "lastUpdated",
    "standardControlsCount",
    "customControlsCount",
    "sourceAccount",
    "frameworkName",
    "frameworkDescription",
    "status",
    "complianceType",
  ],
  inferName:
    ({ dependenciesSpec: { assesmentFramework, accountDestination } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(assesmentFramework);
          assert(accountDestination);
        }),
        () => `${assesmentFramework}::${accountDestination}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          assesmentFramework: pipe([
            get("frameworkId"),
            tap((frameworkId) => {
              assert(frameworkId);
            }),
            lives.getById({
              type: "AssesmentFramework",
              group: "AuditManager",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          accountDestination: pipe([
            get("destinationAccount"),
            tap((params) => {
              assert(destinationAccount);
            }),
            lives.getById({
              type: "Account",
              group: "Organisations",
              providerName: config.providerName,
            }),
            get("name", live.destinationAccount),
          ]),
        }),
        ({ assesmentFramework, accountDestination }) =>
          `${assesmentFramework}::${accountDestination}`,
      ])(),
  findId: () =>
    pipe([
      get("requestId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) => pipe([assign({})]),
  ignoreErrorCodes,
  dependencies: {
    assesmentFramework: {
      type: "AssesmentFramework",
      group: "AuditManager",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("frameworkId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    accountDestination: {
      type: "Account",
      group: "Organisations",
      dependencyId: ({ lives, config }) => get("destinationAccount"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getAssessmentFrameworkShare-property
  getById: {
    method: "listAssessmentFrameworkShareRequests",
    getField: "framework",
    pickId: () => ({ requestType: "RECEIVED" }),
    decorate: ({ endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live.requestId);
        }),
        get("assessmentFrameworkShareRequests"),
        find(eq(get("id"), live.requestId)),
        unless(isEmpty, decorate({ endpoint, live })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listAssessmentFrameworkShares-property
  getList: {
    enhanceParams: () => () => ({ requestType: "RECEIVED" }),
    method: "listAssessmentFrameworkShareRequests",
    getParam: "assessmentFrameworkShareRequests",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#startAssessmentFrameworkShare-property
  create: {
    method: "startAssessmentFrameworkShare",
    pickCreated: ({ payload }) => pipe([get("framework"), toRequestId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deleteAssessmentFrameworkShare-property
  destroy: {
    method: "deleteAssessmentFrameworkShare",
    pickId: pipe([pickId, defaultsDeep({ requestType: "RECEIVED" })]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { accountDestination, framework },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(framework);
      }),
      () => otherProps,
      defaultsDeep({
        frameworkId: getField(framework, "id"),
      }),
      when(
        () => accountDestination,
        defaultsDeep({
          destinationAccount: getField(accountDestination, "Id"),
        })
      ),
    ])(),
});
