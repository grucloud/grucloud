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
        resources.EC2.Subnet["SubnetPrivateUSEAST1D"],
        resources.EC2.Subnet["SubnetPrivateUSEAST1F"],
        resources.EC2.Subnet["SubnetPublicUSEAST1D"],
        resources.EC2.Subnet["SubnetPublicUSEAST1F"],
      ],
      securityGroups: [
        resources.EC2.SecurityGroup["ControlPlaneSecurityGroup"],
      ],
      role: resources.IAM.Role[
        "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB"
      ],
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
      cluster: resources.EKS.Cluster["my-cluster"],
      subnets: [
        resources.EC2.Subnet["SubnetPublicUSEAST1D"],
        resources.EC2.Subnet["SubnetPublicUSEAST1F"],
      ],
      role: resources.IAM.Role[
        "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI"
      ],
      launchTemplate:
        resources.EC2.LaunchTemplate["eksctl-my-cluster-nodegroup-ng-1"],
    }),
  });
};

exports.createResources = createResources;
