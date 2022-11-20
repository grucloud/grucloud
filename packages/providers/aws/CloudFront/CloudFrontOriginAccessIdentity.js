const assert = require("assert");
const { map, pipe, tap, get, not, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getNewCallerReference } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCloudFront,
  tagResource,
  untagResource,
} = require("./CloudFrontCommon");
const ignoreErrorCodes = ["NoSuchCloudFrontOriginAccessIdentity"];

const findName = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get(
      "CloudFrontOriginAccessIdentity.CloudFrontOriginAccessIdentityConfig.Comment"
    ),
    tap((Comment) => {
      assert(Comment);
    }),
  ]);

const findId = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("CloudFrontOriginAccessIdentity.Id"),
    tap((Id) => {
      assert(Id);
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  get("CloudFrontOriginAccessIdentity"),
  pick(["Id"]),
  tap((Id) => {
    assert(Id);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontOriginAccessIdentity = ({ spec, config }) => {
  const cloudFront = createCloudFront(config);
  const client = AwsClient({ spec, config })(cloudFront);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getCloudFrontOriginAccessIdentity-property
  const getById = client.getById({
    pickId,
    method: "getCloudFrontOriginAccessIdentity",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listCloudFrontOriginAccessIdentities-property
  const getList = client.getList({
    method: "listCloudFrontOriginAccessIdentities",
    getParam: "CloudFrontOriginAccessIdentityList.Items",
    decorate: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        ({ Id }) => ({ CloudFrontOriginAccessIdentity: { Id } }),
        getById({}),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createCloudFrontOriginAccessIdentity-property
  const create = client.create({
    method: "createCloudFrontOriginAccessIdentity",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteCloudFrontOriginAccessIdentity-property
  const destroy = client.destroy({
    pickId: pipe([
      ({ ETag, CloudFrontOriginAccessIdentity: { Id } }) => ({
        Id,
        IfMatch: ETag,
      }),
    ]),
    method: "deleteCloudFrontOriginAccessIdentity",
    getById,
    ignoreErrorCodes,
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
    tagResource: tagResource({ cloudFront }),
    untagResource: untagResource({ cloudFront }),
  };
};
