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
      omitIfEmpty(["OriginRequestPolicyConfig.Comment"]),
      tap((params) => {
        assert(true);
      }),
    ])();

const managedByOther = () => pipe([eq(get("Type"), "managed")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontOriginRequestPolicy = ({ compare }) => ({
  type: "OriginRequestPolicy",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      get("OriginRequestPolicyConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("OriginRequestPolicyConfig.Name"),
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
  ignoreErrorCodes: ["NoSuchOriginRequestPolicy"],
  omitProperties: ["Id", "Type", "ETag", "LastModifiedTime"],
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getOriginRequestPolicy-property
  getById: {
    method: "getOriginRequestPolicyConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listResponseHeadersPolicies-property
  getList: {
    method: "listOriginRequestPolicies",
    getParam: "OriginRequestPolicyList.Items",
    filterResource: eq(get("Type"), "custom"),
    decorate: ({ getById }) =>
      pipe([
        ({ OriginRequestPolicy: { Id }, Type }) => ({ Id, Type }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createOriginRequestPolicy-property
  create: {
    method: "createOriginRequestPolicy",
    pickCreated: ({ payload }) => pipe([get("OriginRequestPolicy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateOriginRequestPolicy-property
  update: {
    method: "updateOriginRequestPolicy",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteOriginRequestPolicy-property
  destroy: {
    method: "deleteOriginRequestPolicy",
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
