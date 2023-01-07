const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./XRayCommon");

const managedByOther = () => pipe([eq(get("GroupName"), "Default")]);

const buildArn = () =>
  pipe([
    get("GroupARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ GroupARN }) => {
    assert(GroupARN);
  }),
  pick(["GroupARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html
exports.XRayGroup = () => ({
  type: "Group",
  package: "xray",
  client: "XRay",
  propertiesDefault: {},
  omitProperties: ["GroupARN"],
  managedByOther,
  cannotBeDeleted: managedByOther,
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
      get("GroupARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidRequestException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#getGroup-property
  getById: {
    method: "getGroup",
    getField: "Group",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#listGroups-property
  getList: {
    method: "getGroups",
    getParam: "Groups",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#createGroup-property
  create: {
    method: "createGroup",
    pickCreated: ({ payload }) => pipe([get("Group")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#updateGroup-property
  update: {
    method: "updateGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#deleteGroup-property
  destroy: {
    method: "deleteGroup",
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
