const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#tagResource-property
exports.tagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId(live));
      }),
      (Tags) => ({ ResourceARN: findId(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#untagResource-property
exports.untagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId(live));
      }),
      (TagKeys) => ({ ResourceARN: findId(live), TagKeys }),
      endpoint().untagResource,
    ]);

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

exports.createModelWebAcls = ({ config, region, Scope }) => ({
  package: "wafv2",
  client: "WAFV2",
  region,
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
});
