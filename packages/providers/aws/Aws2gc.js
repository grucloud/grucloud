const assert = require("assert");
const {
  pipe,
  tap,
  get,
  set,
  eq,
  pick,
  switchCase,
  omit,
  not,
  or,
  and,
  assign,
  map,
  any,
  fork,
  filter,
  tryCatch,
  reduce,
} = require("rubico");
const Axios = require("axios");
const {
  size,
  first,
  find,
  identity,
  pluck,
  includes,
  when,
  callProp,
  isEmpty,
  isObject,
  values,
  last,
  prepend,
  defaultsDeep,
} = require("rubico/x");
const prettier = require("prettier");

const AdmZip = require("adm-zip");
const path = require("path");
const mime = require("mime-types");
const Fs = require("fs");
const fs = require("fs").promises;

const { omitIfEmpty, removeOurTags } = require("@grucloud/core/Common");

const {
  generatorMain,
  hasDependency,
  findLiveById,
  readModel,
  readMapping,
  ResourceVarNameDefault,
} = require("@grucloud/core/generatorUtils");
const { configTpl } = require("./configTpl");
const { iacTpl } = require("./iacTpl");

const bucketFileNameFromLive = ({ live: { Name }, commandOptions }) =>
  `s3/${Name}/`;

const bucketFileNameFullFromLive = ({ live, commandOptions, programOptions }) =>
  path.resolve(
    programOptions.workingDirectory,
    bucketFileNameFromLive({ live, commandOptions })
  );

const objectFileNameFromLive = ({
  live: { Bucket, Key, ContentType },
  commandOptions,
}) => `s3/${Bucket}/${Key}.${mime.extension(ContentType)}`;

const objectFileNameFullFromLive = ({ live, commandOptions, programOptions }) =>
  path.resolve(
    programOptions.workingDirectory,
    objectFileNameFromLive({ live, commandOptions })
  );

const securityGroupRulePickProperties = pipe([
  tap((params) => {
    assert(true);
  }),
  ({ resource }) =>
    (live) =>
      pipe([
        () => live,
        switchCase([
          () =>
            hasDependency({ type: "SecurityGroup", group: "EC2" })(resource),
          omit(["IpPermission.UserIdGroupPairs"]),
          identity,
        ]),
        tap((params) => {
          assert(true);
        }),
        pick(["IpPermission"]),
      ])(),
]);

const ec2InstanceDependencies = () => ({
  subnet: {
    type: "Subnet",
    group: "EC2",
  },
  keyPair: { type: "KeyPair", group: "EC2" },
  eip: { type: "ElasticIpAddress", group: "EC2" },
  iamInstanceProfile: { type: "InstanceProfile", group: "IAM" },
  securityGroups: {
    type: "SecurityGroup",
    group: "EC2",
    list: true,
  },
  volumes: {
    type: "Volume",
    group: "EC2",
    list: true,
    filterDependency:
      ({ resource }) =>
      (dependency) =>
        pipe([
          tap(() => {
            assert(resource);
            assert(resource.live);
            assert(dependency);
            assert(dependency.live);
          }),
          () => dependency,
          get("live.Attachments"),
          pluck("Device"),
          not(includes(resource.live.RootDeviceName)),
        ])(),
  },
});

const schemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.oas30.json`);

const writeRestApiSchema =
  ({ programOptions, commandOptions }) =>
  ({ lives, resource }) =>
    pipe([
      tap((params) => {
        assert(programOptions);
        assert(lives);
        assert(resource);
      }),
      () => resource,
      get("live.schema"),
      (json) => JSON.stringify(json, null, 4),
      (content) => prettier.format(content, { parser: "json" }),
      (content) =>
        tryCatch(
          pipe([
            () => schemaFilePath({ programOptions, commandOptions, resource }),
            tap((filePath) => {
              console.log("Writing rest api schema:", filePath);
            }),
            (filePath) => fs.writeFile(filePath, content),
          ]),
          (error) => {
            console.error("Error writing rest api schema", error);
            throw error;
          }
        )(),
    ])();

const graphqlSchemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.graphql`);

const writeGraphqlSchema =
  ({ programOptions, commandOptions }) =>
  ({ lives, resource }) =>
    pipe([
      tap((params) => {
        assert(programOptions);
        assert(lives);
        assert(resource);
      }),
      () => resource,
      get("live.schema"),
      (content) =>
        tryCatch(
          pipe([
            () =>
              graphqlSchemaFilePath({
                programOptions,
                commandOptions,
                resource,
              }),
            tap((filePath) => {
              console.log("Writing graphql schema:", filePath);
            }),
            (filePath) => fs.writeFile(filePath, content),
          ]),
          (error) => {
            console.error("Error writing graphql schema", error);
            throw error;
          }
        )(),
    ])();

const replaceAccountAndRegion = ({ providerConfig }) =>
  pipe([
    callProp("replace", providerConfig.accountId(), "${config.accountId()}"),
    callProp("replace", providerConfig.region, "${config.region}"),
    (resource) => () => "`" + resource + "`",
  ]);

