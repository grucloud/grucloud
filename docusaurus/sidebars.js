module.exports = {
  someSidebar: {
    Introduction: ["TLDR"],
    "Command Line Interface": [
      "cli/gc",
      "cli/PlanQuery",
      "cli/PlanApply",
      "cli/List",
      "cli/PlanDestroy",
    ],
    Requirements: ["Requirements"],
    "User Guide": ["DeveloperGuide"],
    "Amazon Web Service": [
      "aws/AwsRequirements",
      "aws/AwsGettingStarted",
      "aws/AwsConfig",
      {
        Resources: [
          {
            EC2: [
              "aws/resources/EC2/KeyPair",
              "aws/resources/EC2/Vpc",
              "aws/resources/EC2/InternetGateway",
              "aws/resources/EC2/RouteTables",
              "aws/resources/EC2/Subnet",
              "aws/resources/EC2/SecurityGroup",
              "aws/resources/EC2/EC2",
              "aws/resources/EC2/ElasticIpAddress",
            ],
          },
          {
            IAM: [
              "aws/resources/IAM/IamInstanceProfile",
              "aws/resources/IAM/IamGroup",
              "aws/resources/IAM/IamPolicy",
              "aws/resources/IAM/IamRole",
              "aws/resources/IAM/IamUser",
            ],
          },
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
      "azure/AzureMisc",
    ],
    "Google Cloud Platform": [
      "google/GoogleRequirements",
      "google/GoogleGettingStarted",
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
  },
};
