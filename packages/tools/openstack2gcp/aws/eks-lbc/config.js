const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  iam: {
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
      awsLoadBalancerControllerIamPolicy: {
        name: "AWSLoadBalancerControllerIAMPolicy",
        properties: {
          PolicyName: "AWSLoadBalancerControllerIAMPolicy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "iam:CreateServiceLinkedRole",
                  "ec2:DescribeAccountAttributes",
                  "ec2:DescribeAddresses",
                  "ec2:DescribeInternetGateways",
                  "ec2:DescribeVpcs",
                  "ec2:DescribeSubnets",
                  "ec2:DescribeSecurityGroups",
                  "ec2:DescribeInstances",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DescribeTags",
                  "ec2:GetCoipPoolUsage",
                  "ec2:DescribeCoipPools",
                  "elasticloadbalancing:DescribeLoadBalancers",
                  "elasticloadbalancing:DescribeLoadBalancerAttributes",
                  "elasticloadbalancing:DescribeListeners",
                  "elasticloadbalancing:DescribeListenerCertificates",
                  "elasticloadbalancing:DescribeSSLPolicies",
                  "elasticloadbalancing:DescribeRules",
                  "elasticloadbalancing:DescribeTargetGroups",
                  "elasticloadbalancing:DescribeTargetGroupAttributes",
                  "elasticloadbalancing:DescribeTargetHealth",
                  "elasticloadbalancing:DescribeTags",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "cognito-idp:DescribeUserPoolClient",
                  "acm:ListCertificates",
                  "acm:DescribeCertificate",
                  "iam:ListServerCertificates",
                  "iam:GetServerCertificate",
                  "waf-regional:GetWebACL",
                  "waf-regional:GetWebACLForResource",
                  "waf-regional:AssociateWebACL",
                  "waf-regional:DisassociateWebACL",
                  "wafv2:GetWebACL",
                  "wafv2:GetWebACLForResource",
                  "wafv2:AssociateWebACL",
                  "wafv2:DisassociateWebACL",
                  "shield:GetSubscriptionState",
                  "shield:DescribeProtection",
                  "shield:CreateProtection",
                  "shield:DeleteProtection",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "ec2:AuthorizeSecurityGroupIngress",
                  "ec2:RevokeSecurityGroupIngress",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: ["ec2:CreateSecurityGroup"],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: ["ec2:CreateTags"],
                Resource: "arn:aws:ec2:*:*:security-group/*",
                Condition: {
                  StringEquals: {
                    "ec2:CreateAction": "CreateSecurityGroup",
                  },
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: ["ec2:CreateTags", "ec2:DeleteTags"],
                Resource: "arn:aws:ec2:*:*:security-group/*",
                Condition: {
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "ec2:AuthorizeSecurityGroupIngress",
                  "ec2:RevokeSecurityGroupIngress",
                  "ec2:DeleteSecurityGroup",
                ],
                Resource: "*",
                Condition: {
                  Null: {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:CreateLoadBalancer",
                  "elasticloadbalancing:CreateTargetGroup",
                ],
                Resource: "*",
                Condition: {
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:CreateListener",
                  "elasticloadbalancing:DeleteListener",
                  "elasticloadbalancing:CreateRule",
                  "elasticloadbalancing:DeleteRule",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:AddTags",
                  "elasticloadbalancing:RemoveTags",
                ],
                Resource: [
                  "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                  "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                  "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*",
                ],
                Condition: {
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:ModifyLoadBalancerAttributes",
                  "elasticloadbalancing:SetIpAddressType",
                  "elasticloadbalancing:SetSecurityGroups",
                  "elasticloadbalancing:SetSubnets",
                  "elasticloadbalancing:DeleteLoadBalancer",
                  "elasticloadbalancing:ModifyTargetGroup",
                  "elasticloadbalancing:ModifyTargetGroupAttributes",
                  "elasticloadbalancing:DeleteTargetGroup",
                ],
                Resource: "*",
                Condition: {
                  Null: {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:RegisterTargets",
                  "elasticloadbalancing:DeregisterTargets",
                ],
                Resource: "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:SetWebAcl",
                  "elasticloadbalancing:ModifyListener",
                  "elasticloadbalancing:AddListenerCertificates",
                  "elasticloadbalancing:RemoveListenerCertificates",
                  "elasticloadbalancing:ModifyRule",
                ],
                Resource: "*",
              },
            ],
          },
          Path: "/",
          Description: "Load Balancer Policy",
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
      roleLoadBalancer: {
        name: "role-load-balancer",
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
      eks_1abd6da8_68d5_84a6_7af4_30618ba3c23a: {
        name: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
      },
    },
    OpenIDConnectProvider: {
      oidcEks: {
        name: "oidc-eks",
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
      vpcDefault: {
        name: "vpc-default",
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
      subnetPrivateB: {
        name: "subnet-private-b",
        properties: {
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: "eu-west-2b",
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
    Volume: {
      kubernetesPvDbPostgres_0: {
        name: "kubernetes-pv-db-postgres-0",
        properties: {
          Size: 1,
          VolumeType: "gp2",
          Tags: [
            {
              Key: "kubernetes.io/created-for/pvc/namespace",
              Value: "default",
            },
            {
              Key: "kubernetes.io/created-for/pv/name",
              Value: "pvc-f0d4b9fa-7882-493e-8145-70998d150247",
            },
            {
              Key: "kubernetes.io/created-for/pvc/name",
              Value: "pv-db-postgres-0",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
          ],
        },
      },
      vol_0f1087128099b1ce7: {
        name: "vol-0f1087128099b1ce7",
        properties: {
          Size: 20,
          VolumeType: "gp2",
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
      eksClusterSgCluster_872092154: {
        name: "eks-cluster-sg-cluster-872092154",
        properties: {
          Description:
            "EKS created security group applied to ENI that is attached to EKS Control Plane master nodes, as well as any managed workloads.",
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
            {
              Key: "aws:eks:cluster-name",
              Value: "cluster",
            },
          ],
        },
      },
      k8sDefaultIngress_05be0614e6: {
        name: "k8s-default-ingress-05be0614e6",
        properties: {
          Description: "[k8s] Managed SecurityGroup for LoadBalancer",
          Tags: [
            {
              Key: "ingress.k8s.aws/stack",
              Value: "default/ingress",
            },
            {
              Key: "ingress.k8s.aws/resource",
              Value: "ManagedLBSecurityGroup",
            },
            {
              Key: "elbv2.k8s.aws/cluster",
              Value: "cluster",
            },
          ],
        },
      },
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
      sgDefaultVpc: {
        name: "sg-default-vpc",
      },
      sgDefaultVpcDefault: {
        name: "sg-default-vpc-default",
      },
    },
    SecurityGroupRuleIngress: {
      eksClusterSgCluster_872092154RuleIngressAllFromEksClusterSgCluster_872092154:
        {
          name: "eks-cluster-sg-cluster-872092154-rule-ingress-all-from-eks-cluster-sg-cluster-872092154",
        },
      eksClusterSgCluster_872092154RuleIngressTcp_0_65535FromK8sDefaultIngress_05be0614e6:
        {
          name: "eks-cluster-sg-cluster-872092154-rule-ingress-tcp-0-65535-from-k8s-default-ingress-05be0614e6",
          properties: {
            IpPermission: {
              IpProtocol: "tcp",
              FromPort: 0,
              ToPort: 65535,
            },
          },
        },
      k8sDefaultIngress_05be0614e6RuleIngressTcp_443V4: {
        name: "k8s-default-ingress-05be0614e6-rule-ingress-tcp-443-v4",
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
          },
        },
      },
      k8sDefaultIngress_05be0614e6RuleIngressTcp_80V4: {
        name: "k8s-default-ingress-05be0614e6-rule-ingress-tcp-80-v4",
        properties: {
          IpPermission: {
            IpProtocol: "tcp",
            FromPort: 80,
            ToPort: 80,
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
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
      sgDefaultVpcRuleIngressAllFromSgDefaultVpc: {
        name: "sg-default-vpc-rule-ingress-all-from-sg-default-vpc",
      },
      sgNodesRuleIngressAll: {
        name: "sg-nodes-rule-ingress-all",
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
      eksClusterSgCluster_872092154RuleEgressAllV4: {
        name: "eks-cluster-sg-cluster-872092154-rule-egress-all-v4",
      },
      k8sDefaultIngress_05be0614e6RuleEgressAllV4: {
        name: "k8s-default-ingress-05be0614e6-rule-egress-all-v4",
      },
      securityGroupClusterRuleEgressAllV4: {
        name: "security-group-cluster-rule-egress-all-v4",
      },
      securityGroupNodeRuleEgressAllV4: {
        name: "security-group-node-rule-egress-all-v4",
      },
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
      sgDefaultVpcRuleEgressAllV4: {
        name: "sg-default-vpc-rule-egress-all-v4",
      },
    },
    Instance: {
      nodeGroupPrivateClusterI_0b83ed3973287c57e: {
        name: "node-group-private-cluster::i-0b83ed3973287c57e",
        properties: {
          InstanceType: "t2.medium",
          ImageId: "ami-0ee353797c2e5f904",
          Placement: {
            AvailabilityZone: "eu-west-2b",
          },
          Tags: [
            {
              Key: "k8s.io/cluster-autoscaler/enabled",
              Value: "true",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
            {
              Key: "aws:ec2:fleet-id",
              Value: "fleet-c7fde09a-6b3f-73dd-8492-29a869005bf1",
            },
            {
              Key: "eks:cluster-name",
              Value: "cluster",
            },
            {
              Key: "aws:ec2launchtemplate:id",
              Value: "lt-079c554824686b9a7",
            },
            {
              Key: "aws:autoscaling:groupName",
              Value: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
            },
            {
              Key: "k8s.io/cluster-autoscaler/cluster",
              Value: "owned",
            },
            {
              Key: "aws:ec2launchtemplate:version",
              Value: "1",
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
  acm: {
    Certificate: {
      exampleModuleAwsCertificateGrucloudOrg: {
        name: "example-module-aws-certificate.grucloud.org",
        properties: {
          DomainName: "example-module-aws-certificate.grucloud.org",
          SubjectAlternativeNames: [
            "example-module-aws-certificate.grucloud.org",
          ],
        },
      },
      modAwsLoadBalancerGrucloudOrg: {
        name: "mod-aws-load-balancer.grucloud.org",
        properties: {
          DomainName: "mod-aws-load-balancer.grucloud.org",
          SubjectAlternativeNames: ["mod-aws-load-balancer.grucloud.org"],
        },
      },
      starhackitEksLbcGrucloudOrg: {
        name: "starhackit-eks-lbc.grucloud.org",
        properties: {
          DomainName: "starhackit-eks-lbc.grucloud.org",
          SubjectAlternativeNames: ["starhackit-eks-lbc.grucloud.org"],
        },
      },
      starhackitEksLeanGrucloudOrg: {
        name: "starhackit-eks-lean.grucloud.org",
        properties: {
          DomainName: "starhackit-eks-lean.grucloud.org",
          SubjectAlternativeNames: ["starhackit-eks-lean.grucloud.org"],
        },
      },
    },
  },
  autoscaling: {
    AutoScalingGroup: {
      eks_1abd6da8_68d5_84a6_7af4_30618ba3c23a: {
        name: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
        properties: {
          Tags: [
            {
              ResourceId: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
              ResourceType: "auto-scaling-group",
              Key: "eks:cluster-name",
              Value: "cluster",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
              ResourceType: "auto-scaling-group",
              Key: "eks:nodegroup-name",
              Value: "node-group-private-cluster",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
              ResourceType: "auto-scaling-group",
              Key: "k8s.io/cluster-autoscaler/cluster",
              Value: "owned",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
              ResourceType: "auto-scaling-group",
              Key: "k8s.io/cluster-autoscaler/enabled",
              Value: "true",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-1abd6da8-68d5-84a6-7af4-30618ba3c23a",
              ResourceType: "auto-scaling-group",
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
              PropagateAtLaunch: true,
            },
          ],
        },
      },
    },
  },
  elb: {
    LoadBalancer: {
      k8sDefaultIngressE514cce9f1: {
        name: "k8s-default-ingress-e514cce9f1",
        properties: {
          Scheme: "internet-facing",
          Type: "application",
          IpAddressType: "ipv4",
          Tags: [
            {
              Key: "ingress.k8s.aws/resource",
              Value: "LoadBalancer",
            },
            {
              Key: "ingress.k8s.aws/stack",
              Value: "default/ingress",
            },
            {
              Key: "elbv2.k8s.aws/cluster",
              Value: "cluster",
            },
          ],
        },
      },
    },
    TargetGroup: {
      k8sDefaultRestF2d39b1bea: {
        name: "k8s-default-rest-f2d39b1bea",
        properties: {
          Protocol: "HTTP",
          Port: 30020,
          HealthCheckProtocol: "HTTP",
          HealthCheckPort: "traffic-port",
          HealthCheckEnabled: true,
          HealthCheckIntervalSeconds: 15,
          HealthCheckTimeoutSeconds: 5,
          HealthyThresholdCount: 2,
          HealthCheckPath: "/",
          Matcher: {
            HttpCode: "200",
          },
          TargetType: "instance",
          ProtocolVersion: "HTTP1",
          Tags: [
            {
              Key: "ingress.k8s.aws/resource",
              Value: "default/ingress-rest:9000",
            },
            {
              Key: "ingress.k8s.aws/stack",
              Value: "default/ingress",
            },
            {
              Key: "elbv2.k8s.aws/cluster",
              Value: "cluster",
            },
          ],
        },
      },
      k8sDefaultWebC7d57981c9: {
        name: "k8s-default-web-c7d57981c9",
        properties: {
          Protocol: "HTTP",
          Port: 30010,
          HealthCheckProtocol: "HTTP",
          HealthCheckPort: "traffic-port",
          HealthCheckEnabled: true,
          HealthCheckIntervalSeconds: 15,
          HealthCheckTimeoutSeconds: 5,
          HealthyThresholdCount: 2,
          HealthCheckPath: "/",
          Matcher: {
            HttpCode: "200",
          },
          TargetType: "instance",
          ProtocolVersion: "HTTP1",
          Tags: [
            {
              Key: "ingress.k8s.aws/resource",
              Value: "default/ingress-web:80",
            },
            {
              Key: "ingress.k8s.aws/stack",
              Value: "default/ingress",
            },
            {
              Key: "elbv2.k8s.aws/cluster",
              Value: "cluster",
            },
          ],
        },
      },
    },
    Listener: {
      arnAwsElasticloadbalancingEuWest_2_840541460064ListenerAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277a_81b987253d9c289f:
        {
          name: "arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/81b987253d9c289f",
          properties: {
            Port: 443,
            Protocol: "HTTPS",
            DefaultActions: [
              {
                Type: "fixed-response",
                Order: 1,
                FixedResponseConfig: {
                  StatusCode: "404",
                  ContentType: "text/plain",
                },
              },
            ],
          },
        },
      arnAwsElasticloadbalancingEuWest_2_840541460064ListenerAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277aEc89cb412dae7637:
        {
          name: "arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/ec89cb412dae7637",
          properties: {
            Port: 80,
            Protocol: "HTTP",
            DefaultActions: [
              {
                Type: "fixed-response",
                Order: 1,
                FixedResponseConfig: {
                  StatusCode: "404",
                  ContentType: "text/plain",
                },
              },
            ],
          },
        },
    },
    Rule: {
      arnAwsElasticloadbalancingEuWest_2_840541460064ListenerRuleAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277a_81b987253d9c289f_4bea3f1f090d25dc:
        {
          name: "arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener-rule/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/81b987253d9c289f/4bea3f1f090d25dc",
          properties: {
            Priority: "2",
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/*"],
              },
            ],
          },
        },
      arnAwsElasticloadbalancingEuWest_2_840541460064ListenerRuleAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277a_81b987253d9c289f_75d1cc3e15ae481b:
        {
          name: "arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener-rule/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/81b987253d9c289f/75d1cc3e15ae481b",
          properties: {
            Priority: "1",
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/api/*"],
              },
            ],
          },
        },
      arnAwsElasticloadbalancingEuWest_2_840541460064ListenerRuleAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277aEc89cb412dae7637_06881494aa16f0c2:
        {
          name: "arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener-rule/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/ec89cb412dae7637/06881494aa16f0c2",
          properties: {
            Priority: "1",
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/api/*"],
              },
            ],
          },
        },
      arnAwsElasticloadbalancingEuWest_2_840541460064ListenerRuleAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277aEc89cb412dae7637_5d97d397c4531bab:
        {
          name: "arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener-rule/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/ec89cb412dae7637/5d97d397c4531bab",
          properties: {
            Priority: "2",
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/*"],
              },
            ],
          },
        },
      ruleDefaultArnAwsElasticloadbalancingEuWest_2_840541460064ListenerAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277a_81b987253d9c289f:
        {
          name: "rule-default-arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/81b987253d9c289f",
          properties: {
            Priority: "default",
            Conditions: [],
            Actions: [
              {
                Type: "fixed-response",
                Order: 1,
                FixedResponseConfig: {
                  StatusCode: "404",
                  ContentType: "text/plain",
                },
              },
            ],
          },
        },
      ruleDefaultArnAwsElasticloadbalancingEuWest_2_840541460064ListenerAppK8sDefaultIngressE514cce9f1Ca2e2a5dc510277aEc89cb412dae7637:
        {
          name: "rule-default-arn:aws:elasticloadbalancing:eu-west-2:840541460064:listener/app/k8s-default-ingress-e514cce9f1/ca2e2a5dc510277a/ec89cb412dae7637",
          properties: {
            Priority: "default",
            Conditions: [],
            Actions: [
              {
                Type: "fixed-response",
                Order: 1,
                FixedResponseConfig: {
                  StatusCode: "404",
                  ContentType: "text/plain",
                },
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
      starhackitEksLbcGrucloudOrg: {
        name: "starhackit-eks-lbc.grucloud.org.",
        properties: {
          Name: "starhackit-eks-lbc.grucloud.org.",
        },
      },
    },
    Record: {
      certificateValidationStarhackitEksLbcGrucloudOrg: {
        name: "certificate-validation-starhackit-eks-lbc.grucloud.org.",
      },
      dnsRecordAliasLoadBalancerStarhackitEksLbcGrucloudOrg: {
        name: "dns-record-alias-load-balancer-starhackit-eks-lbc.grucloud.org.",
      },
    },
  },
});
