const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AuditManagerCommon");

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
  ({ id, ...other }) => ({ ...other, controlId: id }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerControl = () => ({
  type: "Control",
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
    "controlMappingSources[].sourceId",
    "type",
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
      get("id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    auditManagerAccount: {
      type: "AccountRegistration",
      group: "AuditManager",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getControl-property
  getById: {
    method: "getControl",
    getField: "control",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listControls-property
  getList: {
    enhanceParams: () => () => ({ controlType: "Custom" }),
    method: "listControls",
    getParam: "controlMetadataList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#createControl-property
  create: {
    method: "createControl",
    pickCreated: ({ payload }) => pipe([get("control")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#updateControl-property
  update: {
    method: "updateControl",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deleteControl-property
  destroy: {
    method: "deleteControl",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