const WritersSpec = ({ commandOptions, programOptions }) => [
  {
    group: "S3",
    types: [
      {
        type: "Bucket",
        filterLive: () =>
          pipe([
            pick([
              "AccelerateConfiguration",
              "ACL",
              "CORSConfiguration",
              "ServerSideEncryptionConfiguration",
              "BucketLoggingStatus",
              "NotificationConfiguration",
              "Policy",
              //"PolicyStatus",
              "ReplicationConfiguration",
              "RequestPaymentConfiguration",
              "VersioningConfiguration",
              "LifecycleConfiguration",
              "WebsiteConfiguration",
            ]),
            //TODO REMOVE omitIfEmpty(["LocationConstraint"])
            when(
              pipe([get("LocationConstraint"), isEmpty]),
              omit(["LocationConstraint"])
            ),
            omit(["WebsiteConfiguration.RoutingRules"]),
          ]),
      },
      {
        type: "Object",
        filterLive: ({ resource: { live } }) =>
          pipe([
            pick(["ContentType", "ServerSideEncryption", "StorageClass"]),
            assign({
              source: () =>
                objectFileNameFromLive({
                  live,
                  commandOptions,
                  programOptions,
                }),
            }),
          ]),
        dependencies: () => ({
          bucket: { type: "Bucket", group: "S3" },
        }),
      },
    ],
  },
  {
    group: "CloudFront",
    types: [
      {
        type: "Distribution",
        filterLive: () =>
          pick([
            "PriceClass",
            "Aliases",
            "DefaultRootObject",
            "DefaultCacheBehavior",
            "Origins",
            "Restrictions",
            "Comment",
            "Logging",
          ]),
        dependencies: () => ({
          bucket: { type: "Bucket", group: "S3" },
          certificate: { type: "Certificate", group: "ACM" },
        }),
      },
    ],
  },
  {
    group: "IAM",
    types: [
      {
        type: "Policy",
        filterLive: switchCase([
          get("resource.cannotBeDeleted"),
          () => pick(["Arn"]),
          () => pick(["PolicyName", "PolicyDocument", "Path", "Description"]),
        ]),
      },
      {
        type: "User",
        filterLive: () => pick(["UserName", "Path"]),
        dependencies: () => ({
          iamGroups: { type: "Group", group: "IAM", list: true },
          policies: { type: "Policy", group: "IAM", list: true },
        }),
      },
      {
        type: "Group",
        filterLive: () => pick(["GroupName", "Path"]),
        dependencies: () => ({
          policies: { type: "Policy", group: "IAM", list: true },
        }),
      },
      {
        type: "Role",
        filterLive: ({ providerConfig }) =>
          pipe([
            pick([
              "Description",
              "Path",
              "AssumeRolePolicyDocument",
              "Policies",
            ]),
            omitIfEmpty(["Description"]),
            assign({
              Policies: pipe([
                get("Policies"),
                map(
                  assign({
                    PolicyDocument: pipe([
                      get("PolicyDocument"),
                      assign({
                        Statement: pipe([
                          get("Statement"),
                          map(
                            assign({
                              Resource: pipe([
                                get("Resource"),
                                switchCase([
                                  Array.isArray,
                                  map(
                                    replaceAccountAndRegion({ providerConfig })
                                  ),
                                  replaceAccountAndRegion({ providerConfig }),
                                ]),
                              ]),
                            })
                          ),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            }),
          ]),
        includeDefaultDependencies: true,
        dependencies: () => ({
          policies: {
            type: "Policy",
            group: "IAM",
            list: true,
            findDependencyNames: ({ resource, lives, providerName }) =>
              pipe([
                () => resource.dependencies,
                find(eq(get("groupType"), `IAM::Policy`)),
                get("ids"),
                map((id) =>
                  pipe([
                    () => id,
                    findLiveById({
                      type: "Policy",
                      group: "IAM",
                      lives,
                      providerName,
                    }),
                    switchCase([
                      isEmpty,
                      () => `"${id}"`,
                      ({ group = "compute", type, name }) =>
                        `resources.${group}.${type}.${ResourceVarNameDefault(
                          name
                        )}`,
                    ]),
                  ])()
                ),
                (dependencyVarNames) => ({ list: true, dependencyVarNames }),
                tap((params) => {
                  assert(true);
                }),
              ])(),
          },
          openIdConnectProvider: {
            type: "OpenIDConnectProvider",
            group: "IAM",
          },
        }),
        hasNoProperty: ({ resource }) =>
          pipe([
            () => resource,
            or([
              hasDependency({ type: "OpenIDConnectProvider", group: "IAM" }),
            ]),
          ])(),
      },
      {
        type: "InstanceProfile",
        filterLive: () => pick([]),
        dependencies: () => ({
          roles: { type: "Role", group: "IAM", list: true },
        }),
      },
      {
        type: "OpenIDConnectProvider",
        filterLive: () => pick(["ClientIDList"]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "EKS" },
          role: { type: "Role", group: "IAM" },
        }),
        hasNoProperty: ({ lives, resource }) =>
          pipe([
            () => resource,
            or([hasDependency({ type: "Cluster", group: "EKS" })]),
          ])(),
      },
    ],
  },
  {
    group: "EC2",
    types: [
      {
        type: "Vpc",
        filterLive: () => pick(["CidrBlock", "DnsSupport", "DnsHostnames"]),
      },
      {
        type: "Subnet",
        filterLive: () =>
          pick([
            "CidrBlock",
            "Ipv6CidrBlock",
            "AvailabilityZone",
            "MapPublicIpOnLaunch",
            "CustomerOwnedIpv4Pool",
            "MapCustomerOwnedIpOnLaunch",
            "MapPublicIpOnLaunch",
          ]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "EC2" } }),
        //TODO remove ?
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "KeyPair",
        filterLive: () => pick([""]),
      },

      {
        type: "Volume",
        filterLive: () =>
          pick(["Size", "VolumeType", "Device", "AvailabilityZone"]),
        //TODO do we need that ?
        ignoreResource:
          ({ lives }) =>
          (resource) =>
            pipe([
              () => resource,
              or([
                get("managedByOther"),
                pipe([
                  get("live.Attachments"),
                  tap((params) => {
                    assert(true);
                  }),
                  any(({ Device, InstanceId }) =>
                    pipe([
                      () => InstanceId,
                      findLiveById({
                        type: "Instance",
                        group: "EC2",
                        lives,
                        providerName: resource.providerName,
                      }),
                      eq(get("live.RootDeviceName"), Device),
                    ])()
                  ),
                  tap((params) => {
                    assert(true);
                  }),
                ]),
              ]),
            ])(),
      },
      {
        type: "ElasticIpAddress",
        filterLive: () => pick([]),
      },
      {
        type: "InternetGateway",
        filterLive: () => pick([]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "EC2" } }),
        //TODO remove ?
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "NatGateway",
        filterLive: () => pick([]),
        dependencies: () => ({
          subnet: { type: "Subnet", group: "EC2" },
          eip: { type: "ElasticIpAddress", group: "EC2" },
        }),
        //TODO remove ?
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "RouteTable",
        filterLive: () => pick([]),
        //TODO remove ?
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          vpc: { type: "Vpc", group: "EC2" },
          subnets: { type: "Subnet", group: "EC2", list: true },
        }),
      },
      {
        type: "Route",
        filterLive: () => pick(["DestinationCidrBlock"]),
        //TODO remove ?
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          routeTable: { type: "RouteTable", group: "EC2" },
          ig: { type: "InternetGateway", group: "EC2" },
          natGateway: { type: "NatGateway", group: "EC2" },
        }),
      },
      {
        type: "SecurityGroup",
        filterLive: () => pick(["Description"]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "EC2" } }),
      },
      {
        type: "SecurityGroupRuleIngress",
        filterLive: securityGroupRulePickProperties,
        includeDefaultDependencies: true,
        dependencies: () => ({
          securityGroup: {
            type: "SecurityGroup",
            group: "EC2",
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  () => resource,
                  eq(get("live.GroupId"), dependency.live.GroupId),
                ])(),
          },
          securityGroupFrom: {
            type: "SecurityGroup",
            group: "EC2",
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  () => resource,
                  tap(() => {
                    assert(dependency.live.GroupId);
                    assert(resource.live.GroupId);
                  }),
                  get("live.IpPermission.UserIdGroupPairs[0].GroupId", ""),
                  and([
                    eq(identity, dependency.live.GroupId),
                    not(eq(resource.live.GroupId, dependency.live.GroupId)),
                  ]),
                ])(),
          },
        }),
      },
      {
        type: "SecurityGroupRuleEgress",
        filterLive: securityGroupRulePickProperties,
        includeDefaultDependencies: true,
        dependencies: () => ({
          securityGroup: { type: "SecurityGroup", group: "EC2" },
        }),
      },
      {
        type: "Instance",
        filterLive: () =>
          pipe([
            pick(["InstanceType", "ImageId", "UserData"]),
            tap((params) => {
              assert(true);
            }),
            when(
              get("UserData"),
              assign({
                UserData: pipe([
                  get("UserData"),
                  tap((params) => {
                    assert(true);
                  }),
                  (UserData) => Buffer.from(UserData, "base64").toString(),
                  tap((params) => {
                    assert(true);
                  }),
                ]),
              })
            ),
          ]),
        dependencies: ec2InstanceDependencies,
      },
      {
        type: "LaunchTemplate",
        filterLive: () =>
          pipe([
            pick(["LaunchTemplateData"]),
            omitIfEmpty([
              "LaunchTemplateData.BlockDeviceMappings",
              "LaunchTemplateData.ElasticGpuSpecifications",
              "LaunchTemplateData.ElasticInferenceAccelerators",
              "LaunchTemplateData.SecurityGroups",
              "LaunchTemplateData.LicenseSpecifications",
              "LaunchTemplateData.TagSpecifications",
            ]),
            omit([
              "LaunchTemplateData.NetworkInterfaces",
              "LaunchTemplateData.SecurityGroupIds",
              "LaunchTemplateData.IamInstanceProfile",
            ]),
          ]),
        dependencies: ec2InstanceDependencies,
      },
    ],
  },
  {
    group: "ACM",
    types: [
      {
        type: "Certificate",
        ignoreResource: ({ lives }) => pipe([get("usedBy"), isEmpty]),
        filterLive: () =>
          pipe([
            pick(["DomainName", "SubjectAlternativeNames"]),
            when(
              ({ DomainName, SubjectAlternativeNames }) =>
                pipe([
                  () => SubjectAlternativeNames,
                  and([eq(size, 1), pipe([first, eq(identity, DomainName)])]),
                ])(),
              omit(["SubjectAlternativeNames"])
            ),
          ]),
      },
    ],
  },
  {
    group: "AutoScaling",
    types: [
      {
        type: "AutoScalingGroup",
        filterLive: () =>
          pick([
            "MinSize",
            "MaxSize",
            "DesiredCapacity",
            "DefaultCooldown",
            "HealthCheckType",
            "HealthCheckGracePeriod",
          ]),
        dependencies: () => ({
          targetGroups: { type: "TargetGroup", group: "ELBv2", list: true },
          subnets: { type: "Subnet", group: "EC2", list: true },
          launchTemplate: { type: "LaunchTemplate", group: "EC2" },
          launchConfiguration: {
            type: "LaunchConfiguration",
            group: "AutoScaling",
          },
        }),
      },
      {
        type: "LaunchConfiguration",
        filterLive: () =>
          pipe([
            pick([
              "InstanceType",
              "ImageId",
              "UserData",
              "InstanceMonitoring",
              "KernelId",
              "RamdiskId",
              "BlockDeviceMappings",
              "EbsOptimized",
            ]),
            omitIfEmpty(["KernelId", "RamdiskId"]),
          ]),
        dependencies: () => ({
          instanceProfile: { type: "InstanceProfile", group: "IAM" },
          keyPair: { type: "KeyPair", group: "EC2" },
          image: { type: "Image", group: "EC2" },
          securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        }),
      },
    ],
  },
  {
    group: "ELBv2",
    types: [
      {
        type: "LoadBalancer",
        filterLive: () => pick(["Scheme", "Type", "IpAddressType"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "EC2", list: true },
          securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
          role: { type: "Role", group: "IAM" },
          key: { type: "Key", group: "KMS" },
        }),
      },
      {
        type: "TargetGroup",
        filterLive: () =>
          pick([
            "Protocol",
            "Port",
            "HealthCheckProtocol",
            "HealthCheckPort",
            "HealthCheckEnabled",
            "HealthCheckIntervalSeconds",
            "HealthCheckTimeoutSeconds",
            "HealthyThresholdCount",
            "HealthCheckPath",
            "Matcher",
            "TargetType",
            "ProtocolVersion",
          ]),

        dependencies: () => ({
          vpc: { type: "Vpc", group: "EC2" },
          nodeGroup: {
            type: "NodeGroup",
            group: "EKS",
          },
          //TODO autoScalingGroup
        }),
      },
      {
        type: "Listener",
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                //TODO when
                switchCase([
                  () =>
                    hasDependency({ type: "TargetGroup", group: "ELBv2" })(
                      resource
                    ),
                  omit(["DefaultActions"]),
                  identity,
                ]),
                tap((params) => {
                  assert(true);
                }),
                pick(["Port", "Protocol", "DefaultActions"]),
              ])(),
        ]),
        dependencies: () => ({
          loadBalancer: { type: "LoadBalancer", group: "ELBv2" },
          targetGroup: { type: "TargetGroup", group: "ELBv2" },
          certificate: { type: "Certificate", group: "ACM" },
        }),
      },
      {
        type: "Rule",
        filterLive: pipe([
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                //TODO when
                switchCase([
                  () =>
                    hasDependency({ type: "TargetGroup", group: "ELBv2" })(
                      resource
                    ),
                  omit(["Actions"]),
                  identity,
                ]),
                pick(["Priority", "Conditions", "Actions"]),
                assign({
                  Conditions: pipe([
                    get("Conditions"),
                    map(omit(["PathPatternConfig"])),
                  ]),
                }),
              ])(),
        ]),
        //TODO do we need this ?
        configBuildProperties: ({ properties, lives }) =>
          pipe([
            tap(() => {
              assert(lives);
            }),
            () => `\n,properties: ${JSON.stringify(properties, null, 4)}`,
          ])(),
        codeBuildProperties: ({ group, type, resourceVarName }) =>
          pipe([
            tap(() => {
              assert(true);
            }),
            () =>
              `\nproperties: () => config.${group}.${type}.${resourceVarName}.properties,`,
          ])(),

        dependencies: () => ({
          listener: { type: "Listener", group: "ELBv2" },
          targetGroup: { type: "TargetGroup", group: "ELBv2" },
        }),
      },
    ],
  },
  {
    group: "KMS",
    types: [
      {
        type: "Key",
        filterLive: () => pick([""]),
        ignoreResource: ({ lives }) =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            not(get("live.Enabled")),
          ]),
      },
    ],
  },
  {
    group: "ECS",
    types: [
      {
        type: "Cluster",
        filterLive: () =>
          pipe([
            pick(["settings", "defaultCapacityProviderStrategy"]),
            omitIfEmpty(["defaultCapacityProviderStrategy"]),
          ]),
        dependencies: () => ({
          capacityProviders: {
            type: "CapacityProvider",
            group: "ECS",
            list: true,
          },
          kmsKey: {
            type: "Key",
            group: "KMS",
          },
        }),
      },
      {
        type: "CapacityProvider",
        filterLive: () =>
          pipe([
            pick(["autoScalingGroupProvider"]),
            omit(["autoScalingGroupProvider.autoScalingGroupArn"]),
          ]),
        dependencies: () => ({
          autoScalingGroup: { type: "AutoScalingGroup", group: "AutoScaling" },
        }),
      },
      {
        type: "TaskDefinition",
        filterLive: () =>
          pick([
            "containerDefinitions",
            "placementConstraints",
            "requiresCompatibilities",
          ]),
      },
      {
        type: "Service",
        filterLive: () =>
          pipe([
            pick([
              "launchType",
              "desiredCount",
              "deploymentConfiguration",
              "placementConstraints",
              "placementStrategy",
              "schedulingStrategy",
              "enableECSManagedTags",
              "propagateTags",
              "enableExecuteCommand",
            ]),
            when(eq(get("propagateTags"), "NONE"), omit(["propagateTags"])),
          ]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "ECS" },
          taskDefinition: { type: "TaskDefinition", group: "ECS" },
          loadBalancers: { type: "LoadBalancer", group: "ELBv2", list: true },
        }),
      },
      {
        type: "Task",
        filterLive: () =>
          pick([
            //"cpu",
            "enableExecuteCommand",
            //"group",
            "launchType",
            //"memory",
            "overrides",
          ]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "ECS" },
          taskDefinition: { type: "TaskDefinition", group: "ECS" },
          subnets: { type: "Subnet", group: "EC2", list: true },
          securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        }),
      },
    ],
  },
  {
    group: "SSM",
    types: [
      {
        type: "Parameter",
        filterLive: () =>
          pick([
            "Type",
            "Value",
            "Description",
            "Tier",
            //"Policies",
            "DataType",
          ]),
      },
    ],
  },
  {
    group: "SQS",
    types: [
      {
        type: "Queue",
        filterLive: () =>
          pipe([
            omit(["QueueUrl"]),
            assign({
              Attributes: pipe([
                get("Attributes"),
                omit([
                  "QueueArn",
                  "ApproximateNumberOfMessages",
                  "ApproximateNumberOfMessagesNotVisible",
                  "ApproximateNumberOfMessagesDelayed",
                  "CreatedTimestamp",
                  "LastModifiedTimestamp",
                ]),
                when(
                  eq(get("Policy.Id"), "__default_policy_ID"),
                  omit(["Policy"])
                ),
                tap((params) => {
                  assert(true);
                }),
              ]),
            }),
          ]),
      },
    ],
  },
  {
    group: "CloudWatchEvents",
    types: [
      {
        type: "EventBus",
        filterLive: () => pipe([pick([])]),
      },
      {
        type: "Rule",
        filterLive: () =>
          pipe([
            omit(["Name", "Arn", "EventBusName"]),
            omitIfEmpty(["Targets"]),
          ]),
        dependencies: () => ({
          eventBus: { type: "EventBus", group: "CloudWatchEvents" },
        }),
      },
    ],
  },
  {
    group: "CloudWatchLogs",
    types: [
      {
        type: "LogGroup",
        filterLive: () => pipe([pick(["retentionInDays"])]),
        dependencies: () => ({
          kmsKey: { type: "Key", group: "kms" },
        }),
      },
    ],
  },
  {
    group: "DynamoDB",
    types: [
      {
        type: "Table",
        filterLive: () =>
          pipe([
            pick([
              "AttributeDefinitions",
              "KeySchema",
              "ProvisionedThroughput",
              "BillingModeSummary",
              "GlobalSecondaryIndexes",
              "LocalSecondaryIndexes",
            ]),
            omit([
              "ProvisionedThroughput.NumberOfDecreasesToday",
              "BillingModeSummary.LastUpdateToPayPerRequestDateTime",
            ]),
            when(
              eq(get("BillingModeSummary.BillingMode"), "PAY_PER_REQUEST"),
              pipe([
                assign({ BillingMode: () => "PAY_PER_REQUEST" }),
                omit(["ProvisionedThroughput", "BillingModeSummary"]),
              ])
            ),
          ]),
        dependencies: () => ({
          kmsKey: { type: "Key", group: "KMS" },
        }),
      },
    ],
  },
  {
    group: "AppSync",
    types: [
      {
        type: "GraphqlApi",
        filterLive: (input) => (live) =>
          pipe([
            tap(() => {
              assert(input);
            }),
            () => input,
            tap(writeGraphqlSchema({ programOptions })),
            () => live,
            pick([
              "authenticationType",
              "xrayEnabled",
              "wafWebAclArn",
              "logConfig",
            ]),
            omit(["logConfig.cloudWatchLogsRoleArn"]),
            tap(() => {
              assert(true);
            }),
            assign({
              schemaFile: () => `${live.name}.graphql`,
            }),
          ])(),
        dependencies: () => ({
          cloudWatchLogsRole: { type: "Role", group: "IAM" },
        }),
      },
      {
        type: "ApiKey",
        filterLive: () => pick(["description", "xrayEnabled", "wafWebAclArn"]),
        dependencies: () => ({
          graphqlApi: { type: "GraphqlApi", group: "AppSync" },
        }),
      },
      // {
      //   type: "Type",
      //   filterLive: () => pick(["description", "definition", "format"]),
      //   dependencies: () => ({
      //     graphqlApi: { type: "GraphqlApi", group: "AppSync" },
      //   }),
      // },
      {
        type: "Resolver",
        filterLive: () =>
          pick([
            "typeName",
            "fieldName",
            "requestMappingTemplate",
            "responseMappingTemplate",
            "kind",
          ]),
        dependencies: () => ({
          graphqlApi: { type: "GraphqlApi", group: "AppSync" },
          type: { type: "Type", group: "AppSync" },
          dataSource: { type: "DataSource", group: "AppSync" },
          dynamoDbTable: { type: "Table", group: "DynamoDB" },
        }),
      },
      {
        type: "DataSource",
        filterLive: () =>
          pipe([
            pick([
              "description",
              "type",
              "dynamodbConfig",
              "elasticsearchConfig",
              "httpConfig",
              "relationalDatabaseConfig",
            ]),
            //TODO omit elasticsearchConfig.xxx ?
            omit([
              "httpConfig.endpoint",
              "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier",
              "relationalDatabaseConfig.rdsHttpEndpointConfig.awsSecretStoreArn",
              "relationalDatabaseConfig.rdsHttpEndpointConfig.awsRegion",
            ]),
          ]),
        dependencies: () => ({
          serviceRole: { type: "Role", group: "IAM" },
          graphqlApi: { type: "GraphqlApi", group: "AppSync" },
          dbCluster: { type: "DBCluster", group: "RDS" },
          lambdaFunction: { type: "Function", group: "Lambda" },
          //TODO
          //elasticsearch => opensearch
          dynamoDbTable: { type: "Table", group: "DynamoDB" },
        }),
      },
    ],
  },
  {
    group: "ECR",
    types: [
      {
        type: "Repository",
        filterLive: ({ providerConfig }) =>
          pipe([
            pick([
              "imageTagMutability",
              "imageScanningConfiguration",
              "encryptionConfiguration",
              "policyText",
              "lifecyclePolicyText",
            ]),
            assign({
              policyText: pipe([
                get("policyText"),
                assign({
                  Statement: pipe([
                    get("Statement"),
                    map(
                      assign({
                        Principal: pipe([
                          get("Principal.AWS"),
                          callProp(
                            "replace",
                            providerConfig.accountId(),
                            "${config.accountId()}"
                          ),
                          (principal) => ({
                            AWS: () => "`" + principal + "`",
                          }),
                        ]),
                      })
                    ),
                  ]),
                }),
              ]),
            }),
          ]),
      },
      {
        type: "Registry",
        ignoreResource: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            get("live"),
            not(and([get("policyText"), get("replicationConfiguration")])),
            tap((params) => {
              assert(true);
            }),
          ]),

        filterLive: () =>
          pipe([pick(["policyText", "replicationConfiguration"])]),
      },
    ],
  },
  {
    group: "EKS",
    types: [
      {
        type: "Cluster",
        filterLive: () => pick(["version"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "EC2", list: true },
          securityGroups: {
            type: "SecurityGroup",
            group: "EC2",
            list: true,
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  tap(() => {
                    assert(dependency);
                  }),
                  () => dependency,
                  not(get("managedByOther")),
                  tap((result) => {
                    assert(true);
                  }),
                ])(),
          },
          role: { type: "Role", group: "IAM" },
          key: { type: "Key", group: "KMS" },
        }),
      },
      {
        type: "NodeGroup",
        filterLive: () =>
          pick([
            "capacityType",
            "scalingConfig",
            "instanceTypes",
            "amiType",
            "labels",
            "diskSize",
          ]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "EKS" },
          subnets: { type: "Subnet", group: "EC2", list: true },
          role: { type: "Role", group: "IAM" },
        }),
      },
    ],
  },
  {
    group: "Route53Domains",
    types: [
      {
        type: "Domain",
        filterLive: () => pick([]),
      },
    ],
  },
  {
    group: "Route53",
    types: [
      {
        type: "HostedZone",
        filterLive: () => pick([]),
        includeDefaultDependencies: true,
        dependencies: () => ({
          domain: { type: "Domain", group: "Route53Domains" },
          hostedZone: { type: "HostedZone", group: "Route53" },
        }),
      },
      {
        type: "Record",
        filterLive: () =>
          pipe([
            pick(["Name", "Type", "TTL", "ResourceRecords", "AliasTarget"]),
            tap((params) => {
              assert(true);
            }),
            //TODO omitIfEmpty(["ResourceRecords"])
            when(
              pipe([get("ResourceRecords"), isEmpty]),
              omit(["ResourceRecords"])
            ),
          ]),
        hasNoProperty: ({ lives, resource }) =>
          pipe([
            () => resource,
            or([
              hasDependency({ type: "LoadBalancer", group: "ELBv2" }),
              hasDependency({ type: "Certificate", group: "ACM" }),
              hasDependency({ type: "Distribution", group: "CloudFront" }),
              hasDependency({ type: "DomainName", group: "APIGateway" }),
              hasDependency({ type: "DomainName", group: "ApiGatewayV2" }),
            ]),
          ])(),
        dependencies: () => ({
          hostedZone: { type: "HostedZone", group: "Route53" },
          loadBalancer: { type: "LoadBalancer", group: "ELBv2" },
          certificate: { type: "Certificate", group: "ACM" },
          distribution: { type: "Distribution", group: "CloudFront" },
          apiGatewayV2DomainName: { type: "DomainName", group: "ApiGatewayV2" },
          apiGatewayDomainName: { type: "DomainName", group: "APIGateway" },
        }),
        //TODO remove ?
        ignoreResource: () => get("cannotBeDeleted"),
      },
    ],
  },
  {
    group: "Lambda",
    types: [
      {
        type: "Layer",
        filterLive:
          ({ resource }) =>
          (live) =>
            pipe([
              tap(() => {
                assert(resource.name);
                assert(live.Content.Data);
              }),
              () => live,
              pick([
                "LayerName",
                "Description",
                "CompatibleRuntimes",
                "LicenseInfo",
              ]),
              tap((params) => {
                assert(true);
              }),
              tap(
                pipe([
                  () => new AdmZip(Buffer.from(live.Content.Data, "base64")),
                  (zip) =>
                    zip.extractAllTo(
                      path.resolve(
                        programOptions.workingDirectory,
                        resource.name
                      ),
                      true
                    ),
                ])
              ),
            ])(),
      },
      {
        type: "Function",
        filterLive:
          ({ resource }) =>
          (live) =>
            pipe([
              tap(() => {
                assert(resource.name);
                assert(live.Code.Data);
              }),
              () => live,
              pick([
                "Handler",
                "PackageType",
                "Runtime",
                "Description",
                "LicenseInfo",
                "Timeout",
                "MemorySize",
                "Environment",
              ]),
              tap(
                pipe([
                  () => new AdmZip(Buffer.from(live.Code.Data, "base64")),
                  (zip) =>
                    zip.extractAllTo(
                      path.resolve(
                        programOptions.workingDirectory,
                        resource.name
                      ),
                      true
                    ),
                ])
              ),
            ])(),
        dependencies: () => ({
          layers: { type: "Layer", group: "Lambda", list: true },
          role: { type: "Role", group: "IAM" },
        }),
      },
      {
        type: "EventSourceMapping",
        filterLive:
          ({ resource }) =>
          (live) =>
            pipe([
              tap(() => {}),
              () => live,
              pick([
                "StartingPosition",
                "StartingPositionTimestamp",
                "BatchSize",
                "MaximumBatchingWindowInSeconds",
                "ParallelizationFactor",
                "DestinationConfig",
                "Topics",
                "Queues",
                "MaximumRecordAgeInSeconds",
                "BisectBatchOnFunctionError",
                "MaximumRetryAttempts",
                "TumblingWindowInSeconds",
                "FunctionResponseTypes",
              ]),
            ])(),
        dependencies: () => ({
          lambdaFunction: { type: "Function", group: "Lambda" },
          sqsQueue: { type: "Queue", group: "SQS" },
          //TODO other event source
        }),
      },
    ],
  },
  {
    group: "APIGateway",
    types: [
      {
        type: "RestApi",
        filterLive: (input) => (live) =>
          pipe([
            tap(() => {
              assert(input);
            }),
            () => input,
            tap(writeRestApiSchema({ programOptions })),
            () => live,
            pick(["apiKeySource", "endpointConfiguration"]),
            tap(() => {
              assert(true);
            }),
            assign({
              schemaFile: () => `${live.name}.oas30.json`,
              deployment: pipe([
                () => live,
                get("deployments"),
                first,
                get("id"),
                (deploymentId) =>
                  pipe([
                    () => input.lives,
                    find(
                      and([
                        eq(get("groupType"), "APIGateway::Stage"),
                        eq(get("live.deploymentId"), deploymentId),
                      ])
                    ),
                    get("name"),
                  ])(),
                (stageName) => ({
                  stageName,
                }),
              ]),
            }),
          ])(),
      },
      {
        type: "Account",
        filterLive: () =>
          pipe([
            omit([
              "apiKeyVersion",
              "throttleSettings",
              "features",
              "cloudwatchRoleArn",
            ]),
          ]),
        dependencies: () => ({
          cloudwatchRole: { type: "Role", group: "IAM" },
        }),
      },
      {
        type: "Authorizer",
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["id", "name", "restApiId", "providerARNs"]),
          ]),
        dependencies: () => ({
          restApi: { type: "RestApi", group: "APIGateway" },
          lambdaFunction: { type: "Function", group: "Lambda" },
          userPool: { type: "UserPool", group: "Cognito" },
        }),
      },
      {
        type: "Stage",
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick([
              "name",
              "description",
              "StageName",
              "StageVariables",
              "methodSettings",
              "accessLogSettings",
              "cacheClusterEnabled",
              "cacheClusterSize",
              "tracingEnabled",
            ]),
            omitIfEmpty(["methodSettings"]),
            tap((params) => {
              assert(true);
            }),
          ]),
        dependencies: () => ({
          restApi: { type: "RestApi", group: "APIGateway" },
        }),
      },
      {
        type: "Deployment",
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["Description"]),
          ]),
        dependencies: () => ({
          //api: { type: "Api", group: "APIGateway" },
          stage: { type: "Stage", group: "APIGateway" },
        }),
      },
      {
        type: "DomainName",
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["DomainName"]),
          ]),
        dependencies: () => ({
          certificate: { type: "Certificate", group: "ACM" },
        }),
      },
      // {
      //   type: "Model",
      //   filterLive: () =>
      //     pipe([
      //       tap((params) => {
      //         assert(true);
      //       }),
      //       pick(["schema", "contentType"]),
      //       assign({ schema: pipe([get("schema"), JSON.parse]) }),
      //       tap((params) => {
      //         assert(true);
      //       }),
      //     ]),
      //   dependencies: () => ({
      //     restApi: { type: "RestApi", group: "APIGateway" },
      //   }),
      // },
      // {
      //   type: "Resource",
      //   filterLive: () =>
      //     pipe([
      //       tap((params) => {
      //         assert(true);
      //       }),
      //       pick([]),
      //     ]),
      //   dependencies: () => ({
      //     restApi: { type: "RestApi", group: "APIGateway" },
      //   }),
      // },
      // {
      //   type: "Method",
      //   filterLive: () =>
      //     pipe([
      //       tap((params) => {
      //         assert(true);
      //       }),
      //       pick([
      //         "httpMethod",
      //         "authorizationType",
      //         "apiKeyRequired",
      //         "methodResponses",
      //         "methodIntegration",
      //         "description",
      //       ]),
      //       omit(["methodIntegration.uri", "methodIntegration.cacheNamespace"]),
      //     ]),
      //   dependencies: () => ({
      //     resource: { type: "Resource", group: "APIGateway" },
      //   }),
      // },
      // {
      //   type: "Integration",
      //   filterLive: () =>
      //     pipe([
      //       tap((params) => {
      //         assert(true);
      //       }),
      //       omit([
      //         "restApiId",
      //         "restApiName",
      //         "resourceId",
      //         "path",
      //         "httpMethod",
      //         "cacheNamespace",
      //         "uri",
      //       ]),
      //     ]),
      //   dependencies: () => ({
      //     method: { type: "Method", group: "APIGateway" },
      //     lambdaFunction: { type: "Function", group: "Lambda" },
      //   }),
      // },
    ],
  },
  {
    group: "ApiGatewayV2",
    types: [
      {
        type: "Api",
        filterLive: () =>
          pick([
            "Name",
            "ProtocolType",
            "ApiKeySelectionExpression",
            "DisableExecuteApiEndpoint",
            "RouteSelectionExpression",
          ]),
      },
      {
        type: "Authorizer",
        filterLive: () =>
          pick([
            "AuthorizerType",
            "Name",
            "IdentitySource",
            "AuthorizerCredentialsArn",
            "AuthorizerPayloadFormatVersion",
            "AuthorizerResultTtlInSeconds",
            "AuthorizerUri",
            "EnableSimpleResponses",
            "IdentityValidationExpression",
            "JwtConfiguration",
          ]),
      },
      {
        type: "Integration",
        filterLive: () =>
          pick([
            "ConnectionType",
            "Description",
            "IntegrationMethod",
            "IntegrationType",
            "PayloadFormatVersion",
          ]),
        dependencies: () => ({
          api: { type: "Api", group: "ApiGatewayV2" },
          lambdaFunction: { type: "Function", group: "Lambda" },
        }),
      },
      {
        type: "Route",
        filterLive: () =>
          pick(["ApiKeyRequired", "AuthorizationType", "RouteKey"]),
        dependencies: () => ({
          api: { type: "Api", group: "ApiGatewayV2" },
          integration: { type: "Integration", group: "ApiGatewayV2" },
        }),
      },
      {
        type: "Stage",
        filterLive: () => pick(["StageName", "StageVariables"]),
        dependencies: () => ({
          api: { type: "Api", group: "ApiGatewayV2" },
        }),
      },
      {
        type: "Deployment",
        filterLive: () => pick(["Description"]),
        dependencies: () => ({
          api: { type: "Api", group: "ApiGatewayV2" },
          stage: { type: "Stage", group: "ApiGatewayV2" },
        }),
      },
      {
        type: "DomainName",
        filterLive: () => pick(["DomainName"]),
        dependencies: () => ({
          certificate: { type: "Certificate", group: "ACM" },
        }),
      },
    ],
  },
  {
    group: "RDS",
    types: [
      {
        type: "DBCluster",
        filterLive: () =>
          pipe([
            pick([
              "DatabaseName",
              "Engine",
              "EngineVersion",
              "EngineMode",
              "Port",
              "ScalingConfigurationInfo",
              "PreferredBackupWindow",
              "PreferredMaintenanceWindow",
            ]),
            assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
            omit(["ScalingConfigurationInfo"]),
          ]),

        environmentVariables: () => [
          { path: "MasterUsername", suffix: "MASTER_USERNAME" },
          { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
        ],
        dependencies: () => ({
          dbSubnetGroup: { type: "DBSubnetGroup", group: "RDS" },
          securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
          key: {
            type: "Key",
            group: "KMS",
          },
        }),
      },
      {
        type: "DBInstance",
        filterLive: () =>
          pick([
            "DBInstanceClass",
            "Engine",
            "EngineVersion",
            "AllocatedStorage",
            "MaxAllocatedStorage",
            "PubliclyAccessible",
            "PreferredBackupWindow",
            "PreferredMaintenanceWindow",
            "BackupRetentionPeriod",
          ]),
        environmentVariables: () => [
          { path: "MasterUsername", suffix: "MASTER_USERNAME" },
          { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
        ],
        dependencies: () => ({
          dbSubnetGroup: { type: "DBSubnetGroup", group: "RDS" },
          securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        }),
      },
      {
        type: "DBSubnetGroup",
        filterLive: () => pick(["DBSubnetGroupDescription"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "EC2", list: true },
        }),
      },
    ],
  },
];

