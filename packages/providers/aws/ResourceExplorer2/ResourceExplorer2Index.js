const assert = require("assert");
const { pipe, tap, get, pick, eq, not } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./ResourceExplorer2Common");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Arn }) => {
    assert(Arn);
  }),
  pick(["Arn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

const findName = () => pipe([() => "default"]);

const cannotBeDeleted = () => pipe([eq(get("State"), "DELETED")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html
exports.ResourceExplorer2Index = () => ({
  type: "Index",
  package: "resource-explorer-2",
  client: "ResourceExplorer2",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreatedAt",
    "LastUpdatedAt",
    "State",
    "ReplicatingTo",
    "Type",
  ],
  inferName: findName,
  findName,
  findId: findName,
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["NotFoundException", "ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#getIndex-property
  getById: {
    method: "getIndex",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#listIndexs-property
  getList: {
    method: "getIndex",
    filterResource: pipe([not(eq(get("State"), "DELETED"))]),
    decorate: ({ getById }) =>
      pipe([
        tap((id) => {
          assert(id);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#createIndex-property
  create: {
    method: "createIndex",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("State"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#updateIndex-property
  //   update: {
  //     method: "updateIndex",
  //     filterParams: ({ payload, diff, live }) =>
  //       pipe([() => payload, defaultsDeep(pickId(live))])(),
  //   },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceExplorer2.html#deleteIndex-property
  destroy: {
    method: "deleteIndex",
    pickId,
    isInstanceDown: pipe([eq(get("State"), "DELETED")]),
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
