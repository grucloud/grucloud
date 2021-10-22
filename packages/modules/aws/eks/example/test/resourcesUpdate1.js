const createResources = ({ provider }) => {
  provider.EKS.makeCluster({
    name: "my-cluster",
    properties: ({ config }) => ({
      version: "1.20",
      resourcesVpcConfig: {
        endpointPublicAccess: false,
        endpointPrivateAccess: true,
      },
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet.subnetPrivateUseast1C,
        resources.EC2.Subnet.subnetPrivateUseast1F,
        resources.EC2.Subnet.subnetPublicUseast1C,
        resources.EC2.Subnet.subnetPublicUseast1F,
      ],
      securityGroups: [resources.EC2.SecurityGroup.controlPlaneSecurityGroup],
      role: resources.IAM.Role.eksctlMyClusterClusterServiceRole_1X24Aqf8Lrqdl,
    }),
  });

  provider.EKS.makeNodeGroup({
    name: "ng-1",
    properties: ({ config }) => ({
      capacityType: "ON_DEMAND",
      scalingConfig: {
        minSize: 1,
        maxSize: 2,
        desiredSize: 2,
      },
      labels: {
        "alpha.eksctl.io/nodegroup-name": "ng-1",
        "alpha.eksctl.io/cluster-name": "my-cluster",
      },
    }),
    dependencies: ({ resources }) => ({
      cluster: resources.EKS.Cluster.myCluster,
      subnets: [
        resources.EC2.Subnet.subnetPublicUseast1C,
        resources.EC2.Subnet.subnetPublicUseast1F,
      ],
      role: resources.IAM.Role
        .eksctlMyClusterNodegroupNg_1NodeInstanceRole_1H4Gn851M2Nx6,
      launchTemplate: resources.EC2.LaunchTemplate.ltNg_1,
    }),
  });
};

exports.createResources = createResources;
