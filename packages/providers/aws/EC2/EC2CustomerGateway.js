const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidCustomerGatewayID.NotFound"],
  getById: { method: "describeCustomerGateways", getField: "CustomerGateways" },
  getList: { method: "describeCustomerGateways", getParam: "CustomerGateways" },
  create: { method: "createCustomerGateway" },
  destroy: { method: "deleteCustomerGateway" },
});

const findId = pipe([
  get("live.CustomerGatewayId"),
  tap((CustomerGatewayId) => {
    assert(CustomerGatewayId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2CustomerGateway = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    pickId: pipe([
      tap(({ CustomerGatewayId }) => {
        assert(CustomerGatewayId);
      }),
      ({ CustomerGatewayId }) => ({ CustomerGatewayIds: [CustomerGatewayId] }),
    ]),
    pickIdDestroy: pipe([
      tap(({ CustomerGatewayId }) => {
        assert(CustomerGatewayId);
      }),
      pick(["CustomerGatewayId"]),
    ]),
    findId,
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),

    pickCreated: ({ payload }) => pipe([get("CustomerGateway")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
    cannotBeDeleted: eq(get("live.State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, IpAddress, ...otherProps },
      dependencies: { certificate },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          PublicIp: IpAddress,
          TagSpecifications: [
            {
              ResourceType: "customer-gateway",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),

        when(
          () => certificate,
          defaultsDeep({
            CertificateArn: getField(certificate, "CertificateArn"),
          })
        ),
      ])(),
  });
