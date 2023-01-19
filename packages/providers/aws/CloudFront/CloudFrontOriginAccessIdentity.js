const assert = require("assert");
const { pipe, tap, get, omit, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { Tagger, getNewCallerReference } = require("../AwsCommon");

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Id);
    }),
    defaultsDeep({ Id: live.Id }),
    omitIfEmpty(["CloudFrontOriginAccessIdentityConfig.Comment"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontOriginAccessIdentity = ({ compare }) => ({
  type: "OriginAccessIdentity",
  package: "cloudfront",
  client: "CloudFront",
  // inferName: () =>
  //   pipe([
  //     get("CloudFrontOriginAccessIdentityConfig.Comment"),
  //     tap((name) => {
  //       assert(name);
  //     }),
  //   ]),
  filterLive: ({ lives }) => pipe([pick([])]),
  findName: () =>
    pipe([
      get("CloudFrontOriginAccessIdentityConfig.Comment"),
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
  ignoreErrorCodes: [
    "NoSuchCloudFrontOriginAccessIdentity",
    "InvalidIfMatchVersion",
  ],
  omitProperties: [
    "Id",
    "Type",
    "ETag",
    "LastModifiedTime",
    "CloudFrontOriginAccessIdentityConfig.CallerReference",
  ],
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getCloudFrontOriginAccessIdentity-property
  getById: {
    method: "getCloudFrontOriginAccessIdentityConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listCloudFrontOriginAccessIdentities-property
  getList: {
    method: "listCloudFrontOriginAccessIdentities",
    getParam: "CloudFrontOriginAccessIdentityList.Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createCloudFrontOriginAccessIdentity-property
  create: {
    method: "createCloudFrontOriginAccessIdentity",
    pickCreated: ({ payload }) => pipe([get("CloudFrontOriginAccessIdentity")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateCloudFrontOriginAccessIdentity-property
  update: {
    method: "updateCloudFrontOriginAccessIdentity",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        //TODO
        //omit(["CloudFrontOriginAccessIdentityConfig.Name"]),
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteCloudFrontOriginAccessIdentity-property
  destroy: {
    method: "deleteCloudFrontOriginAccessIdentity",
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
        CloudFrontOriginAccessIdentityConfig: {
          Comment: name,
          CallerReference: getNewCallerReference(),
        },
      }),
    ])(),
});
