module.exports = {
  someSidebar: {
    Introduction: ["TLDR"],
    "Command Line Interface": [
      "cli/gc",
      "cli/Init",
      "cli/PlanQuery",
      "cli/PlanApply",
      "cli/List",
      "cli/PlanDestroy",
    ],
    Requirements: ["Requirements"],

    "Amazon Web Service": [
      "aws/AwsRequirements",
      "aws/AwsGettingStarted",
      "aws/AwsConfig",
      "aws/AwsExamples",
      {
        Resources: [
          { ACM: ["aws/resources/ACM/AcmCertificate"] },
          { CloudFront: ["aws/resources/CloudFront/CloudFrontDistribution"] },
          {
            EC2: [
              "aws/resources/EC2/KeyPair",
              "aws/resources/EC2/Vpc",
              "aws/resources/EC2/InternetGateway",
              "aws/resources/EC2/NatGateway",
              "aws/resources/EC2/RouteTables",
              "aws/resources/EC2/Route",
              "aws/resources/EC2/Subnet",
              "aws/resources/EC2/SecurityGroup",
              "aws/resources/EC2/EC2",
              "aws/resources/EC2/ElasticIpAddress",
              "aws/resources/EC2/Volume",
            ],
          },
          { EKS: ["aws/resources/EKS/EksCluster"] },
          {
            IAM: [
              "aws/resources/IAM/IamInstanceProfile",
              "aws/resources/IAM/IamGroup",
              "aws/resources/IAM/IamPolicy",
              "aws/resources/IAM/IamPolicyReadOnly",
              "aws/resources/IAM/IamRole",
              "aws/resources/IAM/IamUser",
            ],
          },
          {
            Route53: [
              "aws/resources/Route53/Route53HostedZone",
              "aws/resources/Route53/Route53Record",
            ],
          },
          { Route53Domain: ["aws/resources/Route53Domain/Route53Domain"] },
          { S3: ["aws/resources/S3/S3Bucket", "aws/resources/S3/S3Object"] },
        ],
      },
      "aws/AwsMisc",
    ],
    "Microsoft Azure": [
      "azure/AzureRequirements",
      "azure/AzureGettingStarted",
      {
        Resources: [
          "azure/resources/ResourceGroup",
          "azure/resources/VirtualNetwork",
          "azure/resources/SecurityGroup",
          "azure/resources/PublicIpAddress",
          "azure/resources/NetworkInterface",
          "azure/resources/VirtualMachine",
        ],
      },
      "azure/AzureExamples",
      "azure/AzureMisc",
    ],
    "Google Cloud Platform": [
      "google/GoogleRequirements",
      "google/GoogleGettingStarted",
      "google/GoogleExamples",
      {
        Resources: [
          {
            Compute: [
              "google/resources/Compute/Address",
              "google/resources/Compute/BackendBucket",
              "google/resources/Compute/Firewall",
              "google/resources/Compute/GlobalForwardingRule",
              "google/resources/Compute/HttpsTargetProxy",
              "google/resources/Compute/Network",
              "google/resources/Compute/SslCertificate",
              "google/resources/Compute/SubNetwork",
              "google/resources/Compute/UrlMap",
              "google/resources/Compute/VmInstance",
            ],
          },
          {
            IAM: [
              "google/resources/IAM/IamPolicy",
              "google/resources/IAM/IamMember",
              "google/resources/IAM/ServiceAccount",
            ],
          },
          {
            Storage: [
              "google/resources/storage/GcpBucket",
              "google/resources/storage/GcpObject",
            ],
          },
          {
            DNS: ["google/resources/DNS/DnsManagedZone"],
          },
        ],
      },
      "google/GoogleMisc",
    ],
    "User Guide": ["DeveloperGuide"],
  },
};
