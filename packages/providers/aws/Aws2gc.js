const assert = require("assert");
const {
  pipe,
  tap,
  get,
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
} = require("rubico");
const Axios = require("axios");
const {
  size,
  first,
  flatten,
  identity,
  pluck,
  includes,
  when,
  callProp,
  isEmpty,
} = require("rubico/x");
const AdmZip = require("adm-zip");
const path = require("path");
const mime = require("mime-types");
const Fs = require("fs");
const fs = require("fs").promises;

const {
  generatorMain,
  hasDependency,
  findLiveById,
  readModel,
  readMapping,
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
            hasDependency({ type: "SecurityGroup", group: "ec2" })(resource),
          omit(["IpPermission.UserIdGroupPairs"]),
          identity,
        ]),
        tap((params) => {
          assert(true);
        }),
        pick(["IpPermission"]),
      ])(),
]);

const WritersSpec = ({ commandOptions, programOptions }) => [
  {
    group: "s3",
    types: [
      {
        type: "Bucket",
        filterLive: () =>
          pipe([
            pick([
              "LocationConstraint",
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
            when(
              pipe([get("LocationConstraint"), isEmpty]),
              omit(["LocationConstraint"])
            ),
            omit(["WebsiteConfiguration.RoutingRules"]),
            tap((params) => {
              assert(true);
            }),
          ]),
      },
      {
        type: "Object",
        filterLive: ({ resource: { live } }) =>
          pipe([
            pick(["ContentType", "ServerSideEncryption", "StorageClass"]),
            tap((params) => {
              assert(true);
            }),
            assign({
              source: () =>
                objectFileNameFromLive({
                  live,
                  commandOptions,
                  programOptions,
                }),
            }),
            tap((params) => {
              assert(live);
            }),
          ]),
        dependencies: () => ({
          bucket: { type: "Bucket", group: "s3" },
        }),
      },
    ],
  },
  {
    group: "cloudFront",
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
          bucket: { type: "Bucket", group: "s3" },
          certificate: { type: "Certificate", group: "acm" },
        }),
      },
    ],
  },
  {
    group: "iam",
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
          iamGroups: { type: "Group", group: "iam" },
          policies: { type: "Policy", group: "iam" },
        }),
      },
      {
        type: "Group",
        filterLive: () => pick(["GroupName", "Path"]),
        dependencies: () => ({
          policies: { type: "Policy", group: "iam" },
        }),
      },
      {
        type: "Role",
        filterLive: () =>
          pick(["RoleName", "Path", "AssumeRolePolicyDocument"]),
        dependencies: () => ({
          policies: { type: "Policy", group: "iam" },
          openIdConnectProvider: {
            type: "OpenIDConnectProvider",
            group: "iam",
          },
        }),
        hasNoProperty: ({ resource }) =>
          pipe([
            () => resource,
            or([
              hasDependency({ type: "OpenIDConnectProvider", group: "iam" }),
            ]),
          ])(),
      },
      {
        type: "InstanceProfile",
        filterLive: () => pick([]),
        dependencies: () => ({ roles: { type: "Role", group: "iam" } }),
      },
      {
        type: "OpenIDConnectProvider",
        filterLive: () => pick(["ClientIDList"]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "eks" },
          role: { type: "Role", group: "iam" },
        }),
        hasNoProperty: ({ lives, resource }) =>
          pipe([
            () => resource,
            or([hasDependency({ type: "Cluster", group: "eks" })]),
          ])(),
      },
    ],
  },
  {
    group: "ec2",
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
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
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
                        group: "ec2",
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
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "NatGateway",
        filterLive: () => pick([]),
        dependencies: () => ({
          subnet: { type: "Subnet", group: "ec2" },
          eip: { type: "ElasticIpAddress", group: "ec2" },
        }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "RouteTable",
        filterLive: () => pick([]),
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          vpc: { type: "Vpc", group: "ec2" },
          subnets: { type: "Subnet", group: "ec2" },
        }),
      },
      {
        type: "Route",
        filterLive: () => pick(["DestinationCidrBlock"]),
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          routeTable: { type: "RouteTable", group: "ec2" },
          ig: { type: "InternetGateway", group: "ec2" },
          natGateway: { type: "NatGateway", group: "ec2" },
        }),
      },
      {
        type: "SecurityGroup",
        filterLive: () => pick(["Description"]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
      },
      {
        type: "SecurityGroupRuleIngress",
        filterLive: securityGroupRulePickProperties,
        dependencies: () => ({
          securityGroup: {
            type: "SecurityGroup",
            group: "ec2",
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
            group: "ec2",
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
        dependencies: () => ({
          securityGroup: { type: "SecurityGroup", group: "ec2" },
        }),
      },

      {
        type: "Instance",
        filterLive: () => pick(["InstanceType", "ImageId"]),
        dependencies: () => ({
          subnet: {
            type: "Subnet",
            group: "ec2",
          },
          keyPair: { type: "KeyPair", group: "ec2" },
          eip: { type: "ElasticIpAddress", group: "ec2" },
          iamInstanceProfile: { type: "InstanceProfile", group: "iam" },
          securityGroups: {
            type: "SecurityGroup",
            group: "ec2",
          },
          volumes: {
            type: "Volume",
            group: "ec2",
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
        }),
      },
    ],
  },
  {
    group: "acm",
    types: [
      {
        type: "Certificate",
        ignoreResource: ({ lives }) => pipe([get("usedBy"), isEmpty]),
        filterLive: () =>
          pipe([
            pick(["DomainName", "SubjectAlternativeNames"]),
            tap((params) => {
              assert(true);
            }),
            when(
              ({ DomainName, SubjectAlternativeNames }) =>
                pipe([
                  () => SubjectAlternativeNames,
                  and([eq(size, 1), pipe([first, eq(identity, DomainName)])]),
                  tap((params) => {
                    assert(true);
                  }),
                ])(),
              omit(["SubjectAlternativeNames"])
            ),
            tap((params) => {
              assert(true);
            }),
          ]),
      },
    ],
  },
  {
    group: "autoscaling",
    types: [
      {
        type: "AutoScalingGroup",
        //TODO
        filterLive: () => pick([]),
      },
    ],
  },
  {
    group: "elb",
    types: [
      {
        type: "LoadBalancer",
        filterLive: () => pick(["Scheme", "Type", "IpAddressType"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          role: { type: "Role", group: "iam" },
          key: { type: "Key", group: "kms" },
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
          vpc: { type: "Vpc", group: "ec2" },
          nodeGroup: {
            type: "NodeGroup",
            group: "eks",
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
                switchCase([
                  () =>
                    hasDependency({ type: "TargetGroup", group: "elb" })(
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
          loadBalancer: { type: "LoadBalancer", group: "elb" },
          targetGroup: { type: "TargetGroup", group: "elb" },
          certificate: { type: "Certificate", group: "acm" },
        }),
      },
      {
        type: "Rule",
        filterLive: pipe([
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                switchCase([
                  () =>
                    hasDependency({ type: "TargetGroup", group: "elb" })(
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
          listener: { type: "Listener", group: "elb" },
          targetGroup: { type: "TargetGroup", group: "elb" },
        }),
      },
    ],
  },
  {
    group: "kms",
    types: [
      {
        type: "Key",
        filterLive: () => pick([]),
        ignoreResource: ({ lives }) => pipe([get("usedBy"), isEmpty]),
      },
    ],
  },
  {
    group: "eks",
    types: [
      {
        type: "Cluster",
        filterLive: () => pick(["version"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
          securityGroups: {
            type: "SecurityGroup",
            group: "ec2",
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
          role: { type: "Role", group: "iam" },
          key: { type: "Key", group: "kms" },
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
          cluster: { type: "Cluster", group: "eks" },
          subnets: { type: "Subnet", group: "ec2" },
          role: { type: "Role", group: "iam" },
        }),
      },
    ],
  },
  {
    group: "route53Domain",
    types: [
      {
        type: "Domain",
        filterLive: () => pick([]),
      },
    ],
  },
  {
    group: "route53",
    types: [
      {
        type: "HostedZone",
        filterLive: () => pick([]),
        dependencies: () => ({
          domain: { type: "Domain", group: "route53Domain" },
          hostedZone: { type: "HostedZone", group: "route53" },
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
            when(
              pipe([get("ResourceRecords"), isEmpty]),
              omit(["ResourceRecords"])
            ),
          ]),
        hasNoProperty: ({ lives, resource }) =>
          pipe([
            () => resource,
            or([
              hasDependency({ type: "LoadBalancer", group: "elb" }),
              hasDependency({ type: "Certificate", group: "acm" }),
              hasDependency({ type: "Distribution", group: "cloudFront" }),
              hasDependency({ type: "DomainName", group: "apiGatewayV2" }),
            ]),
          ])(),
        dependencies: () => ({
          hostedZone: { type: "HostedZone", group: "route53" },
          loadBalancer: { type: "LoadBalancer", group: "elb" },
          certificate: { type: "Certificate", group: "acm" },
          distribution: { type: "Distribution", group: "cloudFront" },
          apiGatewayV2DomainName: { type: "DomainName", group: "apiGatewayV2" },
        }),
        ignoreResource: () => get("cannotBeDeleted"),
      },
    ],
  },
  {
    group: "lambda",
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
                "FunctionName",
                "Handler",
                "PackageType",
                "Runtime",
                "Description",
                "LicenseInfo",
                "Timeout",
                "MemorySize",
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
          layers: { type: "Layer", group: "lambda" },
          role: { type: "Role", group: "iam" },
        }),
      },
    ],
  },
  {
    group: "apiGatewayV2",
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
          api: { type: "Api", group: "apiGatewayV2" },
          lambdaFunction: { type: "Function", group: "lambda" },
        }),
      },
      {
        type: "Route",
        filterLive: () =>
          pick(["ApiKeyRequired", "AuthorizationType", "RouteKey"]),
        dependencies: () => ({
          api: { type: "Api", group: "apiGatewayV2" },
          integration: { type: "Integration", group: "apiGatewayV2" },
        }),
      },
      {
        type: "Stage",
        filterLive: () => pick(["StageName", "StageVariables"]),
        dependencies: () => ({
          api: { type: "Api", group: "apiGatewayV2" },
        }),
      },
      {
        type: "Deployment",
        filterLive: () => pick(["Description"]),
        dependencies: () => ({
          api: { type: "Api", group: "apiGatewayV2" },
          stage: { type: "Stage", group: "apiGatewayV2" },
        }),
      },
      {
        type: "DomainName",
        filterLive: () => pick(["DomainName"]),
        dependencies: () => ({
          certificate: { type: "Certificate", group: "acm" },
        }),
      },
    ],
  },
  {
    group: "rds",
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
            tap((params) => {
              assert(true);
            }),
            assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
            omit(["ScalingConfigurationInfo"]),
            tap((params) => {
              assert(true);
            }),
          ]),

        environmentVariables: () => ["MasterUsername", "MasterUserPassword"],
        dependencies: () => ({
          dbSubnetGroup: { type: "DBSubnetGroup", group: "rds" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          key: {
            type: "Key",
            group: "kms",
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
            "BackupRetentionPeriod",
          ]),
        environmentVariables: () => ["MasterUsername", "MasterUserPassword"],
        dependencies: () => ({
          dbSubnetGroup: { type: "DBSubnetGroup", group: "rds" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
        }),
      },
      {
        type: "DBSubnetGroup",
        filterLive: () => pick(["DBSubnetGroupDescription"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
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
      ])(),
  ])();

const downloadS3Objects = ({ lives, commandOptions, programOptions }) =>
  pipe([
    () => lives,
    filter(eq(get("groupType"), "s3::Object")),
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
    filter(eq(get("groupType"), "s3::Bucket")),
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

exports.generateCode = ({ commandOptions, programOptions }) =>
  pipe([
    () => WritersSpec({ commandOptions, programOptions }),
    (writersSpec) =>
      pipe([
        () =>
          generatorMain({
            name: "aws2gc",
            providerType: "aws",
            writersSpec,
            commandOptions,
            programOptions,
            iacTpl,
            configTpl,
          }),
        () =>
          downloadAssets({
            writersSpec,
            commandOptions,
            programOptions,
          }),
      ])(),
  ])();
