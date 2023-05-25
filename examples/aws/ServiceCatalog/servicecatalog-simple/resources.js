// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AdminRole",
      Description:
        "Allows Service Catalog to access AWS resources on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "servicecatalog.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AdministratorAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "SC-Constrain",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "servicecatalog.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonEC2FullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEC2FullAccess",
        },
        {
          PolicyName: "AmazonS3ReadOnlyAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess",
        },
        {
          PolicyName: "AmazonSSMFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMFullAccess",
        },
        {
          PolicyName: "AmazonVPCFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonVPCFullAccess",
        },
        {
          PolicyName: "AWSCloudFormationFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AWSCloudFormationFullAccess",
        },
        {
          PolicyName: "AWSKeyManagementServicePowerUser",
          PolicyArn: "arn:aws:iam::aws:policy/AWSKeyManagementServicePowerUser",
        },
        {
          PolicyName: "AWSServiceCatalogAdminFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AWSServiceCatalogAdminFullAccess",
        },
        {
          PolicyName: "IAMFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/IAMFullAccess",
        },
      ],
    }),
  },
  {
    type: "OrganisationalUnit",
    group: "Organisations",
    name: "e2etest",
    readOnly: true,
    properties: ({}) => ({
      Name: "e2etest",
    }),
    dependencies: ({}) => ({
      root: "Root",
    }),
  },
  {
    type: "Root",
    group: "Organisations",
    name: "Root",
    readOnly: true,
    properties: ({}) => ({
      Name: "Root",
      PolicyTypes: [
        {
          Status: "ENABLED",
          Type: "TAG_POLICY",
        },
        {
          Status: "ENABLED",
          Type: "SERVICE_CONTROL_POLICY",
        },
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `cf-templates-x7lcu52auzd7-${config.region}`,
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
  },
  {
    type: "Object",
    group: "S3",
    properties: ({ config }) => ({
      Key: "2023-03-06T231452.907Z0w7-sc-roles.yaml",
      ContentType: "application/octet-stream",
      ServerSideEncryption: "AES256",
      source: `s3/cf-templates-x7lcu52auzd7-${config.region}/2023-03-06T231452.907Z0w7-sc-roles.yaml`,
    }),
    dependencies: ({ config }) => ({
      bucket: `cf-templates-x7lcu52auzd7-${config.region}`,
    }),
  },
  {
    type: "Object",
    group: "S3",
    properties: ({ config }) => ({
      Key: "servicecatalog-product-2023065qIW-Network.yaml",
      ContentType: "application/octet-stream",
      ServerSideEncryption: "AES256",
      source: `s3/cf-templates-x7lcu52auzd7-${config.region}/servicecatalog-product-2023065qIW-Network.yaml`,
    }),
    dependencies: ({ config }) => ({
      bucket: `cf-templates-x7lcu52auzd7-${config.region}`,
    }),
  },
  {
    type: "Constraint",
    group: "ServiceCatalog",
    properties: ({ config }) => ({
      Description: `Launch as arn:aws:iam::${config.accountId()}:role/SC-Constrain`,
      Type: "LAUNCH",
      Parameters: {},
    }),
    dependencies: ({}) => ({
      iamRole: "SC-Constrain",
      portfolio: "my-portfolio",
      product: "Vpc",
    }),
  },
  {
    type: "OrganizationsAccess",
    group: "ServiceCatalog",
    properties: ({}) => ({
      AccessStatus: "ENABLED",
    }),
  },
  {
    type: "Portfolio",
    group: "ServiceCatalog",
    properties: ({}) => ({
      DisplayName: "my-portfolio",
      ProviderName: "ops",
    }),
  },
  {
    type: "PortfolioShare",
    group: "ServiceCatalog",
    properties: ({}) => ({
      SharePrincipals: false,
      ShareTagOptions: false,
      OrganizationNode: {
        Type: "ORGANIZATIONAL_UNIT",
      },
    }),
    dependencies: ({}) => ({
      organizationsAccess: "default",
      organisationalUnit: "e2etest",
      portfolio: "my-portfolio",
    }),
  },
  {
    type: "Product",
    group: "ServiceCatalog",
    properties: ({}) => ({
      Name: "Vpc",
      Owner: "ops",
      ProvisioningArtifactParameters: {
        Name: "v1",
        Type: "CLOUD_FORMATION_TEMPLATE",
      },
      Description: "Vpc",
      ProductType: "CLOUD_FORMATION_TEMPLATE",
    }),
    dependencies: ({ config }) => ({
      s3Template: `cf-templates-x7lcu52auzd7-${config.region}/servicecatalog-product-2023065qIW-Network.yaml`,
    }),
  },
  {
    type: "ProductPortfolioAssociation",
    group: "ServiceCatalog",
    dependencies: ({}) => ({
      portfolio: "my-portfolio",
      product: "Vpc",
    }),
  },
  {
    type: "PrincipalPortfolioAssociation",
    group: "ServiceCatalog",
    properties: ({}) => ({
      PrincipalType: "IAM",
    }),
    dependencies: ({}) => ({
      iamRole: "AdminRole",
      portfolio: "my-portfolio",
    }),
  },
  {
    type: "ProvisioningArtifact",
    group: "ServiceCatalog",
    properties: ({}) => ({
      Parameters: {
        Name: "v2",
        Type: "CLOUD_FORMATION_TEMPLATE",
        Info: {},
      },
    }),
    dependencies: ({ config }) => ({
      product: "Vpc",
      s3Template: `cf-templates-x7lcu52auzd7-${config.region}/servicecatalog-product-2023065qIW-Network.yaml`,
    }),
  },
  {
    type: "ServiceAction",
    group: "ServiceCatalog",
    properties: ({}) => ({
      DefinitionType: "SSM_AUTOMATION",
      Description: "Delete CloudFormation Stack",
      Name: "AWS-DeleteCloudFormationStack",
      Definition: {
        Name: "AWS-DeleteCloudFormationStack",
        Parameters: [
          {
            Name: "StackNameOrId",
            Type: "TARGET",
          },
        ],
        Version: "1",
      },
    }),
  },
  {
    type: "ServiceActionAssociation",
    group: "ServiceCatalog",
    dependencies: ({}) => ({
      serviceAction: "AWS-DeleteCloudFormationStack",
      provisioningArtifact: "Vpc::v2",
    }),
  },
  {
    type: "TagOption",
    group: "ServiceCatalog",
    properties: ({}) => ({
      Key: "mykey",
      Value: "myvalue",
    }),
  },
  {
    type: "TagOptionResourceAssociation",
    group: "ServiceCatalog",
    dependencies: ({}) => ({
      product: "Vpc",
      tagOption: "mykey",
    }),
  },
];