const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { find, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");

const findId = () =>
  pipe([
    get("AttachmentId"),
    tap((AttachmentId) => {
      assert(AttachmentId);
    }),
  ]);

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getVpcAttachment-property
  getById: {
    method: "getVpcAttachment",
    pickId: pipe([
      tap(({ AttachmentId }) => {
        //assert(AttachmentId);
      }),
      pick(["AttachmentId"]),
    ]),
    getField: "VpcAttachment.Attachment",
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
        () => ({
          CoreNetworkId,
          AttachmentType: "VPC",
        }),
        endpoint.listAttachments,
        get("Attachments"),
        find(eq(get("ResourceArn"), VpcArn)),
      ]),
    // isInstanceUp: pipe([
    //   tap(({ State }) => {
    //     logger.info(`createVpcAttachment State: ${State}`);
    //   }),
    //   eq(get("State"), "AVAILABLE"),
    // ]),
    // REJECTED
    //isInstanceError: eq(get("State"), "FAILED"),
    //getById: () => true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateVpcAttachment-property
  // TODO updateVpcAttachment

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteAttachment-property
  destroy: {
    method: "deleteAttachment",
    pickId: pipe([pick(["AttachmentId"])]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerVpcAttachment = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName:
      ({ lives }) =>
      (live) =>
        pipe([
          () => live,
          fork({
            coreNetworkName: pipe([
              tap(() => {
                assert(live.CoreNetworkId);
              }),
              () =>
                lives.getById({
                  id: live.CoreNetworkId,
                  type: "CoreNetwork",
                  group: "NetworkManager",
                  providerName: config.providerName,
                }),
              get("name", live.CoreNetworkId),
            ]),
            vpcName: pipe([
              () =>
                lives.getByType({
                  type: "Vpc",
                  group: "EC2",
                  providerName: config.providerName,
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
    configDefault: ({
      name,
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
            map((subnet) => getField(subnet, "SubnetArn")),
          ])(),
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
        defaultsDeep(otherProps),
      ])(),
  });
