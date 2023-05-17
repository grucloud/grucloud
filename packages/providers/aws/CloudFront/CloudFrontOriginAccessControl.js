const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Id);
    }),
    defaultsDeep({ Id: live.Id }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontOriginAccessControl = ({ compare }) => ({
  type: "OriginAccessControl",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      get("OriginAccessControlConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("OriginAccessControlConfig.Name"),
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
  ignoreErrorCodes: ["NoSuchOriginAccessControl", "InvalidIfMatchVersion"],
  omitProperties: ["Id", "ETag", "LastModifiedTime"],
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getOriginAccessControlConfig-property
  getById: {
    method: "getOriginAccessControlConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listOriginAccessControls-property
  getList: {
    method: "listOriginAccessControls",
    getParam: "OriginAccessControlList.Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createOriginAccessControl-property
  create: {
    method: "createOriginAccessControl",
    pickCreated: ({ payload }) => pipe([get("OriginAccessControl")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateCloudFrontOriginAccessControl-property
  update: {
    method: "updateOriginAccessControl",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        tap(() => {
          assert(live.Id);
          assert(live.ETag);
        }),
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteOriginAccessControl-property
  destroy: {
    method: "deleteOriginAccessControl",
    pickId: pipe([
      tap(({ Id, ETag }) => {
        assert(Id);
        assert(ETag);
      }),
      ({ Id, ETag }) => ({ Id, IfMatch: ETag }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({ name, namespace, properties }) =>
    pipe([() => properties])(),
});
