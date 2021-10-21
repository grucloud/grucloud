const createResources = ({ provider }) => {
  provider.EC2.makeVpc({
    name: "vpc",
    properties: () => ({
      CidrBlock: "192.168.0.0/16",
      DnsSupport: true,
      DnsHostnames: true,
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-private-a",
    properties: () => ({
      CidrBlock: "192.168.96.0/19",
      AvailabilityZone: "eu-west-2a",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-private-b",
    properties: () => ({
      CidrBlock: "192.168.128.0/19",
      AvailabilityZone: "eu-west-2b",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-public-a",
    properties: () => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: "eu-west-2a",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-public-b",
    properties: () => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: "eu-west-2b",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeKeyPair({
    name: "kp-postgres-stateless",
  });

  provider.EC2.makeElasticIpAddress({
    name: "eip-bastion",
  });

  provider.EC2.makeElasticIpAddress({
    name: "iep",
  });

  provider.EC2.makeInternetGateway({
    name: "internet-gateway",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeNatGateway({
    name: "nat-gateway",
    dependencies: ({ resources }) => ({
      subnet: resources.EC2.Subnet.subnetPublicA,
      eip: resources.EC2.ElasticIpAddress.iep,
    }),
  });

  provider.EC2.makeRouteTable({
    name: "route-table-private-a",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
      subnets: [resources.EC2.Subnet.subnetPrivateA],
    }),
  });

  provider.EC2.makeRouteTable({
    name: "route-table-private-b",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
      subnets: [resources.EC2.Subnet.subnetPrivateB],
    }),
  });

  provider.EC2.makeRouteTable({
    name: "route-table-public",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
      subnets: [
        resources.EC2.Subnet.subnetPublicA,
        resources.EC2.Subnet.subnetPublicB,
      ],
    }),
  });

  provider.EC2.makeRoute({
    name: "route-private-a",
    properties: () => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.routeTablePrivateA,
      natGateway: resources.EC2.NatGateway.natGateway,
    }),
  });

  provider.EC2.makeRoute({
    name: "route-private-b",
    properties: () => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.routeTablePrivateB,
      natGateway: resources.EC2.NatGateway.natGateway,
    }),
  });

  provider.EC2.makeRoute({
    name: "route-public",
    properties: () => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.routeTablePublic,
      ig: resources.EC2.InternetGateway.internetGateway,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "security-group-postgres",
    properties: () => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "security-group-public",
    properties: () => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-postgres",
    properties: () => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 5432,
        ToPort: 5432,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupPostgres,
      securityGroupFrom: resources.EC2.SecurityGroup.securityGroupPublic,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-ssh-bastion",
    properties: () => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.securityGroupPublic,
    }),
  });

  provider.EC2.makeInstance({
    name: "bastion",
    properties: () => ({
      InstanceType: "t2.micro",
      ImageId: "ami-056bfe7d8a7bdb9d0",
    }),
    dependencies: ({ resources }) => ({
      subnet: resources.EC2.Subnet.subnetPublicA,
      keyPair: resources.EC2.KeyPair.kpPostgresStateless,
      eip: resources.EC2.ElasticIpAddress.eipBastion,
      securityGroups: [resources.EC2.SecurityGroup.securityGroupPublic],
    }),
  });

  provider.RDS.makeDBCluster({
    name: "cluster-postgres-stateless",
    properties: () => ({
      DatabaseName: "dev",
      Engine: "aurora-postgresql",
      EngineVersion: "10.14",
      EngineMode: "serverless",
      Port: 5432,
      PreferredBackupWindow: "01:39-02:09",
      PreferredMaintenanceWindow: "sun:00:47-sun:01:17",
      ScalingConfiguration: {
        MinCapacity: 2,
        MaxCapacity: 4,
        AutoPause: true,
        SecondsUntilAutoPause: 300,
        TimeoutAction: "RollbackCapacityChange",
      },
      MasterUsername: process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USERNAME,
      MasterUserPassword:
        process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USER_PASSWORD,
    }),
    dependencies: ({ resources }) => ({
      dbSubnetGroup: resources.RDS.DBSubnetGroup.subnetGroupPostgresStateless,
      securityGroups: [resources.EC2.SecurityGroup.securityGroupPostgres],
    }),
  });

  provider.RDS.makeDBSubnetGroup({
    name: "subnet-group-postgres-stateless",
    properties: () => ({
      DBSubnetGroupDescription: "db subnet group",
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet.subnetPrivateA,
        resources.EC2.Subnet.subnetPrivateB,
      ],
    }),
  });
};

exports.createResources = createResources;
