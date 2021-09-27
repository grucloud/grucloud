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
            ImageId: "ami-098803b2ccca37b36",
            InstanceType: "t2.small",
            UserData:
              "TUlNRS1WZXJzaW9uOiAxLjAKQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIvLyIKCi0tLy8KQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9InVzLWFzY2lpIgojIS9iaW4vYmFzaApzZXQgLWV4CkI2NF9DTFVTVEVSX0NBPUxTMHRMUzFDUlVkSlRpQkRSVkpVU1VaSlEwRlVSUzB0TFMwdENrMUpTVU0xZWtORFFXTXJaMEYzU1VKQlowbENRVVJCVGtKbmEzRm9hMmxIT1hjd1FrRlJjMFpCUkVGV1RWSk5kMFZSV1VSV1VWRkVSWGR3Y21SWFNtd0tZMjAxYkdSSFZucE5RalJZUkZSSmVFMUVhM2xOYWtVeVRYcFZkMDVXYjFoRVZFMTRUVVJyZVUxRVJUSk5lbFYzVGxadmQwWlVSVlJOUWtWSFFURlZSUXBCZUUxTFlUTldhVnBZU25WYVdGSnNZM3BEUTBGVFNYZEVVVmxLUzI5YVNXaDJZMDVCVVVWQ1FsRkJSR2RuUlZCQlJFTkRRVkZ2UTJkblJVSkJUM1kzQ2pSTE1UUTJlaXRHZW5nMVdGVTBPV0poT1ZkTUswaE1hM0U0WjFKcGJHWjVWaXRNWTNwMFVXNVpPSHBrU2pSdVpsTkhiM05KZUZOUVJIWXhWa2hrTmxBS1YyNVZNVmhUV2xOMmQxTmphMWsxS3padWJsQklkbGxvWmxreFlWTnZNRFZMUms1alptZHZibkJPVVVoT2J5OVRZbll5V1VWd1dERTFVV0Z2Vms1cWJRcFpSR1oxUVdJd2RWUXJXVkJyV2t0RlFrMUNNSGd3ZUdKbVlrODVaRzVhWldWbVVGbEhNVWhsY0V4TlZuRnhSMGN2T1VkV04zVnZkSFJEY1dWbVEwbFhDakJLYzJWcUx5dGtTMjloZVhGSU9DOUZlVWR1TUV0MGNFRm1hQ3N4TUhad2Iyb3JhVU4yWVV0NlFqTk9hRE5HV21JelRUaHZkMXBRWXpsMk9FeG1kMG9LWVVJeFdtSndOVEJhY2t4a2NqZDFla3RUWjI5VlJ6WkRVbWw2U0hFNVNFeFhObU5XY2xKSlVVeHpUbVkwWkdVMFRFeEZZblpVWldsMVppOTBLMEUzY0Fwd2IzaEJaVXhJVms4Mk9XZGhkSGhtVWtGTlEwRjNSVUZCWVU1RFRVVkJkMFJuV1VSV1VqQlFRVkZJTDBKQlVVUkJaMHRyVFVFNFIwRXhWV1JGZDBWQ0NpOTNVVVpOUVUxQ1FXWTRkMGhSV1VSV1VqQlBRa0paUlVaQlNtNTRWSFJoV25kb2FITndOVTVFZW1vMlMwVkpSVGxySzBWTlFUQkhRMU54UjFOSllqTUtSRkZGUWtOM1ZVRkJORWxDUVZGRFZFWjJiRVY2TTFWM1JHTmFSbFkyY1Znd1lXbDFVa1FyWlZNd1NETnhSMUp0TkRKbFJIaDBUMU13YTNSTUsyeENSUW80Y0ZwTk1VRm9kbEp6YVdGM2JuUnFNMGs0YW5OYVVFODVTWHBoYkVGcFVuazFkbkI1ZGxCYVV6ZE5TVkJrUnpkRWNrVTBRV2t4U25seWJrNVhZMWh1Q2s1WldVSnpjbWg2YVRoWk5WbzFTVTFxUzNwcmQyOVlUM0ZST0hoeFVrRmFaVkJrYzBkcGJWTnBZVWtyTUZnck5qRXdWR2xTTWsxS09FNVdkR3hsTURNS1pqWlNUbWwyYUNzNFIxUnBjbGxqWld3d2JISkZaQ3R4ZGxkSmN6bEtXREZOU3pjcmMwNXBNMGhEZEd0T1pIRmhjRXhqUW13NFZHbDRNRk52WjB4a1ZBcFpXVWt2UVdvelMyMWpiSGRFUm0weWMzcHlXRXRtZWpOM1lsSnhOVXBOY1dZd09XNWtNSEZ5YkZwQ1VWZG5UVkZsUkZaTWRtcE5SMkpOUnpkMFZUUnFDbTV5ZVhwRVZ6Uk9ObGhqVW10eVIxRm9Wams1YlVKVFN6RnVieTkyWWxwcVZuaHRWd290TFMwdExVVk9SQ0JEUlZKVVNVWkpRMEZVUlMwdExTMHRDZz09CkFQSV9TRVJWRVJfVVJMPWh0dHBzOi8vOTExRjE5NEQ3N0U0MThCOTMwMTdGMDAwMUY4RTkzOUQuZ3I3LmV1LXdlc3QtMi5la3MuYW1hem9uYXdzLmNvbQpLOFNfQ0xVU1RFUl9ETlNfSVA9MTAuMTAwLjAuMTAKL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXIgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgJy0tbm9kZS1sYWJlbHM9ZWtzLmFtYXpvbmF3cy5jb20vbm9kZWdyb3VwLWltYWdlPWFtaS0wOTg4MDNiMmNjY2EzN2IzNixla3MuYW1hem9uYXdzLmNvbS9jYXBhY2l0eVR5cGU9T05fREVNQU5ELGVrcy5hbWF6b25hd3MuY29tL25vZGVncm91cD1ub2RlLWdyb3VwLXByaXZhdGUtY2x1c3RlcicgLS1iNjQtY2x1c3Rlci1jYSAkQjY0X0NMVVNURVJfQ0EgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgJEFQSV9TRVJWRVJfVVJMIC0tZG5zLWNsdXN0ZXItaXAgJEs4U19DTFVTVEVSX0ROU19JUAoKLS0vLy0t",
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
          version: "1.21",
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
