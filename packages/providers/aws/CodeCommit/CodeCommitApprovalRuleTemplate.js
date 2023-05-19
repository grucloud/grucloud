const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ approvalRuleTemplateName }) => {
    assert(approvalRuleTemplateName);
  }),
  pick(["approvalRuleTemplateName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      approvalRuleTemplateContent: pipe([
        get("approvalRuleTemplateContent"),
        JSON.parse,
      ]),
    }),
  ]);

const filterPayload = pipe([
  assign({
    approvalRuleTemplateContent: pipe([
      get("approvalRuleTemplateContent"),
      JSON.stringify,
    ]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html
exports.CodeCommitApprovalRuleTemplate = () => ({
  type: "ApprovalRuleTemplate",
  package: "codecommit",
  client: "CodeCommit",
  propertiesDefault: {},
  omitProperties: [
    "approvalRuleTemplateId",
    "ruleContentSha256",
    "lastModifiedDate",
    "creationDate",
    "lastModifiedUser",
  ],
  inferName: () =>
    pipe([
      get("approvalRuleTemplateName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("approvalRuleTemplateName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("approvalRuleTemplateName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ApprovalRuleTemplateDoesNotExistException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#getApprovalRuleTemplate-property
  getById: {
    method: "getApprovalRuleTemplate",
    getField: "approvalRuleTemplate",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#listApprovalRuleTemplates-property
  getList: {
    method: "listApprovalRuleTemplates",
    getParam: "approvalRuleTemplateNames",
    decorate: ({ getById }) =>
      pipe([
        (approvalRuleTemplateName) => ({ approvalRuleTemplateName }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#createApprovalRuleTemplate-property
  create: {
    filterPayload,
    method: "createApprovalRuleTemplate",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#updateApprovalRuleTemplate-property
  update: {
    method: "updateApprovalRuleTemplate",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        filterPayload,
        ({ approvalRuleTemplateContent, ...other }) => ({
          newRuleContent: approvalRuleTemplateContent,
          ...other,
        }),
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#deleteApprovalRuleTemplate-property
  destroy: {
    method: "deleteApprovalRuleTemplate",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
