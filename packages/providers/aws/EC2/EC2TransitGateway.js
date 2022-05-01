const assert = require("assert");
const { pipe, tap, get, pick, eq, filter, not } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayID.NotFound"],
  getById: { method: "describeTransitGateways", getField: "TransitGateways" },
  getList: {
    method: "describeTransitGateways",
    getParam: "TransitGateways",
    transformList: pipe([filter(not(isInstanceDown))]),
  },
  create: { method: "createTransitGateway" },
  destroy: { method: "deleteTransitGateway" },
});

const findId = pipe([
  get("live.TransitGatewayArn"),
  tap((TransitGatewayArn) => {
    assert(TransitGatewayArn);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGateway = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    pickId: pipe([
      tap(({ TransitGatewayId }) => {
        assert(TransitGatewayId);
      }),
      ({ TransitGatewayId }) => ({ TransitGatewayIds: [TransitGatewayId] }),
    ]),
    pickIdDestroy: pipe([
      tap(({ TransitGatewayId }) => {
        assert(TransitGatewayId);
      }),
      pick(["TransitGatewayId"]),
    ]),
    findId,
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),

    pickCreated: ({ payload }) => pipe([get("TransitGateway")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
    isInstanceDown,
    cannotBeDeleted: eq(get("live.State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, IpAddress, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "transit-gateway",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