const downloadAsset = ({ url, assetPath }) =>
  pipe([
    () => path.resolve(assetPath),
    tap((params) => {
      assert(true);
    }),
    tap(pipe([path.dirname, (dir) => fs.mkdir(dir, { recursive: true })])),
    Fs.createWriteStream,
    (writer) =>
      tryCatch(
        pipe([
          () =>
            Axios({
              url,
              method: "GET",
              responseType: "stream",
            }),
          get("data"),
          callProp("pipe", writer),
          () =>
            new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            }),
          tap((params) => {
            assert(true);
          }),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              throw Error(error.message);
            }),
          ])()
      )(),
  ])();

const downloadS3Objects = ({ lives, commandOptions, programOptions }) =>
  pipe([
    () => lives,
    filter(eq(get("groupType"), "S3::Object")),
    pluck("live"),
    tap((params) => {
      assert(true);
    }),
    map((live) =>
      pipe([
        () =>
          objectFileNameFullFromLive({ live, commandOptions, programOptions }),
        tap((objectFileName) => {
          console.log(`Downloading ${live.signedUrl} to ${objectFileName}`);
        }),
        tap((assetPath) =>
          downloadAsset({
            url: live.signedUrl,
            assetPath,
            commandOptions,
            programOptions,
          })
        ),
        tap((objectFileName) => {
          console.log(`${objectFileName} Downloaded`);
        }),
      ])()
    ),
  ])();

