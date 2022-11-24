const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  filter,
  not,
  fork,
  switchCase,
  pick,
} = require("rubico");
const { prepend } = require("rubico/x");

const { findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayAttachments-property
  getList: {
    method: "describeTransitGatewayAttachments",
    getParam: "TransitGatewayAttachments",
    transformListPre: () => pipe([filter(not(isInstanceDown))]),
  },
});

const findNameInDependency =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => live,
      fork({
        tgwName: pipe([
          get("TransitGatewayId"),
          tap((TransitGatewayId) => {
            assert(TransitGatewayId);
          }),
          lives.getById({
            type: "TransitGateway",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", live.TransitGatewayId),
        ]),
        resourceName: pipe([
          switchCase([
            eq(get("ResourceType"), "vpn"),
            pipe([
              get("ResourceId"),
              lives.getById({
                type: "VpnConnection",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ResourceId),
              prepend("vpn::"),
            ]),
            eq(get("ResourceType"), "vpc"),
            pipe([
              get("ResourceId"),
              lives.getById({
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ResourceId),
              prepend("vpc::"),
            ]),
            eq(get("ResourceType"), "peering"),
            pipe([
              get("ResourceId"),
              lives.getById({
                type: "TransitGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ResourceId),
              prepend("tgw::"),
            ]),
            ({ ResourceType }) => {
              assert(false, `ResourceType '${ResourceType}' not handled`);
            },
          ]),
        ]),
      }),
      ({ tgwName, resourceName }) => `tgw-attach::${tgwName}::${resourceName}`,
    ])();

const findId = () =>
  pipe([
    get("TransitGatewayAttachmentId"),
    tap((TransitGatewayAttachmentId) => {
      assert(TransitGatewayAttachmentId);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId: findNameInDependency }),
    findId,
    cannotBeDeleted: () => () => true,
    managedByOther: () => () => true,
  });
