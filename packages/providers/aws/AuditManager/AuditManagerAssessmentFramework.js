const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, fork } = require("rubico");
const { defaultsDeep, flatten, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./AuditManagerCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id, ...other }) => ({ ...other, frameworkId: id }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      controlSets: pipe([
        get("controlSets"),
        map(
          assign({
            controls: pipe([get("controls"), map(pick(["name", "id"]))]),
          })
        ),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerAssessmentFramework = () => ({
  type: "AssessmentFramework",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "id",
    "createdAt",
    "lastUpdatedAt",
    "createdBy",
    "lastUpdatedBy",
    "type",
    "controlSources",
    "controlSets[].id",
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
        controlSets: pipe([
          get("controlSets"),
          tap((params) => {
            assert(true);
          }),
          map(
            assign({
              controls: pipe([
                get("controls"),
                map(
                  fork({
                    name: get("name"),
                    id: pipe([
                      tap((params) => {
                        assert(true);
                      }),
                      get("id"),
                      replaceWithName({
                        groupType: "AuditManager::Control",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    auditManagerAccount: {
      type: "AccountRegistration",
      group: "AuditManager",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
    controls: {
      type: "Control",
      group: "AuditManager",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("controlSets"),
          tap((params) => {
            assert(true);
          }),
          pluck("controls"),
          tap((params) => {
            assert(true);
          }),
          flatten,
          pluck("id"),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getAssessmentFramework-property
  getById: {
    method: "getAssessmentFramework",
    getField: "framework",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listAssessmentFrameworks-property
  getList: {
    enhanceParams: () => () => ({ frameworkType: "Custom" }),
    method: "listAssessmentFrameworks",
    getParam: "frameworkMetadataList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#createAssessmentFramework-property
  create: {
    method: "createAssessmentFramework",
    pickCreated: ({ payload }) => pipe([get("framework")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateAssessmentFramework-property
  update: {
    method: "updateAssessmentFramework",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deleteAssessmentFramework-property
  destroy: {
    method: "deleteAssessmentFramework",
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
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
