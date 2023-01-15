const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { createTagger } = require("../AwsTagger");

const filterDescription = omitIfEmpty(["Description"]);

const omitPropertiesWebACL = ["ARN", "Id", "LockToken", "LabelNamespace"];

const Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#tagResource-property
// exports.tagResource =
//   ({ findId }) =>
//   ({ endpoint }) =>
//   ({ live }) =>
//     pipe([
//       tap((params) => {
//         assert(findId(live));
//       }),
//       (Tags) => ({ ResourceARN: findId(live), Tags }),
//       endpoint().tagResource,
//     ]);

// // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#untagResource-property
// exports.untagResource =
//   ({ findId }) =>
//   ({ endpoint }) =>
//   ({ live }) =>
//     pipe([
//       tap((params) => {
//         assert(findId(live));
//       }),
//       (TagKeys) => ({ ResourceARN: findId(live), TagKeys }),
//       endpoint().untagResource,
//     ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listTagsForResource-property
const assignTags = ({ findId, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        findId(),
        (ResourceARN) => ({ ResourceARN }),
        endpoint().listTagsForResource,
        get("TagInfoForResource.TagList"),
      ]),
    }),
  ]);

exports.assignTags = assignTags;

const findId = () => pipe([get("ARN")]);

const decorate =
  ({ Scope }) =>
  ({ endpoint }) =>
    pipe([
      assignTags({ endpoint, findId }),
      defaultsDeep({ Scope }),
      tap((params) => {
        assert(true);
      }),
    ]);

exports.createModelWebAcls = ({ compare, type, region, Scope }) => ({
  type,
  package: "wafv2",
  client: "WAFV2",
  region,
  findName: () => pipe([get("Name")]),
  findId,
  inferName: () => get("Name"),
  omitProperties: omitPropertiesWebACL,
  compare: compare({
    filterLive: () => pipe([filterDescription]),
  }),
  filterLive: () => pipe([filterDescription]),
  ignoreErrorCodes: ["WAFNonexistentItemException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getWebACL-property
  getById: {
    method: "getWebACL",
    pickId: pipe([
      pick(["Id", "LockToken", "Name", "Scope"]),
      tap(({ Id, Scope }) => {
        assert(Id);
        assert(Scope);
      }),
    ]),
    getField: "WebACL",
    decorate: decorate({ Scope }),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listWebACLs-property
  getList: {
    method: "listWebACLs",
    enhanceParams: () => () => ({ Scope }),
    getParam: "WebACLs",
    decorate:
      ({ getById }) =>
      (live) =>
        pipe([
          () => live,
          defaultsDeep({ Scope }),
          getById,
          defaultsDeep(live),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createWebACL-property
  create: {
    method: "createWebACL",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("Summary"),
        defaultsDeep({ Scope }),
      ]),
    //isInstanceUp: eq(get("Status"), "DEPLOYED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#updateWebACL-property
  update: {
    method: "updateWebACL",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep(
          pipe([() => live, pick(["Id", "LockToken", "Name", "Scope"])])()
        ),
        omit(["Tags"]),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteWebACL-property
  destroy: {
    method: "deleteWebACL",
    pickId: pipe([
      pick(["Id", "LockToken", "Name", "Scope"]),
      tap(({ Scope }) => {
        assert(Scope);
      }),
    ]),
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
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
