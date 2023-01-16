const assert = require("assert");
const { pipe, tap, get, map, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.Id);
    }),
    defaultsDeep({ Id: live.Id }),
    omitIfEmpty(["KeyGroupConfig.Comment"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontKeyGroup = ({ compare }) => ({
  type: "KeyGroup",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      get("KeyGroupConfig.Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("KeyGroupConfig.Name"),
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
  ignoreErrorCodes: ["NoSuchResource", "InvalidIfMatchVersion"],
  omitProperties: [
    "Id",
    "Type",
    "ETag",
    "LastModifiedTime",
    "KeyGroupConfig.Items",
  ],
  dependencies: {
    publicKeys: {
      type: "PublicKey",
      group: "CloudFront",
      list: true,
      dependencyIds: () => pipe([get("KeyGroupConfig.Items")]),
    },
  },
  compare: compare({}),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getKeyGroup-property
  getById: {
    method: "getKeyGroupConfig",
    decorate,
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listKeyGroups-property
  getList: {
    method: "listKeyGroups",
    getParam: "KeyGroupList.Items",
    decorate: ({ getById }) => pipe([get("KeyGroup"), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createKeyGroup-property
  create: {
    method: "createKeyGroup",
    pickCreated: ({ payload }) => pipe([get("KeyGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#updateKeyGroup-property
  update: {
    method: "updateKeyGroup",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        //TODO
        //omit(["KeyGroupConfig.Name"]),
        defaultsDeep({ Id: live.Id, IfMatch: live.ETag }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteKeyGroup-property
  destroy: {
    method: "deleteKeyGroup",
    pickId: pipe([
      tap(({ Id, ETag }) => {
        assert(Id);
        assert(ETag);
      }),
      ({ Id, ETag }) => ({ Id, IfMatch: ETag }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { publicKeys = [] },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        KeyGroupConfig: {
          Items: pipe([() => publicKeys, map((pk) => getField(pk, "Id"))])(),
        },
      }),
    ])(),
});
