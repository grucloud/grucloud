module.exports = ({ stage }) => ({
  projectName: "rds-postgres",
  ec2: {
    Vpc: {
      vpcPostgres: {
        name: "vpc-postgres",
        properties: {
          CidrBlock: "192.168.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
        },
      },
    },
    Subnet: {
      subnet_1: {
        name: "subnet-1",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnet_2: {
        name: "subnet-2",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
    },
    InternetGateway: {
      igPostgres: {
        name: "ig-postgres",
      },
    },
    RouteTable: {
      routeTablePublic: {
        name: "route-table-public",
      },
    },
    Route: {
      routePublic: {
        name: "route-public",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
    },
    SecurityGroup: {
      securityGroup: {
        name: "security-group",
        properties: {
          Description: "Security Group Postgres",
        },
      },
    },
    SecurityGroupRuleIngress: {
      sgRuleIngressPostgres: {
        name: "sg-rule-ingress-postgres",
        properties: {
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
        },
      },
    },
  },
  rds: {
    DBInstance: {
      dbInstance: {
        name: "db-instance",
        properties: {
          DBInstanceClass: "db.t2.micro",
          Engine: "postgres",
          EngineVersion: "12.5",
          AllocatedStorage: 20,
          MaxAllocatedStorage: 1000,
          PubliclyAccessible: true,
          PreferredBackupWindow: "02:54-03:24",
          BackupRetentionPeriod: 1,
          MasterUsername: process.env.DB_INSTANCE_MASTER_USERNAME,
          MasterUserPassword: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,
        },
      },
    },
    DBSubnetGroup: {
      subnetGroupPostgres: {
        name: "subnet-group-postgres",
        properties: {
          DBSubnetGroupDescription: "db subnet group",
        },
      },
    },
  },
});
