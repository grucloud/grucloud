const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  pick(["assessmentId", "assessmentReportId"]),
  tap(({ assessmentId, assessmentReportId }) => {
    assert(assessmentId);
    assert(assessmentReportId);
  }),
]);

const toAssessmentReportId = ({ id, ...other }) => ({
  assessmentReportId: id,
  ...other,
});

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toAssessmentReportId,
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerAssessmentReport = () => ({
  type: "AssessmentReport",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "awsAccount",
    "assessmentReportId",
    "status",
    "creationTime",
    "assessmentId",
    "assessmentName",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("assessmentReportId"),
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
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getAssessmentReport-property
  getById: {
    method: "getAssessmentReportUrl",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listAssessmentReports-property
  getList: {
    method: "listAssessmentReports",
    getParam: "assessmentReports",
    decorate,
    //decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#createAssessment-property
  create: {
    method: "createAssessmentReport",
    pickCreated: ({ payload }) => pipe([get("assessmentReport")]),
    // status COMPLETE  FAILED
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateAssessmentReport-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deleteAssessment-property
  destroy: {
    method: "deleteAssessmentReport",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { assessment },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(assessment);
      }),
      () => otherProps,
      defaultsDeep({
        assessmentId: getField(assessment, "assessmentId"),
      }),
    ])(),
});
