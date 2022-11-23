const assert = require("assert");
const { pipe, tap, get, eq, pick, map, set } = require("rubico");
const { defaultsDeep, when, find, includes } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => pipe([get("ClientVpnEndpointId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidClientVpnEndpointId.NotFound"],
  getById: {
    method: "describeClientVpnEndpoints",
    getField: "ClientVpnEndpoints",
    pickId: pipe([
      ({ ClientVpnEndpointId }) => ({
        ClientVpnEndpointIds: [ClientVpnEndpointId],
      }),
    ]),
  },
  getList: {
    method: "describeClientVpnEndpoints",
    getParam: "ClientVpnEndpoints",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createClientVpnEndpoint-property
  create: {
    method: "createClientVpnEndpoint",
    pickCreated: ({ payload }) => pipe([pick(["ClientVpnEndpointId"])]),
    configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
  },
  destroy: {
    method: "deleteClientVpnEndpoint",
    pickId: pick(["ClientVpnEndpointId"]),
    isInstanceDown: pipe([eq(get("Status.Code"), "deleted")]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ClientVpnEndpoint = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    cannotBeDeleted: () => eq(get("Status.Code"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {
        vpc,
        securityGroups,
        cloudWatchLogGroup,
        cloudWatchLogStream,
        serverCertificate,
      },
    }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => otherProps,
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "client-vpn-endpoint",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
        when(
          () => vpc,
          defaultsDeep({
            VpcId: getField(vpc, "VpcId"),
          })
        ),
        when(
          () => securityGroups,
          defaultsDeep({
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          })
        ),
        when(
          () => cloudWatchLogGroup,
          pipe([
            set("ConnectionLogOptions", {
              Enabled: true,
              CloudwatchLogGroup: cloudWatchLogGroup.config.logGroupName,
              // CloudwatchLogStream: getField(
              //   cloudWatchLogStream,
              //   "logStreamName"
              // ),
            }),
          ])
        ),
        when(
          () => serverCertificate,
          defaultsDeep({
            ServerCertificateArn: getField(serverCertificate, "CertificateArn"),
          })
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
