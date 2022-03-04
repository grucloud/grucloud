const assert = require("assert");
const { map, pipe, tap, get, not, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getNewCallerReference } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createCloudFront } = require("./CloudFrontCommon");

const findName = pipe([
  tap((params) => {
    assert(true);
  }),
  get(
    "live.CloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfig.Comment"
  ),
]);
const findId = get("live.CloudFrontOriginAccessIdentity.Id");
const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ Id }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontOriginAccessIdentity = ({ spec, config }) => {
  const cloudFront = createCloudFront(config);
  const client = AwsClient({ spec, config })(cloudFront);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getCloudFrontOriginAccessIdentity-property
  const getById = client.getById({
    pickId,
    method: "getCloudFrontOriginAccessIdentity",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listCloudFrontOriginAccessIdentities-property
  const getList = client.getList({
    method: "listCloudFrontOriginAccessIdentities",
    getParam: "Items",
    decorate: () => getById,
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createCloudFrontOriginAccessIdentity-property
  const create = client.create({
    method: "createCloudFrontOriginAccessIdentity",
    pickCreated: () => (result) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => result,
      ])(),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteCloudFrontOriginAccessIdentity-property
  const destroy = client.destroy({
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ ETag, CloudFrontOriginAccessIdentity: { Id } }) => ({
        Id,
        IfMatch: ETag,
      }),
    ]),
    method: "deleteCloudFrontOriginAccessIdentity",
    getById,
    ignoreErrorCodes: ["NoSuchCloudFrontOriginAccessIdentity"],
    config,
  });

  const configDefault = ({ name, properties, dependencies: {} }) =>
    pipe([
      () => properties,
      defaultsDeep({
        CloudFrontOriginAccessIdentityConfig: {
          CallerReference: getNewCallerReference(),
          Comment: name,
        },
      }),
    ])();

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
