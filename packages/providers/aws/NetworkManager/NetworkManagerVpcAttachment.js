const assert = require("assert");
const { pipe, tap, get, pick, eq, fork, map } = require("rubico");
const { find, defaultsDeep, isObject, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { Tagger, assignArnAttachment } = require("./NetworkManagerCommon");

const findId = () =>
  pipe([
    get("AttachmentId"),
    tap((AttachmentId) => {
      assert(AttachmentId);
    }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([pick(["AttachmentId"])]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Attachment, Options, SubnetArns }) => ({
      ...Attachment,
      SubnetArns,
      Options,
    }),
    assignArnAttachment({ config }),
  ]);

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getVpcAttachment-property
  getById: {
    method: "getVpcAttachment",
    pickId,
    getField: "VpcAttachment",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#listAttachments-property
  getList: {
    enhanceParams: () => () => ({ AttachmentType: "VPC" }),
    method: "listAttachments",
    getParam: "Attachments",
    decorate: ({ getById }) => getById,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#createVpcAttachment-property
  create: {
    method: "createVpcAttachment",
    pickCreated: ({ payload: { VpcArn, CoreNetworkId }, endpoint }) =>
      pipe([
        tap((params) => {
          assert(VpcArn);
        }),
        () => ({
          CoreNetworkId,
          AttachmentType: "VPC",
        }),
        endpoint().listAttachments,
        get("Attachments"),
        find(eq(get("ResourceArn"), VpcArn)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateVpcAttachment-property
  // TODO updateVpcAttachment
  /**
   * var params = {
  AttachmentId: 'STRING_VALUE', 
  AddSubnetArns: [
    'STRING_VALUE',
  ],
  Options: {
    ApplianceModeSupport: true || false,
    Ipv6Support: true || false
  },
  RemoveSubnetArns: [
    'STRING_VALUE',
  ]
};
   */
  update: {
    method: "updateVpcAttachment",
    filterParams: ({ payload }) =>
      pipe([() => payload, pick(["Options"]), defaultsDeep(pickId(live))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteAttachment-property
  destroy: {
    method: "deleteAttachment",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerVpcAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName:
      ({ lives, config }) =>
      (live) =>
        pipe([
          () => live,
          fork({
            coreNetworkName: pipe([
              tap(() => {
                assert(live.CoreNetworkId);
              }),
              get("CoreNetworkId"),
              lives.getById({
                type: "CoreNetwork",
                group: "NetworkManager",
                providerName: config.providerName,
              }),
              get("name", live.CoreNetworkId),
            ]),
            vpcName: pipe([
              lives.getByType({
                type: "Vpc",
                group: "EC2",
              }),
              find(pipe([eq(get("live.VpcArn"), live.ResourceArn)])),
              get("name", live.ResourceArn),
            ]),
          }),
          ({ coreNetworkName, vpcName }) =>
            `vpc-attach::${coreNetworkName}::${vpcName}`,
        ])(),
    findId,
    getByName: getByNameCore,
    ...Tagger({
      buildArn: buildArn({ config }),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { coreNetwork, vpc, subnets },
    }) =>
      pipe([
        tap(() => {
          assert(coreNetwork);
          assert(vpc);
          assert(subnets);
        }),
        () => ({
          CoreNetworkId: getField(coreNetwork, "CoreNetworkId"),
          VpcArn: getField(vpc, "VpcArn"),
          SubnetArns: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "Arn")),
          ])(),
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
        defaultsDeep(otherProps),
      ])(),
  });
