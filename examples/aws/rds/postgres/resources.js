const createResources = ({ provider }) => {
  provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: ({ config }) => ({
      PolicyName: "lambda-policy",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  });

  provider.EC2.makeVpc({
    name: "vpc-postgres",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/16",
      DnsSupport: true,
      DnsHostnames: true,
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-1",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: "eu-west-2a",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcPostgres,
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-2",
    properties: ({ config }) => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: "eu-west-2b",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcPostgres,
    }),
  });

  provider.EC2.makeInternetGateway({
    name: "ig-postgres",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcPostgres,
    }),
  });

  provider.EC2.makeRouteTable({
    name: "route-table-public",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcPostgres,
      subnets: [resources.EC2.Subnet.subnet_1, resources.EC2.Subnet.subnet_2],
    }),
  });

  provider.EC2.makeRoute({
    name: "route-public",
    properties: ({ config }) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable.routeTablePublic,
      ig: resources.EC2.InternetGateway.igPostgres,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "security-group",
    properties: ({ config }) => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpcPostgres,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-postgres",
    properties: ({ config }) => ({
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
      securityGroup: resources.EC2.SecurityGroup.securityGroup,
    }),
  });

  provider.KMS.makeKey({
    name: "secret-key-test",
  });

  provider.RDS.makeDBInstance({
    name: "db-instance",
    properties: ({ config }) => ({
      DBInstanceClass: "db.t2.micro",
      Engine: "postgres",
      EngineVersion: "12.5",
      AllocatedStorage: 20,
      MaxAllocatedStorage: 1000,
      PubliclyAccessible: true,
      PreferredBackupWindow: "22:10-22:40",
      PreferredMaintenanceWindow: "fri:23:40-sat:00:10",
      BackupRetentionPeriod: 1,
      MasterUsername: process.env.DB_INSTANCE_MASTER_USERNAME,
      MasterUserPassword: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,
    }),
    dependencies: ({ resources }) => ({
      dbSubnetGroup: resources.RDS.DBSubnetGroup.subnetGroupPostgres,
      securityGroups: [resources.EC2.SecurityGroup.securityGroup],
    }),
  });

  provider.RDS.makeDBSubnetGroup({
    name: "subnet-group-postgres",
    properties: ({ config }) => ({
      DBSubnetGroupDescription: "db subnet group",
    }),
    dependencies: ({ resources }) => ({
      subnets: [resources.EC2.Subnet.subnet_1, resources.EC2.Subnet.subnet_2],
    }),
  });
};

exports.createResources = createResources;
