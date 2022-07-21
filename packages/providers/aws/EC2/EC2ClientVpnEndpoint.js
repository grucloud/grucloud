const assert = require("assert");
const { pipe, tap, get, eq, pick, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const logger = require("@grucloud/core/logger")({
  prefix: "ClientVpnEndpoint",
});

const findId = pipe([get("live.ClientVpnEndpointId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidClientVpnEndpointId.NotFound"],
  getById: {
    method: "describeClientVpnEndpoints",
    getField: "ClientVpnEndpoints",
    pickId: pipe([
      tap(({ ClientVpnEndpointId }) => {
        assert(ClientVpnEndpointId);
      }),
      ({ ClientVpnEndpointId }) => ({
        ClientVpnEndpointIds: [ClientVpnEndpointId],
      }),
    ]),
  },
  getList: {
    method: "describeClientVpnEndpoints",
    getParam: "ClientVpnEndpoints",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createClientVpnEndpoint-property
  create: {
    method: "createClientVpnEndpoint",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        pick(["ClientVpnEndpointId"]),
      ]),
    // isInstanceUp: pipe([
    //   tap(({ Status }) => {
    //     assert(Status);
    //     logger.debug(`createClientVpnEndpoint state: ${Status.Code}`);
    //   }),
    //   eq(get("Status.Code"), "available"),
    // ]),
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
    findDependencies: ({ live }) => [
      {
        type: "Vpc",
        group: "EC2",
        ids: [live.VpcId],
      },
      {
        type: "SecurityGroup",
        group: "EC2",
        ids: live.SecurityGroupIds,
      },
      {
        type: "LogGroup",
        group: "CloudWatchLogs",
        ids: [
          pipe([() => live, get("ConnectionLogOptions.CloudwatchLogGroup")])(),
        ],
      },
      {
        type: "Certificate",
        group: "ACM",
        ids: [
          pipe([() => live, get("ServerCertificateArn")])(),
          ...pipe([
            () => live,
            get("AuthenticationOptions", []),
            tap((params) => {
              assert(true);
            }),
            map(pipe([get("MutualAuthentication.ClientRootCertificateChain")])),
            tap((params) => {
              assert(true);
            }),
          ])(),
        ],
      },
      //TODO
      // {
      //   type: "LogGroupStream",
      //   group: "CloudWatchLogs",
      //   ids: [
      //     pipe([() => live, get("ConnectionLogOptions.CloudwatchLogStream")])(),
      //   ],
      // },
    ],
    findName: findNameInTagsOrId({ findId }),
    findId,
    cannotBeDeleted: eq(get("live.Status.Code"), "deleted"),
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
          defaultsDeep({
            ConnectionLogOptions: {
              CloudwatchLogGroup: getField(cloudWatchLogGroup, "arn"),
            },
          })
        ),
        when(
          () => serverCertificate,
          defaultsDeep({
            ServerCertificateArn: getField(serverCertificate, "CertificateArn"),
          })
        ),
      ])(),
  });
