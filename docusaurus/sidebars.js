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
          "aws/resources/KeyPair",
          "aws/resources/Vpc",
          "aws/resources/Subnet",
          "aws/resources/SecurityGroup",
          "aws/resources/EC2",
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
        Resources: ["google/resources/Address", "google/resources/VmInstance"],
      },
      "google/GoogleMisc",
    ],
  },
};
