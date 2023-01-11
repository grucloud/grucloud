const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const decorate =
  ({ endpoint, live }) =>
  (decorating) =>
    pipe([
      () => decorating,
      // Remove properties when the property value is undefined.
      JSON.stringify,
      JSON.parse,
      tap((params) => {
        assert(live);
        assert(live.Id);
      }),
      defaultsDeep({ Id: live.Id, Type: get("Type", "custom")(live) }),
      omitIfEmpty([
        "ResponseHeadersPolicyConfig.Comment",
        "ResponseHeadersPolicyConfig.SecurityHeadersConfig.XSSProtection",
        "ResponseHeadersPolicyConfig.SecurityHeadersConfig.FrameOptions",
        "ResponseHeadersPolicyConfig.SecurityHeadersConfig.ReferrerPolicy",
        "ResponseHeadersPolicyConfig.SecurityHeadersConfig.ContentSecurityPolicy",
        "ResponseHeadersPolicyConfig.SecurityHeadersConfig.ContentTypeOptions",
        "ResponseHeadersPolicyConfig.SecurityHeadersConfig.StrictTransportSecurity",
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

const managedByOther = () => pipe([eq(get("Type"), "managed")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontResponseHeadersPolicy = ({ compare }) => ({
  type: "ResponseHeadersPolicy",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      get("ResponseHeadersPolicyConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ResponseHeadersPolicyConfig.Name"),
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
  ignoreErrorCodes: ["NoSuchResponseHeadersPolicy"],
  omitProperties: ["Id", "Type", "ETag", "LastModifiedTime"],
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getResponseHeadersPolicy-property
  getById: {
    method: "getResponseHeadersPolicyConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listCachePolicies-property
  getList: {
    method: "listResponseHeadersPolicies",
    getParam: "ResponseHeadersPolicyList.Items",
    filterResource: eq(get("Type"), "custom"),
    decorate: ({ getById }) =>
      pipe([
        ({ ResponseHeadersPolicy: { Id }, Type }) => ({ Id, Type }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createResponseHeadersPolicy-property
  create: {
    method: "createResponseHeadersPolicy",
    pickCreated: ({ payload }) => pipe([get("ResponseHeadersPolicy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateResponseHeadersPolicy-property
  update: {
    method: "updateResponseHeadersPolicy",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteResponseHeadersPolicy-property
  destroy: {
    method: "deleteResponseHeadersPolicy",
    pickId: pipe([
      tap(({ Id, ETag }) => {
        assert(ETag);
      }),
      ({ Id, ETag }) => ({ Id, IfMatch: ETag }),
    ]),
    ignoreErrorCodes: ["InvalidIfMatchVersion"],
  },
  getByName: getByNameCore,
  configDefault: ({ name, namespace, properties }) =>
    pipe([() => properties, defaultsDeep({})])(),
});
