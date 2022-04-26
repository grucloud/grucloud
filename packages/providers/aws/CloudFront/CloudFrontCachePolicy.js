const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const model = {
  package: "cloudfront",
  client: "CloudFront",
  ignoreErrorCodes: ["NoSuchCachePolicy"],
  getById: { method: "getCachePolicy", getField: "CachePolicy" },
  getList: { method: "listCachePolicies", getParam: "CachePolicyList.Items" },
  create: { method: "createCachePolicy" },
  update: { method: "updateCachePolicy" },
  destroy: { method: "deleteCachePolicy" },
};
const managedByOther = pipe([eq(get("live.Type"), "managed")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontCachePolicy = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    managedByOther,
    cannotBeDeleted: managedByOther,
    findName: pipe([get("live.CachePolicy.CachePolicyConfig.Name")]),
    findId: get("live.CachePolicy.CachePolicyConfig.Name"),
    decorateList:
      ({ getById }) =>
      (live) =>
        pipe([
          () => live,
          // getById,
          // defaultsDeep(live),
          tap((params) => {
            assert(true);
          }),
        ])(),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({}),
      ]),
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ CachePolicy: { Id } }) => ({ Id }),
      tap(({ Id }) => {
        assert(Id);
      }),
    ]),
    pickIdDestroy: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ CachePolicy: { Id }, ETag }) => ({ Id, IfMatch: ETag }),
      tap(({ Id, IfMatch: ETag }) => {
        assert(Id);
        //assert(ETag);
      }),
    ]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getByName: ({ getById }) => pipe([({ name }) => ({ Name: name }), getById]),
    configDefault: ({ name, namespace, properties }) =>
      pipe([
        () => properties,
        defaultsDeep({
          CachePolicyConfig: { Name: name },
        }),
      ])(),
  });
