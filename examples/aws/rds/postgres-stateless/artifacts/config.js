module.exports = ({ stage }) => ({
  projectName: "rds-postgres-stateless",
  ec2: {
    Vpc: {
      vpc: {
        name: "vpc",
        properties: {
          CidrBlock: "192.168.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
        },
      },
    },
    Subnet: {
      subnetPrivateA: {
        name: "subnet-private-a",
        properties: {
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPrivateB: {
        name: "subnet-private-b",
        properties: {
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPublicA: {
        name: "subnet-public-a",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
      subnetPublicB: {
        name: "subnet-public-b",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
        },
      },
    },
    KeyPair: {
      kpPostgresStateless: {
        name: "kp-postgres-stateless",
      },
    },
    ElasticIpAddress: {
      eipBastion: {
        name: "eip-bastion",
      },
      iep: {
        name: "iep",
      },
    },
    InternetGateway: {
      internetGateway: {
        name: "internet-gateway",
      },
    },
    NatGateway: {
      natGateway: {
        name: "nat-gateway",
      },
    },
    RouteTable: {
      routeTablePrivateA: {
        name: "route-table-private-a",
      },
      routeTablePrivateB: {
        name: "route-table-private-b",
      },
      routeTablePublic: {
        name: "route-table-public",
      },
    },
    Route: {
      routePrivateA: {
        name: "route-private-a",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
      routePrivateB: {
        name: "route-private-b",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
      routePublic: {
        name: "route-public",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
    },
    SecurityGroup: {
      securityGroupPostgres: {
        name: "security-group-postgres",
        properties: {
          Description: "Managed By GruCloud",
        },
      },
      securityGroupPublic: {
        name: "security-group-public",
        properties: {
          Description: "Managed By GruCloud",
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
      sgRuleIngressSshBastion: {
        name: "sg-rule-ingress-ssh-bastion",
        properties: {
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
        },
      },
    },
    Instance: {
      bastion: {
        name: "bastion",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-084a1f89b0bb0f729",
        },
      },
    },
  },
  rds: {
    DBCluster: {
      clusterPostgresStateless: {
        name: "cluster-postgres-stateless",
        properties: {
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
          MasterUsername:
            process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USERNAME,
          MasterUserPassword:
            process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USER_PASSWORD,
        },
      },
    },
    DBSubnetGroup: {
      subnetGroupPostgresStateless: {
        name: "subnet-group-postgres-stateless",
        properties: {
          DBSubnetGroupDescription: "db subnet group",
        },
      },
    },
  },
});
