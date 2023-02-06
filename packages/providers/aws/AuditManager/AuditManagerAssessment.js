const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, fork } = require("rubico");
const { defaultsDeep, flatten, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./AuditManagerCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  pick(["assessmentId"]),
  tap(({ assessmentId }) => {
    assert(assessmentId);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ metadata, ...other }) => ({ ...other, ...metadata }),
    ({ framework, ...other }) => ({ frameworkId: framework.id, ...other }),
    ({ id, ...other }) => ({ assessmentId: id, ...other }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerAssessment = () => ({
  type: "Assessment",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "awsAccount",
    "id",
    "status",
    "scope",
    "delegations",
    "frameworkId",
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
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        roles: pipe([
          get("roles"),
          map(
            assign({
              roleArn: pipe([
                get("roleArn"),
                replaceWithName({
                  groupType: "IAM::Role",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    assesmentFramework: {
      type: "AssesmentFramework",
      group: "AuditManager",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("frameworkId"),
          tap((frameworkId) => {
            assert(frameworkId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getAssessment-property
  getById: {
    method: "getAssessment",
    getField: "assessment",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listAssessments-property
  getList: {
    enhanceParams: () => () => ({ status: "ACTIVE" }),
    method: "listAssessments",
    getParam: "assessmentMetadata",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#createAssessment-property
  create: {
    method: "createAssessment",
    pickCreated: ({ payload }) => pipe([get("framework")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateAssessment-property
  update: {
    method: "updateAssessment",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deleteAssessment-property
  destroy: {
    method: "deleteAssessment",
    pickId,
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
    dependencies: { assesmentFramework },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(assesmentFramework);
      }),
      () => otherProps,
      defaultsDeep({
        frameworkId: getField(assesmentFramework, "id"),
        tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
