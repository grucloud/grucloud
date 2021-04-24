const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const { map, get, pipe, eq, tap } = require("rubico");
const { find } = require("rubico/x");
const hook = require("./hook");

const namespace = "";

const PolicyNames = [
  "AmazonEC2FullAccess",
  "AmazonRoute53FullAccess",
  "AmazonS3FullAccess",
  "IAMFullAccess",
  "AmazonVPCFullAccess",
];
const createIamResources = async ({ provider }) => {
  // Policies, Group and User
  const { config } = provider;
  const { groupName, userName } = config.kops;
  assert(groupName, userName);

  const policies = await map((policy) =>
    provider.useIamPolicy({
      name: policy,
      namespace,
      properties: () => ({
        Arn: `arn:aws:iam::aws:policy/${policy}`,
      }),
    })
  )(PolicyNames);

  const iamGroup = await provider.makeIamGroup({
    name: groupName,
    namespace,
    dependencies: { policies: policies },
    properties: () => ({}),
  });

  const iamUser = await provider.makeIamUser({
    name: userName,
    namespace,
    dependencies: { iamGroups: [iamGroup] },
    properties: () => ({}),
  });
};

const createRoute53Resources = async ({ provider }) => {
  //Route 53
  const { config } = provider;
  const { domainName, subDomainName } = config.kops;
  assert(domainName);
  assert(subDomainName);

  // Read Only Parent with useHostedZone
  const hostedZoneParent = await provider.useHostedZone({
    name: `${domainName}.`,
    namespace,
  });

  const hostedZoneSub = await provider.makeHostedZone({
    name: `${subDomainName}.`,
    namespace,
  });

  // Add a NS record from the sub dns server to the parent.
  const recordNS = await provider.makeRoute53Record({
    name: `${subDomainName}-ns`,
    namespace,
    dependencies: { hostedZone: hostedZoneParent, hostedZoneSub },
    properties: ({ dependencies: { hostedZoneSub } }) => {
      assert(hostedZoneSub);
      return {
        Name: `${subDomainName}.`,
        Type: "NS",
        ResourceRecords: pipe([
          () => hostedZoneSub,
          get("live.RecordSet"),
          find(eq(get("Type"), "NS")),
          get("ResourceRecords"),
        ])(),
        TTL: 60,
      };
    },
  });
  return { recordNS, hostedZoneSub };
};

const createS3Resources = async ({ provider }) => {
  const { config } = provider;
  const s3Bucket = await provider.makeS3Bucket({
    name: config.kops.subDomainName,
    namespace,
    properties: () => ({
      VersioningConfiguration: {
        MFADelete: "Disabled",
        Status: "Enabled",
      },
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    }),
  });

  return { s3Bucket };
};
exports.createStack = async ({}) => {
  const provider = AwsProvider({ config: require("./config") });
  const { config } = provider;
  const iamResources = await createIamResources({ provider });
  const route53Resources = await createRoute53Resources({ provider });
  const s3Resources = await createS3Resources({ provider });

  return {
    provider,
    resources: {},
    hooks: [hook],
  };
};
