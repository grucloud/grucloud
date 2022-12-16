const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, fork } = require("rubico");
const {
  defaultsDeep,
  pluck,
  when,
  identity,
  unless,
  isEmpty,
  filterOut,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./TransferCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ServerId }) => {
    assert(ServerId);
  }),
  pick(["ServerId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Tags: pipe([
        get("Tags"),
        filterOut(eq(get("Key"), "transfer:route53HostedZoneId")),
      ]),
    }),
  ]);

const onUpload = ({ providerConfig, lives }) =>
  pipe([
    unless(
      isEmpty,
      map(
        assign({
          ExecutionRole: pipe([
            get("ExecutionRole"),
            replaceWithName({
              groupType: "IAM::Role",
              path: "id",
              providerConfig,
              lives,
            }),
          ]),
          WorkflowId: pipe([
            get("WorkflowId"),
            replaceWithName({
              groupType: "Transfer::Workflow",
              path: "id",
              providerConfig,
              lives,
            }),
          ]),
        })
      )
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html
exports.TransferServer = () => ({
  type: "Server",
  package: "transfer",
  client: "Transfer",
  propertiesDefault: {
    ProtocolDetails: {
      PassiveIp: "AUTO",
      SetStatOption: "DEFAULT",
      TlsSessionResumptionMode: "ENFORCED",
    },
    SecurityPolicyName: "TransferSecurityPolicy-2020-06",
  },
  omitProperties: [
    "Arn",
    "ServerId",
    "Certificate",
    "EndpointDetails",
    "HostKeyFingerprint",
    "LoggingRole",
    "State",
    "IdentityProviderDetails.DirectoryId",
    "IdentityProviderDetails.Function",
    "VpcEndpointId",
    "UserCount",
  ],
  inferName:
    () =>
    ({ Domain, EndpointType }) =>
      pipe([() => `${Domain}::${EndpointType}`])(),
  findName:
    () =>
    ({ Domain, EndpointType }) =>
      pipe([() => `${Domain}::${EndpointType}`])(),
  findId: () =>
    pipe([
      get("ServerId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    directory: {
      type: "Directory",
      group: "DirectoryService",
      dependencyId: ({ lives, config }) =>
        pipe([get("IdentityProviderDetails.DirectoryId")]),
    },
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) => pipe([get("Certificate")]),
    },
    elasticIpAddresses: {
      type: "ElaticIpAddress",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("EndpointDetails.AddressAllocationIds"),
    },
    iamRoleLogging: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("LoggingRole")]),
    },
    iamRolesWorkflow: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("WorkflowDetails"),
          tap((params) => {
            assert(true);
          }),
          unless(
            isEmpty,
            pipe([
              fork({
                partialUpload: pipe([
                  get("OnPartialUpload", []),
                  pluck("ExecutionRole"),
                ]),
                upload: pipe([
                  get("OnPartialUpload", []),
                  pluck("ExecutionRole"),
                ]),
              }),
              ({ partialUpload = [], upload = [] }) => [
                ...partialUpload,
                ...upload,
              ],
            ])
          ),
        ]),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) =>
        pipe([get("IdentityProviderDetails.Function")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("EndpointDetails.SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("EndpointDetails.SubnetIds"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("EndpointDetails.VpcId"),
    },
    workflows: {
      type: "Workflow",
      group: "Transfer",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("WorkflowDetails"),
          unless(
            isEmpty,
            pipe([
              fork({
                partialUpload: pipe([
                  get("OnPartialUpload", []),
                  pluck("WorkflowId"),
                ]),
                upload: pipe([get("OnUpload", []), pluck("WorkflowId")]),
              }),
              ({ partialUpload = [], upload = [] }) => [
                ...partialUpload,
                ...upload,
              ],
            ])
          ),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#describeServer-property
  getById: {
    method: "describeServer",
    getField: "Server",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#listServers-property
  getList: {
    method: "listServers",
    getParam: "Servers",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#createServer-property
  create: {
    method: "createServer",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("State"), "ONLINE")]),
    isInstanceError: pipe([eq(get("State"), "START_FAILED")]),
    shouldRetryOnExceptionMessages: ["Invalid Role ARN"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#updateServer-property
  update: {
    method: "updateServer",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#deleteServer-property
  destroy: {
    method: "deleteServer",
    pickId,
    shouldRetryOnExceptionMessages: ["Unable to delete VPC endpoint"],
  },
  getByName: getByNameCore,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("WorkflowDetails"),
        assign({
          WorkflowDetails: pipe([
            get("WorkflowDetails"),
            when(
              get("OnPartialUpload"),
              assign({
                OnPartialUpload: pipe([
                  get("OnPartialUpload"),
                  onUpload({ providerConfig, lives }),
                ]),
              })
            ),
            when(
              get("OnUpload"),
              assign({
                OnUpload: pipe([
                  get("OnUpload"),
                  onUpload({ providerConfig, lives }),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      certificate,
      directory,
      elasticIpAddresses,
      iamRoleLogging,
      iamRoleInvocation,
      lambdaFunction,
      securityGroups,
      subnets,
      vpc,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => certificate,
        assign({ Certificate: () => getField(certificate, "CertificateArn") })
      ),
      when(
        () => directory,
        defaultsDeep({
          IdentityProviderDetails: {
            DirectoryId: getField(directory, "DirectoryId"),
          },
        })
      ),
      when(
        () => elasticIpAddresses,
        defaultsDeep({
          EndpointDetails: {
            AddressAllocationIds: pipe([
              () => elasticIpAddresses,
              map((eip) => getField(eip, "AllocationId")),
            ])(),
          },
        })
      ),
      when(
        () => iamRoleLogging,
        assign({
          LoggingRole: () => getField(iamRoleLogging, "Arn"),
        })
      ),
      when(
        () => lambdaFunction,
        defaultsDeep({
          IdentityProviderDetails: {
            Function: getField(lambdaFunction, "Configuration.FunctionArn"),
          },
        })
      ),
      when(
        () => iamRoleInvocation,
        defaultsDeep({
          IdentityProviderDetails: {
            InvocationRole: getField(iamRoleInvocation, "Arn"),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          EndpointDetails: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          EndpointDetails: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => vpc,
        defaultsDeep({
          EndpointDetails: {
            VpcId: getField(vpc, "VpcId"),
          },
        })
      ),
    ])(),
});
