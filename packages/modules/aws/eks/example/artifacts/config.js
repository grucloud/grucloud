module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-module-aws-eks",
  iam: {
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
  ec2: {
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
      eksClusterSgMyCluster_1909614887: {
        name: "eks-cluster-sg-my-cluster-1909614887",
        properties: {
          Description:
            "EKS created security group applied to ENI that is attached to EKS Control Plane master nodes, as well as any managed workloads.",
          Tags: [
            {
              Key: "kubernetes.io/cluster/my-cluster",
              Value: "owned",
            },
          ],
        },
      },
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
      eksClusterSgMyCluster_1909614887RuleIngressAllFromEksClusterSgMyCluster_1909614887:
        {
          name: "eks-cluster-sg-my-cluster-1909614887-rule-ingress-all-from-eks-cluster-sg-my-cluster-1909614887",
          properties: {
            IpPermission: {
              IpProtocol: "-1",
              FromPort: -1,
              ToPort: -1,
            },
          },
        },
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
      eks_70bdc1baBd70_6598C620_7ed97878945d: {
        name: "eks-70bdc1ba-bd70-6598-c620-7ed97878945d",
        properties: {
          LaunchTemplateData: {
            IamInstanceProfile: {
              Name: "eks-70bdc1ba-bd70-6598-c620-7ed97878945d",
            },
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
            ImageId: "ami-0e6732e69988617b8",
            InstanceType: "t2.small",
            UserData:
              "TUlNRS1WZXJzaW9uOiAxLjAKQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIvLyIKCi0tLy8KQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9InVzLWFzY2lpIgojIS9iaW4vYmFzaApzZXQgLWV4CkI2NF9DTFVTVEVSX0NBPUxTMHRMUzFDUlVkSlRpQkRSVkpVU1VaSlEwRlVSUzB0TFMwdENrMUpTVU0xZWtORFFXTXJaMEYzU1VKQlowbENRVVJCVGtKbmEzRm9hMmxIT1hjd1FrRlJjMFpCUkVGV1RWSk5kMFZSV1VSV1VWRkVSWGR3Y21SWFNtd0tZMjAxYkdSSFZucE5RalJZUkZSSmVFMUVaM2xPYWtVelRWUkZlazB4YjFoRVZFMTRUVVJuZVU1RVJUTk5WRVY2VFRGdmQwWlVSVlJOUWtWSFFURlZSUXBCZUUxTFlUTldhVnBZU25WYVdGSnNZM3BEUTBGVFNYZEVVVmxLUzI5YVNXaDJZMDVCVVVWQ1FsRkJSR2RuUlZCQlJFTkRRVkZ2UTJkblJVSkJUWFkwQ2tGd2JuTlVha3h4UVhCMFlUSkRjeTlzVlRZNVRsVmpVMkp1ZWxwbmNXMXJZek5hU2tjeGJUQm9UV2xVWkhkek16Vk5lRWxzWTBsUFJFOVpSR1IwVGxZS1lVeHBjWEpJTkRWRWVEZElSSFkyY2tSUlZHMUljbWxJWjNsME9XZHFTbEJoWnpFNGFrOVdjRkJxTVVjMksxcFhaSHBxZWpaWFpWSlVPSGxuY0U5eFF3cE5jR05yVUZoS2RHaGpaemcxYTBKTlRYWTNaRkpHVGxKV2QwZG1TblJaVFd0dmRHbDNRa3BUVmtSSFNUTTJhR0pRWnpkbU5sRjViM0JYVmk5TWIwTnFDbEkwTlhoSFRYRjFZVWQwWVRsdE1uaHRZbFpTTTBvNGNHeEZkWHA0TW5WeGRrZFplVFZLTjA5d1ZGbDJXamhOZGtWTWFYcDJPR04xYjNCYVRHbDBhSEVLTVVKeVYwcDJNSHBSU2taak0ybHlMell3U2s5S1MwMDVlVnBWWXpka1V6SnRlSHA2VEhOalJYVklZbkEyVm1KamNVODNLM054VjNwUlNUbEtVWEZWVWdwNlRtMTZhMjQwUXpsNmFrTnlUR1FyZGprd1EwRjNSVUZCWVU1RFRVVkJkMFJuV1VSV1VqQlFRVkZJTDBKQlVVUkJaMHRyVFVFNFIwRXhWV1JGZDBWQ0NpOTNVVVpOUVUxQ1FXWTRkMGhSV1VSV1VqQlBRa0paUlVaQlZsTnFkRFF4VUVka2MweDZkVGQ1ZFd0MU9HNUdiRU15UTJOTlFUQkhRMU54UjFOSllqTUtSRkZGUWtOM1ZVRkJORWxDUVZGQ1YyWlpXRmRMWmtvMWEybDNLMnBwSzI5SlJGZE5OVzQ1UkRkWWJVWm5NR3gyWTBoeWNWUnVXVU50YjJoUVpFRlRaQXBGZEdwNU1GSkpia2RaT1doUWN5czFURmRWUmxVM1oxRlhPV2s0YW1oT1JEQnZkbmx6VkVOT2JsWjVRblZMZDNBemFGSlpUMWMzZW1oNFpEZzFiWGxsQ25wbU1FSkpTM2hsUkdaNlYyVjZielZHV2xReFYzcDJNWEZRVGtFeVMyNXNaR3B5TVRRd1ZEaHFaRmhQT1c5MVVuRktXRTVYWVVGd1dIUTNWbGRzUW0wS2JWcG1ZbVV2T1hSVFkyUnBWelp5T0d4NFNWSlljWEZCWW1GcFIzcHJPSHB1WkRNelpFc3hUMjFuU2tOSWIyb3lSMXBGSzJaVk1HdGFWa3RwYjNKU01BcDNSSFp1U2tWVGJqZDRhRUUzV1dkWVlsQlhXa3R3WVdoeU1GZEVWVlJuUkVVMFZ6SnhZVnAxU1dVemJrVjBiMjFhYVU5c1pVUlJha2RsZG5Gek5ERjNDa1ZsZFROeU1FOVZMMFV3YWxkSlZtZzROREk1ZVVWS0sxUktVRWhaUVdodE9WbDFWUW90TFMwdExVVk9SQ0JEUlZKVVNVWkpRMEZVUlMwdExTMHRDZz09CkFQSV9TRVJWRVJfVVJMPWh0dHBzOi8vRTE1RTNFOUIzN0MwNzgzMEU5MUQyNUE5NjhCMkM1QTQuZ3I3LmV1LXdlc3QtMi5la3MuYW1hem9uYXdzLmNvbQpLOFNfQ0xVU1RFUl9ETlNfSVA9MTAuMTAwLjAuMTAKL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXIgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgJy0tbm9kZS1sYWJlbHM9ZWtzLmFtYXpvbmF3cy5jb20vbm9kZWdyb3VwLWltYWdlPWFtaS0wZTY3MzJlNjk5ODg2MTdiOCxla3MuYW1hem9uYXdzLmNvbS9jYXBhY2l0eVR5cGU9T05fREVNQU5ELGVrcy5hbWF6b25hd3MuY29tL25vZGVncm91cD1ub2RlLWdyb3VwLXByaXZhdGUtY2x1c3RlcicgLS1iNjQtY2x1c3Rlci1jYSAkQjY0X0NMVVNURVJfQ0EgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgJEFQSV9TRVJWRVJfVVJMIC0tZG5zLWNsdXN0ZXItaXAgJEs4U19DTFVTVEVSX0ROU19JUAoKLS0vLy0t",
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
  eks: {
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
