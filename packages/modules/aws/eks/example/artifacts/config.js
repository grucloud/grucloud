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
            ImageId: "ami-0b697bebb60ea5073",
            InstanceType: "t2.small",
            UserData:
              "TUlNRS1WZXJzaW9uOiAxLjAKQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIvLyIKCi0tLy8KQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9InVzLWFzY2lpIgojIS9iaW4vYmFzaApzZXQgLWV4CkI2NF9DTFVTVEVSX0NBPUxTMHRMUzFDUlVkSlRpQkRSVkpVU1VaSlEwRlVSUzB0TFMwdENrMUpTVU0xZWtORFFXTXJaMEYzU1VKQlowbENRVVJCVGtKbmEzRm9hMmxIT1hjd1FrRlJjMFpCUkVGV1RWSk5kMFZSV1VSV1VWRkVSWGR3Y21SWFNtd0tZMjAxYkdSSFZucE5RalJZUkZSSmVFMUVhM2RPYWtWNFRrUkpNVTFzYjFoRVZFMTRUVVJyZDA1RVJYaE9SRWt4VFd4dmQwWlVSVlJOUWtWSFFURlZSUXBCZUUxTFlUTldhVnBZU25WYVdGSnNZM3BEUTBGVFNYZEVVVmxLUzI5YVNXaDJZMDVCVVVWQ1FsRkJSR2RuUlZCQlJFTkRRVkZ2UTJkblJVSkJURWhIQ21OalVsTjNXREphYlZoVk1WQXJaRk5aTWtWR01tZFRiVEpoY2tSa2FUSkxSVE50WjFscFN6aFdORU5XTDAxQ1QzWkVOQ3RaZEVVeVZIVm1hbVJWZW1NS01qVmtMMUZKUkcxa1NDdDBNMDl3Ym5oVE9YVmtlRFpSZHk4NE9YWXZNaTlwV1RrclYxTm5TSGxMUmtWb1VWVTBjaXRRTDNFMmNtbEtXRzVwUjBkWFl3cFVlbFppWVZwV01EaFBSSGRHTDNka1MzbHFWVFJ0TDNRMFMzWnVVUzlpYlVoaE0xSTNXblZSWkVadlVUUTFaQzlPTnpReVdVdHRVbmRGYjFneGFTOW5DakZZUzJsd1VsWk5hSGR3U3l0Q09YcFBMM0puVERrNFMxQktRbWcwVnpsRmIyUmpMMlZzVWl0TGRGSlJZeTgzY1hvMVRETnJTVWxPWW1oVlJrRTRjbElLWkRobE1GbHZUVE15YlZoNlFVZE5ibU5CUTJ4NGJtTmxVRVU0V25BdlpUSlBaMlZYYmlzeVNFTm1PRlZQWXl0bGVuUlNhbFp3YzNWdk1UVlNWSEU0VUFwQ2FtMXlORzlMYTFvNWFtOUlaREp6UjNRNFEwRjNSVUZCWVU1RFRVVkJkMFJuV1VSV1VqQlFRVkZJTDBKQlVVUkJaMHRyVFVFNFIwRXhWV1JGZDBWQ0NpOTNVVVpOUVUxQ1FXWTRkMGhSV1VSV1VqQlBRa0paUlVaUGNEYzBTSEJoUzJzdmIwbzJXV01yZFdSRll6bG9aVXhLU1ZsTlFUQkhRMU54UjFOSllqTUtSRkZGUWtOM1ZVRkJORWxDUVZGQ1FtbFlUbTFWYldkQloxWnBRVVIyZDFkTlZXazBjRU5VWmxObFJGaHVRMWhNYm1aSlZVSlFkWGRMVmpWTVRWUkdOQW81YTJOMlQzSkNialp0VnpGTVJERldOMFZ5ZEVzelMzTXlSMk0wVmxjeFEzSXJiSFZYTm04NWFqSTVjV2d3Vm10Tll6WkJVV1pvZFhGVmFXaFFNR0V3Q2tOVVFTdDRTR2c1VkVaVEszVXlXakIyY1VVcmVuZEJXa3RZUW01UGVtdHRVMU5MU0VZeGJGZDJTV2s0YlVzcmVETlRXbEZvY0ROdWFERkllR2xaUlZBS1VHTnhNekIwY1ZCQ05uSjRXbEZFYzIwMWRIcFpURmd6VWpNelNVRXJlSGxzYlRaaFZtZG1ObFJWYURoU1J6VnBiV0ZGU1djd1NIWlFaa3B4ZVN0ckx3cFdiM2t5Y0ZCc1NIRnVVbGh5TDFsdFNURTJjblJ0VEZGMldtaFJZeXR0YjBSNFpWaHVNamhQYVhoTFpHbFZVMnRoU2tVdmVIb3lUQzlWVmpSalFsaGpDbFJOZVdrMlQzVkJZWE56UmsxSVRGRjBNMU50TlRaQlZtNTVXVVp0WWtaSFdIaE5Sd290TFMwdExVVk9SQ0JEUlZKVVNVWkpRMEZVUlMwdExTMHRDZz09CkFQSV9TRVJWRVJfVVJMPWh0dHBzOi8vREU5NDREQ0MyREUyQjE1Rjc0QTE4MkREOEUzODdEOTcuZ3I3LmV1LXdlc3QtMi5la3MuYW1hem9uYXdzLmNvbQpLOFNfQ0xVU1RFUl9ETlNfSVA9MTAuMTAwLjAuMTAKL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXIgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgJy0tbm9kZS1sYWJlbHM9ZWtzLmFtYXpvbmF3cy5jb20vbm9kZWdyb3VwLWltYWdlPWFtaS0wYjY5N2JlYmI2MGVhNTA3Myxla3MuYW1hem9uYXdzLmNvbS9jYXBhY2l0eVR5cGU9T05fREVNQU5ELGVrcy5hbWF6b25hd3MuY29tL25vZGVncm91cD1ub2RlLWdyb3VwLXByaXZhdGUtY2x1c3RlcicgLS1iNjQtY2x1c3Rlci1jYSAkQjY0X0NMVVNURVJfQ0EgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgJEFQSV9TRVJWRVJfVVJMIC0tZG5zLWNsdXN0ZXItaXAgJEs4U19DTFVTVEVSX0ROU19JUAoKLS0vLy0t",
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
