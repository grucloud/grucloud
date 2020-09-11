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
          { IAM: ["aws/resources/IAM/IamUser"] },
          { S3: ["aws/resources/S3/S3Bucket"] },
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
          "google/resources/Network",
          "google/resources/SubNetwork",
          "google/resources/Firewall",
          "google/resources/Address",
          "google/resources/VmInstance",
          "google/resources/ServiceAccount",
        ],
      },
      "google/GoogleMisc",
    ],
  },
};
