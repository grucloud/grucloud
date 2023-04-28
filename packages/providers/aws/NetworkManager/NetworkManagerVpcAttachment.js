const assert = require("assert");
const { pipe, tap, get, pick, eq, fork, map, filter } = require("rubico");
const { defaultsDeep, find, when, isObject, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerVpcAttachment = () => ({
  type: "VpcAttachment",
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [
    "CoreNetworkId",
    "CoreNetworkArn",
    "AttachmentId",
    "State",
    "ResourceArn",
    "AttachmentPolicyRuleNumber",
    "CreatedAt",
    "UpdatedAt",
    "Arn",
    "SubnetArns",
    "VpcArn",
    "OwnerAccountId",
  ],
  inferName: ({ dependenciesSpec: { coreNetwork, vpc } }) =>
    pipe([
      tap(() => {
        assert(coreNetwork);
        assert(vpc);
      }),
      () => vpc,
      when(isObject, get("name")),
      (vpcName) => `vpc-attach::${coreNetwork}::${vpcName}`,
    ]),
  dependencies: {
    coreNetwork: {
      type: "CoreNetwork",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("CoreNetworkId"),
          tap((CoreNetworkId) => {
            assert(CoreNetworkId);
          }),
        ]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            tap((params) => {
              assert(live.ResourceArn);
            }),
            lives.getByType({
              type: "Vpc",
              group: "EC2",
            }),
            tap((params) => {
              assert(true);
            }),
            find(eq(get("live.VpcArn"), live.ResourceArn)),
            get("id"),
          ])(),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds:
        ({ lives, config }) =>
        ({ SubnetArns }) =>
          pipe([
            lives.getByType({
              type: "Subnet",
              group: "EC2",
            }),
            tap((params) => {
              assert(SubnetArns);
            }),
            filter(pipe([get("live.Arn"), isIn(SubnetArns)])),
            map(get("id")),
          ])(),
    },
  },
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
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
    isInstanceError: pipe([eq(get("State"), "FAILED")]),
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
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { coreNetwork, vpc, subnets },
    config,
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
