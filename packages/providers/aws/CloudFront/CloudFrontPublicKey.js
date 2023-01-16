const assert = require("assert");
const { pipe, tap, get, omit, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { getNewCallerReference } = require("../AwsCommon");

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Id);
    }),
    defaultsDeep({ Id: live.Id }),
    omitIfEmpty(["PublicKeyConfig.Comment"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontPublicKey = ({ compare }) => ({
  type: "PublicKey",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      get("PublicKeyConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PublicKeyConfig.Name"),
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
  ignoreErrorCodes: ["NoSuchPublicKey", "InvalidIfMatchVersion"],
  omitProperties: [
    "Id",
    "Type",
    "ETag",
    "LastModifiedTime",
    "PublicKeyConfig.CallerReference",
  ],
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getPublicKey-property
  getById: {
    method: "getPublicKeyConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listPublicKeys-property
  getList: {
    method: "listPublicKeys",
    getParam: "PublicKeyList.Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createPublicKey-property
  create: {
    method: "createPublicKey",
    pickCreated: ({ payload }) => pipe([get("PublicKey")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updatePublicKey-property
  update: {
    method: "updatePublicKey",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        //TODO
        //omit(["PublicKeyConfig.Name"]),
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deletePublicKey-property
  destroy: {
    method: "deletePublicKey",
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
    pipe([
      () => properties,
      defaultsDeep({
        PublicKeyConfig: { CallerReference: getNewCallerReference() },
      }),
    ])(),
});
