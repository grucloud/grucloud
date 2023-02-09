const assert = require("assert");
const { pipe, tap, get, eq, any, assign, pick, omit } = require("rubico");
const { defaultsDeep, forEach, size, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamGroup" });
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const {
  createIAM,
  assignAttachedPolicies,
  sortPolicies,
  ignoreErrorCodes,
  filterAttachedPolicies,
} = require("./AwsIamCommon");

const findName = () => get("GroupName");
const findId = findName;
const pickId = pick(["GroupName"]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ GroupName }) => {
      assert(GroupName);
    }),
    assign({
      AttachedPolicies: pipe([
        pick(["GroupName"]),
        defaultsDeep({ MaxItems: 1e3 }),
        endpoint().listAttachedGroupPolicies,
        get("AttachedPolicies"),
        sortPolicies,
      ]),
      Policies: pipe([
        pick(["GroupName"]),
        defaultsDeep({ MaxItems: 1e3 }),
        endpoint().listGroupPolicies,
        get("Policies"),
      ]),
    }),
  ]);

const removeGroupFromGroup =
  ({ endpoint }) =>
  ({ GroupName }) =>
    pipe([
      tap((params) => {
        assert(GroupName);
        assert(endpoint);
      }),
      () => ({
        GroupName,
        MaxItems: 1e3,
      }),
      endpoint().getGroup,
      get("Groups"),
      tap((Groups = []) => {
        logger.info(`removeGroupFromGroup #Groups ${size(Groups)}`);
      }),
      forEach(({ GroupName }) =>
        endpoint().removeGroupFromGroup({
          GroupName,
          GroupName,
        })
      ),
    ])();

const attachGroupPolicy = ({ endpoint, name }) =>
  pipe([
    forEach(
      pipe([
        tap(({ PolicyArn }) => {
          assert(PolicyArn);
          assert(name);
          assert(endpoint);
        }),
        pick(["PolicyArn"]),
        defaultsDeep({ GroupName: name }),
        endpoint().attachGroupPolicy,
      ])
    ),
  ]);

const detachGroupPolicy =
  ({ endpoint }) =>
  ({ GroupName }) =>
    pipe([
      tap(() => {
        assert(endpoint);
        assert(GroupName);
      }),
      () => ({ GroupName, MaxItems: 1e3 }),
      endpoint().listAttachedGroupPolicies,
      get("AttachedPolicies"),
      forEach(({ PolicyArn }) => {
        endpoint().detachGroupPolicy({
          PolicyArn,
          GroupName,
        });
      }),
    ])();

exports.IAMGroup = ({}) => ({
  type: "Group",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["GroupId", "Arn", "CreateDate", "Policies"],
  inferName: findName,
  findName,
  findId,
  propertiesDefault: { Path: "/" },
  filterLive: ({ lives }) =>
    pipe([
      pick(["GroupName", "Path", "AttachedPolicies"]),
      filterAttachedPolicies({ lives }),
    ]),
  dependencies: {
    policies: {
      type: "Policy",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AttachedPolicies"), pluck("PolicyArn")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getGroup-property
  getById: {
    pickId,
    method: "getGroup",
    getField: "Group",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroups-property
  getList: {
    method: "listGroups",
    getParam: "Groups",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createGroup-property
  create: {
    method: "createGroup",
    filterPayload: omit(["AttachedPolicies"]),
    pickCreated: () => get("Group"),
    postCreate: ({ endpoint, name, payload }) =>
      pipe([
        () => payload,
        get("AttachedPolicies", []),
        attachGroupPolicy({ endpoint, name }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateMyResource-property
  update:
    ({ endpoint }) =>
    ({ name, diff }) =>
      pipe([() => payload])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroup-property
  destroy: {
    pickId,
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          tap((params) => {
            assert(endpoint);
          }),
          tap(detachGroupPolicy({ endpoint })),
          tap(removeGroupFromGroup({ endpoint })),
        ])
      ),
    method: "deleteGroup",
    ignoreErrorCodes,
    shouldRetryOnExceptionMessages: [
      "Cannot delete entity, must detach all policies first",
    ],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { policies = [] },
  }) =>
    pipe([
      () => ({}),
      assignAttachedPolicies({ policies }),
      defaultsDeep(otherProps),
      defaultsDeep({
        GroupName: name,
      }),
      // Cannot set Tags
    ])(),
});