const createS3Buckets = ({ lives, commandOptions, programOptions }) =>
  pipe([
    () => lives,
    filter(eq(get("groupType"), "S3::Bucket")),
    map((live) =>
      pipe([
        tap(() => {
          assert(live);
        }),
        () =>
          bucketFileNameFullFromLive({ live, commandOptions, programOptions }),
        tap((params) => {
          assert(true);
        }),
        (bucketFileName) => fs.mkdir(bucketFileName, { recursive: true }),
        tap((params) => {
          assert(true);
        }),
        // (assetPath) =>
        //   downloadAsset({ url: live.signedUrl, assetPath, options }),
      ])()
    ),
  ])();

const downloadAssets = ({ writersSpec, commandOptions, programOptions }) =>
  pipe([
    fork({
      lives: readModel({ writersSpec, commandOptions, programOptions }),
      mapping: readMapping({ commandOptions, programOptions }),
    }),
    tap((params) => {
      assert(true);
    }),
    ({ lives }) =>
      pipe([
        () => createS3Buckets({ lives, commandOptions, programOptions }),
        () => downloadS3Objects({ lives, commandOptions, programOptions }),
      ])(),
  ])();

const filterModel = pipe([
  map(
    assign({
      live: pipe([
        get("live"),
        removeOurTags,
        //TODO create removeOurTagArray
        when(
          get("Tags"),
          assign({
            Tags: pipe([
              get("Tags"),
              tap((params) => {
                assert(true);
              }),
              filter(
                and([
                  pipe([
                    get("Key"),
                    when(isEmpty, get("key")),
                    when(isEmpty, get("TagKey")),
                    switchCase([
                      isEmpty,
                      () => true,
                      not(callProp("startsWith", "aws")),
                    ]),
                  ]),
                  not(get("ResourceId")),
                ])
              ),
            ]),
          })
        ),
      ]),
    })
  ),
  tap((params) => {
    assert(true);
  }),
]);
exports.generateCode = ({ providerConfig, commandOptions, programOptions }) =>
  tryCatch(
    pipe([
      () => WritersSpec({ commandOptions, programOptions }),
      (writersSpec) =>
        pipe([
          () =>
            generatorMain({
              name: "aws2gc",
              providerType: "aws",
              writersSpec,
              providerConfig,
              commandOptions,
              programOptions,
              iacTpl,
              configTpl,
              filterModel,
            }),
          tap((params) => {
            assert(true);
          }),
          tap.if(
            () => commandOptions.download,
            () =>
              downloadAssets({
                writersSpec,
                commandOptions,
                programOptions,
              })
          ),
        ])(),
    ]),
    (error) => {
      console.error(error);
      throw error;
    }
  )();
