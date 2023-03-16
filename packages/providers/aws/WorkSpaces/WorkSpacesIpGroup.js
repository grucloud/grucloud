const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./WorkSpacesCommon");

const buildArn = () =>
  pipe([
    get("GroupId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ GroupId }) => {
    assert(GroupId);
  }),
  pick(["GroupId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ groupId, groupName, groupDesc, userRules }) => ({
      GroupId: groupId,
      GroupName: groupName,
      GroupDesc: groupDesc,
      UserRules: userRules,
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html
exports.WorkSpacesIpGroup = () => ({
  type: "IpGroup",
  package: "workspaces",
  client: "WorkSpaces",
  propertiesDefault: {},
  omitProperties: ["GroupId"],
  inferName: () =>
    pipe([
      get("GroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("GroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GroupId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#describeIpGroups-property
  getById: {
    method: "describeIpGroups",
    getField: "Result",
    pickId: pipe([
      tap(({ GroupId }) => {
        assert(GroupId);
      }),
      ({ GroupId }) => ({ GroupIds: [GroupId] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#describeIpGroups-property
  getList: {
    method: "describeIpGroups",
    getParam: "Result",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#createIpGroup-property
  create: {
    method: "createIpGroup",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#updateRulesOfIpGroup-property
  update: {
    method: "updateRulesOfIpGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#deleteIpGroup-property
  destroy: {
    method: "deleteIpGroup",
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
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
