module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-module-aws-eks",
  IAM: {
    Policy: {
      amazonEc2ContainerRegistryReadOnly: {
        name: "AmazonEC2ContainerRegistryReadOnly",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
        },
      },
      amazonEksCniPolicy: {
        name: "AmazonEKS_CNI_Policy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
        },
      },
      amazonEksClusterPolicy: {
        name: "AmazonEKSClusterPolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        },
      },
      amazonEksvpcResourceController: {
        name: "AmazonEKSVPCResourceController",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
        },
      },
      amazonEksWorkerNodePolicy: {
        name: "AmazonEKSWorkerNodePolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
      },
    },
    Role: {
      roleCluster: {
        name: "role-cluster",
        properties: {
          RoleName: "role-cluster",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "eks.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
      roleNodeGroup: {
        name: "role-node-group",
        properties: {
          RoleName: "role-node-group",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "ec2.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
    },
  },
  EC2: {
    Vpc: {
      vpc: {
        name: "vpc",
        properties: {
          CidrBlock: "192.168.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
          ],
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
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/internal-elb",
              Value: "1",
            },
          ],
        },
      },
      subnetPrivateB: {
        name: "subnet-private-b",
        properties: {
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/internal-elb",
              Value: "1",
            },
          ],
        },
      },
      subnetPublicA: {
        name: "subnet-public-a",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/elb",
              Value: "1",
            },
          ],
        },
      },
      subnetPublicB: {
        name: "subnet-public-b",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/elb",
              Value: "1",
            },
          ],
        },
      },
    },
    ElasticIpAddress: {
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
      securityGroupCluster: {
        name: "security-group-cluster",
        properties: {
          Description: "Managed By GruCloud",
        },
      },
      securityGroupNode: {
        name: "security-group-node",
        properties: {
          Description: "Managed By GruCloud",
          Tags: [
            {
              Key: "kubernetes.io/cluster/my-cluster",
              Value: "owned",
            },
          ],
        },
      },
    },
    SecurityGroupRuleIngress: {
      sgClusterRuleIngressHttps: {
        name: "sg-cluster-rule-ingress-https",
        properties: {
          IpPermission: {
            IpProtocol: "tcp",
            FromPort: 443,
            ToPort: 443,
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
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpPermission: {
            IpProtocol: "tcp",
            FromPort: 1025,
            ToPort: 65535,
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
    SecurityGroupRuleEgress: {
      sgClusterRuleEgress: {
        name: "sg-cluster-rule-egress",
        properties: {
          IpPermission: {
            IpProtocol: "tcp",
            FromPort: 1024,
            ToPort: 65535,
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
    LaunchTemplate: {
      ltNodeGroupPrivateCluster: {
        name: "lt-node-group-private-cluster",
        properties: {
          LaunchTemplateData: {
            BlockDeviceMappings: [
              {
                DeviceName: "/dev/xvda",
                Ebs: {
                  DeleteOnTermination: true,
                  VolumeSize: 20,
                  VolumeType: "gp2",
                },
              },
            ],
            ImageId: "ami-06de1935f1242d2d8",
            InstanceType: "t2.small",
            UserData:
              "TUlNRS1WZXJzaW9uOiAxLjAKQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIvLyIKCi0tLy8KQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9InVzLWFzY2lpIgojIS9iaW4vYmFzaApzZXQgLWV4CkI2NF9DTFVTVEVSX0NBPUxTMHRMUzFDUlVkSlRpQkRSVkpVU1VaSlEwRlVSUzB0TFMwdENrMUpTVU0xZWtORFFXTXJaMEYzU1VKQlowbENRVVJCVGtKbmEzRm9hMmxIT1hjd1FrRlJjMFpCUkVGV1RWSk5kMFZSV1VSV1VWRkVSWGR3Y21SWFNtd0tZMjAxYkdSSFZucE5RalJZUkZSSmVFMUVaM2xPZWtVMFRXcFJlazVzYjFoRVZFMTRUVVJuZVU1VVJUUk5hbEY2VG14dmQwWlVSVlJOUWtWSFFURlZSUXBCZUUxTFlUTldhVnBZU25WYVdGSnNZM3BEUTBGVFNYZEVVVmxLUzI5YVNXaDJZMDVCVVVWQ1FsRkJSR2RuUlZCQlJFTkRRVkZ2UTJkblJVSkJUekprQ2xwME0xTnBaamd4Tm5WbWNXODNVek5OVFRKTFdGbGxSVWxKTVhodFdWTmlhRkZVVkRCNlJVMXplVm8wTWtFd2NtaEllRGhoTVhJd01pOWxZM1ZwTWpBS2FYRmpZbUoyY2twVWFFczVhMDQxYmpoTE9HRjRNakpTUjBwdWVERnhUMVl5V21zdlpteE9ZbXRRZUdod2NXWXlPRlpTY1RKUGQxZG9TRW8zWmxsM2NBbzRabWRMVmk5M1NtdE9kbTFNWlRRMmMyeERVM2h1UjFKcFpVbFdRMHh3TlZNMVVGWjZZekphTVVjd0x6Y3JkR1ozVEN0TE9IazRTamgxTDJobVQyOTVDa3RUTTFoTVpHZHZhVzl0Y1ZSaFYyWnRjbEJzVFZoeUszcEpVek5pYTFoeVJtTXpPSGxCVm5odlVHbEhhVEJJTUROSFlscGxWM2w0Yml0WVNHSndOSEFLVjFaeGFsZEZlVTVIVUhWU0swUkZUazVEYmxCM1dUaDNOSE51T0VSblZtc3lTM3A2VmpaMFdrcEZMM1ptYTAxUkwyUTNOVEZNYW5CMmRpc3JSRVJrY1FvME9IazRValpKYUV4cU1rRXhMemxoV1dOalEwRjNSVUZCWVU1RFRVVkJkMFJuV1VSV1VqQlFRVkZJTDBKQlVVUkJaMHRyVFVFNFIwRXhWV1JGZDBWQ0NpOTNVVVpOUVUxQ1FXWTRkMGhSV1VSV1VqQlBRa0paUlVaSWNUTk9lVWR4U1c5cU1VMW5hMVJqVVhOQ01rRk9iVmRDTDFGTlFUQkhRMU54UjFOSllqTUtSRkZGUWtOM1ZVRkJORWxDUVZGRE5uSlRia05OVXpFMVdqVldhVzFQYkU5c2FrTllVR0ZETkROV2RYRjJTV053U0c1WFowVTRaVkpZYm5SR1F6bGFTUXBWUlhNdk4xZFhLM0pQZFZoamVIbDBXbVpyZFV4QlZpOHpiakZIUVhoU1dGTkRjV29yTW1SUWNUQnVaRGN3WjJNNGQyTlljRWQwU3k5d2IwVmxVaXM1Q2s1blIxVnBXV1Z1VDJ4dlJWcDVibXRUUTNKeU9IaERkM0JqUTNoTWVGWXZjR1JrVVZCTGIwdE5ablp2VjBWVVl6UnFZakIwV1c5bEsySmlhR0pHWlVRS1NHUkxURkZLZVZCd05VRldhR1EzYm05Q2FqSTVOMlJtUkVjeGJ6Qm1NV3BFTUVwc2IyOTBZbmw2YUV0TU1WQlhTV05KSzJ4NFlXY3liMFpTT0ZoMFpRcHVkVkV5ZWtSUVduVkVUV3N4ZUd3MFozZDVXbXBKTkVSeldqTTBNekk1ZGpkd01rUjVjMFJ0UkV4dFUzVXZZaTlQVkcxTVpqUlNObk5HYjFGVVQzQkpDakZRYXpSSldpOVJTVlZSUmxjNGNEVlRkRXhHU2xsVlZqaHJSelo0UVZkeFZuVnFhUW90TFMwdExVVk9SQ0JEUlZKVVNVWkpRMEZVUlMwdExTMHRDZz09CkFQSV9TRVJWRVJfVVJMPWh0dHBzOi8vQTU3MERCNTU0Q0JDNjZGNEVCODM3NUI4RDM1Mzc1NTkuZ3I3LmV1LXdlc3QtMi5la3MuYW1hem9uYXdzLmNvbQpLOFNfQ0xVU1RFUl9ETlNfSVA9MTAuMTAwLjAuMTAKL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXIgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgJy0tbm9kZS1sYWJlbHM9ZWtzLmFtYXpvbmF3cy5jb20vbm9kZWdyb3VwLWltYWdlPWFtaS0wNmRlMTkzNWYxMjQyZDJkOCxla3MuYW1hem9uYXdzLmNvbS9jYXBhY2l0eVR5cGU9T05fREVNQU5ELGVrcy5hbWF6b25hd3MuY29tL25vZGVncm91cD1ub2RlLWdyb3VwLXByaXZhdGUtY2x1c3RlcicgLS1iNjQtY2x1c3Rlci1jYSAkQjY0X0NMVVNURVJfQ0EgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgJEFQSV9TRVJWRVJfVVJMIC0tZG5zLWNsdXN0ZXItaXAgJEs4U19DTFVTVEVSX0ROU19JUAoKLS0vLy0t",
            MetadataOptions: {
              HttpPutResponseHopLimit: 2,
            },
          },
          Tags: [
            {
              Key: "eks:cluster-name",
              Value: "my-cluster",
            },
            {
              Key: "eks:nodegroup-name",
              Value: "node-group-private-cluster",
            },
          ],
        },
      },
    },
  },
  EKS: {
    Cluster: {
      myCluster: {
        name: "my-cluster",
        properties: {
          version: "1.20",
        },
      },
    },
    NodeGroup: {
      nodeGroupPrivateCluster: {
        name: "node-group-private-cluster",
        properties: {
          capacityType: "ON_DEMAND",
          scalingConfig: {
            minSize: 1,
            maxSize: 1,
            desiredSize: 1,
          },
          instanceTypes: ["t2.small"],
          amiType: "AL2_x86_64",
          labels: {},
          diskSize: 20,
        },
      },
    },
  },
});
