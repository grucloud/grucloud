const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Id);
    }),
    defaultsDeep({ Id: live.Id, Type: get("Type", "custom")(live) }),
  ]);

const managedByOther = () => pipe([eq(get("Type"), "managed")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontCachePolicy = ({ compare }) => ({
  type: "CachePolicy",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      get("CachePolicyConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("CachePolicyConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Id"),
      tap((Id) => {
        assert(Id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["NoSuchCachePolicy"],
  omitProperties: ["Id", "Type", "ETag"],
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getCachePolicy-property
  getById: {
    method: "getCachePolicyConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listCachePolicies-property
  getList: {
    method: "listCachePolicies",
    getParam: "CachePolicyList.Items",
    filterResource: eq(get("Type"), "custom"),
    decorate: ({ getById }) =>
      pipe([({ CachePolicy: { Id }, Type }) => ({ Id, Type }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createCachePolicy-property
  create: {
    method: "createCachePolicy",
    pickCreated: ({ payload }) => pipe([get("CachePolicy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateCachePolicy-property
  update: {
    method: "updateCachePolicy",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteCachePolicy-property
  destroy: {
    method: "deleteCachePolicy",
    pickId: pipe([
      tap(({ Id, ETag }) => {
        assert(ETag);
        assert(Id);
      }),
      ({ Id, ETag }) => ({ Id, IfMatch: ETag }),
    ]),
    ignoreErrorCodes: ["InvalidIfMatchVersion"],
  },
  getByName: getByNameCore,
  configDefault: ({ name, namespace, properties }) =>
    pipe([() => properties, defaultsDeep({})])(),
});
