const assert = require("assert");
const { pipe, tap, get, pick, eq, not } = require("rubico");
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeCustomerGateways-property
  getById: {
    method: "describeCustomerGateways",
    getField: "CustomerGateways",
    pickId: pipe([
      ({ CustomerGatewayId }) => ({ CustomerGatewayIds: [CustomerGatewayId] }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeCustomerGateways-property
  getList: {
    method: "describeCustomerGateways",
    getParam: "CustomerGateways",
    filterResource: pipe([not(eq(get("State"), "deleted"))]),
  },
  create: {
    method: "createCustomerGateway",
    pickCreated: ({ payload }) => pipe([get("CustomerGateway")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  destroy: {
    method: "deleteCustomerGateway",
    pickId: pipe([pick(["CustomerGatewayId"])]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
  },
});

const findId = () => pipe([get("CustomerGatewayId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2CustomerGateway = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    cannotBeDeleted: () => eq(get("State"), "deleted"),
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
