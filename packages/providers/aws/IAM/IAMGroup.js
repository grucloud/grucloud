const assert = require("assert");
const { pipe, tap, get, assign, pick, omit, map, tryCatch } = require("rubico");
const { defaultsDeep, forEach, pluck } = require("rubico/x");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  assignAttachedPolicies,
  sortPolicies,
  ignoreErrorCodes,
  filterAttachedPolicies,
} = require("./IAMCommon");

const findName = () =>
  pipe([
    get("GroupName"),
    tap((GroupName) => {
      assert(GroupName);
    }),
  ]);

const findId = () =>
  pipe([
    get("Arn"),
    tap((Arn) => {
      assert(Arn);
    }),
  ]);

const pickId = pipe([
  pick(["GroupName"]),
  tap(({ GroupName }) => {
    assert(GroupName);
  }),
]);

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
    }),
  ]);

const attachGroupPolicy = ({ endpoint, live }) =>
  pipe([
    tap(({ PolicyArn }) => {
      assert(PolicyArn);
      assert(live.GroupName);
      assert(endpoint);
    }),
    pick(["PolicyArn"]),
    defaultsDeep({ GroupName: live.GroupName }),
    endpoint().attachGroupPolicy,
  ]);

const detachGroupPolicy = ({ endpoint, live }) =>
  pipe([
    tap(({ PolicyArn }) => {
      assert(endpoint);
      assert(live.GroupName);
      assert(PolicyArn);
    }),
    pick(["PolicyArn"]),
    defaultsDeep({ GroupName: live.GroupName }),
    endpoint().detachGroupPolicy,
  ]);

// Attached Policy
const deleteGroupPolicy = ({ endpoint, live }) =>
  tryCatch(
    pipe([
      tap(({ PolicyName }) => {
        assert(endpoint);
        assert(PolicyName);
        assert(live.GroupName);
      }),
      pick(["PolicyName"]),
      defaultsDeep({ GroupName: live.GroupName }),
      endpoint().deleteGroupPolicy,
    ]),
    () => {}
  );

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
    postCreate:
      ({ endpoint, name, payload }) =>
      (live) =>
        pipe([
          () => payload,
          get("AttachedPolicies", []),
          map(attachGroupPolicy({ endpoint, live })),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateMyResource-property
  update:
    ({ endpoint }) =>
    ({ name, diff, payload, live }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "AttachedPolicies",
          onAdd: attachGroupPolicy,
          onRemove: detachGroupPolicy,
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroup-property
  destroy: {
    pickId,
    preDestroy: ({ endpoint }) =>
      tap((live) =>
        pipe([
          //
          () => live,
          get("AttachedPolicies"),
          map(detachGroupPolicy({ endpoint, live })),
        ])()
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
