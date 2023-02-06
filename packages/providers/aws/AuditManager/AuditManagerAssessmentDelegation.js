const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, first, find, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./AuditManagerCommon");

const toAssessmentDelegationId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id, ...other }) => ({
    delegationId: id,
    ...other,
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toAssessmentDelegationId,
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerAssessmentDelegation = () => ({
  type: "AssessmentDelegation",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: [
    "delegationId",
    "status",
    "creationTime",
    "assessmentId",
    "assessmentName",
    "roleArn",
    "controlSetName",
  ],
  inferName:
    ({ dependenciesSpec: { assessment, control } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(assessment);
          assert(control);
        }),
        () => `${assessment}::${control}`,
      ])(),
  findName:
    () =>
    ({ assessmentName, controlSetName }) =>
      pipe([
        tap((params) => {
          assert(assessmentName);
          assert(controlSetName);
        }),
        () => `${assessmentName}::${controlSetName}`,
      ]),
  findId: () =>
    pipe([
      get("delegationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    assessment: {
      type: "Assessment",
      group: "AuditManager",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("assessmentId"),
          tap((assessmentId) => {
            assert(assessmentId);
          }),
        ]),
    },
    control: {
      type: "Control",
      group: "AuditManager",
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("controlSetName"),
          tap((controlSetName) => {
            assert(controlSetName);
          }),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("roleArn"),
          tap((roleArn) => {
            assert(roleArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getAssessmentDelegation-property
  getById: {
    method: "getDelegations",
    pickId: () => ({}),
    decorate: ({ endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live.requestId);
        }),
        get("delegations"),
        find(eq(get("id"), live.requestId)),
        unless(isEmpty, decorate({ endpoint, live })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listAssessmentDelegations-property
  getList: {
    method: "getDelegations",
    getParam: "delegations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#createAssessment-property
  create: {
    filterPayload: pipe([
      ({ assessmentId, ...payload }) => ({
        createDelegationRequests: [payload],
      }),
    ]),
    method: "batchCreateDelegationByAssessment",
    pickCreated: ({ payload }) => pipe([get("delegations"), first]),
    // status COMPLETE  FAILED
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#batchDeleteDelegationByAssessment-property
  destroy: {
    method: "batchDeleteDelegationByAssessment",
    pickId: ({ assessmentId, delegationId }) =>
      pipe([
        tap((params) => {
          assert(assessmentId);
          assert(delegationId);
        }),
        () => ({
          assessmentId,
          delegationIds: [delegationId],
        }),
      ])(),
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { assessment, control, iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(assessment);
        assert(control);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        assessmentId: getField(assessment, "assessmentId"),
        controlSetId: getField(control, "Id"),
        roleArn: getField(iamRole, "Arn"),
      }),
    ])(),
});
