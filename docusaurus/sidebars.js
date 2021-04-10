module.exports = {
  someSidebar: {
    Introduction: ["Introduction"],
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
      "aws/AwsModules",
      "aws/AwsResourceHowto",
      "aws/AwsModuleHowto",

      {
        Resources: [
          { ACM: ["aws/resources/ACM/AcmCertificate"] },
          { AutoScaling: ["aws/resources/AutoScaling/AutoScalingGroup"] },
          { CloudFront: ["aws/resources/CloudFront/CloudFrontDistribution"] },
          {
            EC2: [
              "aws/resources/EC2/KeyPair",
              "aws/resources/EC2/Vpc",
              "aws/resources/EC2/InternetGateway",
              "aws/resources/EC2/NatGateway",
              "aws/resources/EC2/RouteTable",
              "aws/resources/EC2/Route",
              "aws/resources/EC2/Subnet",
              "aws/resources/EC2/SecurityGroup",
              "aws/resources/EC2/EC2",
              "aws/resources/EC2/ElasticIpAddress",
              "aws/resources/EC2/Volume",
            ],
          },
          {
            EKS: [
              "aws/resources/EKS/EksCluster",
              "aws/resources/EKS/EksNodeGroup",
            ],
          },
          {
            ELB: ["aws/resources/ELB/AwsLoadBalancer"],
          },
          {
            IAM: [
              "aws/resources/IAM/IamInstanceProfile",
              "aws/resources/IAM/IamGroup",
              "aws/resources/IAM/IamOpenIDConnectProvider",
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
    Kubernetes: [
      "k8s/K8sRequirements",
      "k8s/K8sGettingStarted",
      {
        Resources: [
          "k8s/resources/ConfigMap",
          "k8s/resources/ClusterRole",
          "k8s/resources/ClusterRoleBinding",
          "k8s/resources/Deployment",
          "k8s/resources/Ingress",
          "k8s/resources/Namespace",
          "k8s/resources/PersistentVolume",
          "k8s/resources/PersistentVolumeClaim",
          "k8s/resources/Role",
          "k8s/resources/RoleBinding",
          "k8s/resources/Secret",
          "k8s/resources/Service",
          "k8s/resources/ServiceAccount",
          "k8s/resources/StatefulSet",
        ],
      },
      "k8s/K8sExamples",
      "k8s/K8sModules",
    ],
    "User Guide": ["DeveloperGuide"],
  },
};
