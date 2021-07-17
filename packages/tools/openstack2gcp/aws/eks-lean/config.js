const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  iam: {
    Policy: {
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
    InstanceProfile: {
      eks_02bd57ab_07b4Fb9cC0cf_8e1ac4094640: {
        name: "eks-02bd57ab-07b4-fb9c-c0cf-8e1ac4094640",
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
      subnetPublicA: {
        name: "subnet-public-a",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/role/elb",
              Value: "1",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
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
      subnetPublicB: {
        name: "subnet-public-b",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/role/elb",
              Value: "1",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
          ],
        },
      },
      subnetPrivateA: {
        name: "subnet-private-a",
        properties: {
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/role/internal-elb",
              Value: "1",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
          ],
        },
      },
    },
    KeyPair: {
      kp: {
        name: "kp",
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
      routeTablePublic: {
        name: "route-table-public",
      },
      routeTablePrivateA: {
        name: "route-table-private-a",
      },
      routeTablePrivateB: {
        name: "route-table-private-b",
      },
    },
    Route: {
      routePublic: {
        name: "route-public",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
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
    },
    SecurityGroup: {
      securityGroupCluster: {
        name: "security-group-cluster",
        properties: {
          Description: "EKS Cluster Security Group",
        },
      },
      securityGroupNode: {
        name: "security-group-node",
        properties: {
          Description: "SG for the EKS Nodes",
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
          ],
        },
      },
      loadBalancerSecurityGroup: {
        name: "load-balancer-security-group",
        properties: {
          Description: "Load Balancer HTTP HTTPS Security Group",
        },
      },
    },
    SecurityGroupRuleIngress: {
      sgRuleIngressLbHttp: {
        name: "sg-rule-ingress-lb-http",
        properties: {
          IpProtocol: "tcp",
          FromPort: 80,
          ToPort: 80,
          CidrIpv6: "::/0",
        },
      },
      sgRuleIngressLbHttps: {
        name: "sg-rule-ingress-lb-https",
        properties: {
          IpProtocol: "tcp",
          FromPort: 443,
          ToPort: 443,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgNodesRuleIngressAll: {
        name: "sg-nodes-rule-ingress-all",
        properties: {
          IpProtocol: "-1",
          FromPort: -1,
          ToPort: -1,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgRuleIngressLbHttp: {
        name: "sg-rule-ingress-lb-http",
        properties: {
          IpProtocol: "tcp",
          FromPort: 80,
          ToPort: 80,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgClusterRuleIngressHttps: {
        name: "sg-cluster-rule-ingress-https",
        properties: {
          IpProtocol: "tcp",
          FromPort: 443,
          ToPort: 443,
          CidrIpv6: "::/0",
        },
      },
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1025,
          ToPort: 65535,
          ReferencedGroupInfo: {
            GroupId: "sg-04fe2e32192ce188f",
            UserId: "840541460064",
          },
        },
      },
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1025,
          ToPort: 65535,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgRuleIngressLbHttps: {
        name: "sg-rule-ingress-lb-https",
        properties: {
          IpProtocol: "tcp",
          FromPort: 443,
          ToPort: 443,
          CidrIpv6: "::/0",
        },
      },
      sgNodesRuleIngressAll: {
        name: "sg-nodes-rule-ingress-all",
        properties: {
          IpProtocol: "-1",
          FromPort: -1,
          ToPort: -1,
          CidrIpv6: "::/0",
        },
      },
      sgClusterRuleIngressHttps: {
        name: "sg-cluster-rule-ingress-https",
        properties: {
          IpProtocol: "tcp",
          FromPort: 443,
          ToPort: 443,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1025,
          ToPort: 65535,
          CidrIpv6: "::/0",
        },
      },
    },
    SecurityGroupRuleEgress: {
      sgClusterRuleEgress: {
        name: "sg-cluster-rule-egress",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1024,
          ToPort: 65535,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgClusterRuleEgress: {
        name: "sg-cluster-rule-egress",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1024,
          ToPort: 65535,
          CidrIpv6: "::/0",
        },
      },
    },
  },
  elb: {
    LoadBalancer: {
      loadBalancer: {
        name: "load-balancer",
        properties: {
          Scheme: "internet-facing",
          Type: "application",
          IpAddressType: "ipv4",
        },
      },
    },
    TargetGroup: {
      targetGroupRest: {
        name: "target-group-rest",
        properties: {
          Protocol: "HTTP",
          Port: 30020,
          HealthCheckProtocol: "HTTP",
          HealthCheckPort: "traffic-port",
          HealthCheckEnabled: true,
          HealthCheckIntervalSeconds: 30,
          HealthCheckTimeoutSeconds: 5,
          HealthyThresholdCount: 5,
          HealthCheckPath: "/api/v1/version",
          Matcher: {
            HttpCode: "200",
          },
          TargetType: "instance",
          ProtocolVersion: "HTTP1",
        },
      },
      targetGroupWeb: {
        name: "target-group-web",
        properties: {
          Protocol: "HTTP",
          Port: 30010,
          HealthCheckProtocol: "HTTP",
          HealthCheckPort: "traffic-port",
          HealthCheckEnabled: true,
          HealthCheckIntervalSeconds: 30,
          HealthCheckTimeoutSeconds: 5,
          HealthyThresholdCount: 5,
          HealthCheckPath: "/",
          Matcher: {
            HttpCode: "200",
          },
          TargetType: "instance",
          ProtocolVersion: "HTTP1",
        },
      },
    },
    Listener: {
      listenerHttp: {
        name: "listener-http",
        properties: {
          Port: 80,
          Protocol: "HTTP",
          DefaultActions: [
            {
              Type: "forward",
              TargetGroupArn:
                "arn:aws:elasticloadbalancing:eu-west-2:840541460064:targetgroup/target-group-web/a17f8671eb51e6b8",
              ForwardConfig: {
                TargetGroups: [
                  {
                    TargetGroupArn:
                      "arn:aws:elasticloadbalancing:eu-west-2:840541460064:targetgroup/target-group-web/a17f8671eb51e6b8",
                    Weight: 1,
                  },
                ],
                TargetGroupStickinessConfig: {
                  Enabled: false,
                },
              },
            },
          ],
        },
      },
      listenerHttps: {
        name: "listener-https",
        properties: {
          Port: 443,
          Protocol: "HTTPS",
          DefaultActions: [
            {
              Type: "forward",
              TargetGroupArn:
                "arn:aws:elasticloadbalancing:eu-west-2:840541460064:targetgroup/target-group-web/a17f8671eb51e6b8",
              ForwardConfig: {
                TargetGroups: [
                  {
                    TargetGroupArn:
                      "arn:aws:elasticloadbalancing:eu-west-2:840541460064:targetgroup/target-group-web/a17f8671eb51e6b8",
                    Weight: 1,
                  },
                ],
                TargetGroupStickinessConfig: {
                  Enabled: false,
                },
              },
            },
          ],
        },
      },
    },
  },
  kms: {
    Key: {
      eksKey: {
        name: "eks-key",
        properties: {
          Tags: [
            {
              TagKey: "Name",
              TagValue: "eks-key",
            },
            {
              TagKey: "gc-created-by-provider",
              TagValue: "aws",
            },
            {
              TagKey: "gc-managed-by",
              TagValue: "grucloud",
            },
            {
              TagKey: "gc-provider-name",
              TagValue: "starhackit",
            },
            {
              TagKey: "gc-stage",
              TagValue: "dev",
            },
          ],
        },
      },
      eksKey: {
        name: "eks-key",
        properties: {
          Tags: [
            {
              TagKey: "Name",
              TagValue: "eks-key",
            },
            {
              TagKey: "gc-created-by-provider",
              TagValue: "aws",
            },
            {
              TagKey: "gc-managed-by",
              TagValue: "grucloud",
            },
            {
              TagKey: "gc-provider-name",
              TagValue: "starhackit",
            },
            {
              TagKey: "gc-stage",
              TagValue: "dev",
            },
          ],
        },
      },
      aliasAwsRds: {
        name: "alias/aws/rds",
      },
      eksKey: {
        name: "eks-key",
        properties: {
          Tags: [
            {
              TagKey: "Name",
              TagValue: "eks-key",
            },
            {
              TagKey: "gc-created-by-provider",
              TagValue: "aws",
            },
            {
              TagKey: "gc-managed-by",
              TagValue: "grucloud",
            },
            {
              TagKey: "gc-provider-name",
              TagValue: "starhackit",
            },
            {
              TagKey: "gc-stage",
              TagValue: "dev",
            },
          ],
        },
      },
      aliasAwsAcm: {
        name: "alias/aws/acm",
      },
      aliasAwsEbs: {
        name: "alias/aws/ebs",
      },
      secretKeyTest: {
        name: "secret-key-test",
        properties: {
          Tags: [
            {
              TagKey: "Name",
              TagValue: "secret-key-test",
            },
            {
              TagKey: "gc-created-by-provider",
              TagValue: "aws",
            },
            {
              TagKey: "gc-managed-by",
              TagValue: "grucloud",
            },
            {
              TagKey: "gc-project-name",
              TagValue: "kms-symmetric",
            },
            {
              TagKey: "gc-stage",
              TagValue: "dev",
            },
          ],
        },
      },
    },
  },
  eks: {
    Cluster: {
      cluster: {
        name: "cluster",
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
          instanceTypes: ["t2.medium"],
          amiType: "AL2_x86_64",
          labels: {},
          diskSize: 20,
        },
      },
    },
  },
  route53Domain: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  route53: {
    HostedZone: {
      starhackitEksLeanGrucloudOrg: {
        name: "starhackit-eks-lean.grucloud.org.",
        properties: {
          Name: "starhackit-eks-lean.grucloud.org.",
        },
      },
    },
    Record: {
      loadBalancerDnsRecordAliasStarhackitEksLeanGrucloudOrg: {
        name: "load-balancer-dns-record-alias-starhackit-eks-lean.grucloud.org.",
        properties: {
          Name: "starhackit-eks-lean.grucloud.org.",
          Type: "A",
          ResourceRecords: [],
          AliasTarget: {
            HostedZoneId: "ZHURV8PSTC4K8",
            DNSName: "load-balancer-929516254.eu-west-2.elb.amazonaws.com.",
            EvaluateTargetHealth: false,
          },
        },
      },
      certificateValidationStarhackitEksLeanGrucloudOrg: {
        name: "certificate-validation-starhackit-eks-lean.grucloud.org.",
        properties: {
          Name: "_de3ed2bdc7b02cea1eae6ba1796ed059.starhackit-eks-lean.grucloud.org.",
          Type: "CNAME",
          TTL: 300,
          ResourceRecords: [
            {
              Value:
                "_7e4dce3ad999c34be58c7b1f150f002b.bbfvkzsszw.acm-validations.aws.",
            },
          ],
        },
      },
    },
  },
});
