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
      eks_5abd6ec8_6bfaB582_9a57_975f586ae231: {
        name: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
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
    },
    KeyPair: {
      kpTestEc2: {
        name: "kp-test-ec2",
        properties: {
          KeyPairId: "key-09b774dead6f75aeb",
          KeyFingerprint:
            "c2:c3:28:89:c4:eb:b8:15:f0:43:78:6c:dd:8a:0e:2f:8f:17:de:4a",
          KeyName: "kp-test-ec2",
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
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
            {
              Key: "kubernetes.io/created-for/pvc/name",
              Value: "pv-db-postgres-0",
            },
            {
              Key: "kubernetes.io/created-for/pvc/namespace",
              Value: "default",
            },
            {
              Key: "kubernetes.io/created-for/pv/name",
              Value: "pvc-316e0de0-4a95-47ef-870d-4a5bb257167a",
            },
          ],
        },
      },
      vol_0d2d3221a5fdb6745: {
        name: "vol-0d2d3221a5fdb6745",
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
              Key: "aws:eks:cluster-name",
              Value: "cluster",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
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
      securityGroupLoadBalancer: {
        name: "security-group-load-balancer",
        properties: {
          Description: "Load Balancer HTTP HTTPS Security Group",
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
      sgRuleIngresEksClusterFromLoadBalancer: {
        name: "sg-rule-ingres-eks-cluster-from-load-balancer",
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
      sgRuleIngressLbHttp: {
        name: "sg-rule-ingress-lb-http",
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
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
          },
        },
      },
      sgRuleIngressLbHttps: {
        name: "sg-rule-ingress-lb-https",
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
      eksClusterSgCluster_872092154RuleEgressAllV4: {
        name: "eks-cluster-sg-cluster-872092154-rule-egress-all-v4",
      },
      securityGroupClusterRuleEgressAllV4: {
        name: "security-group-cluster-rule-egress-all-v4",
      },
      securityGroupLoadBalancerRuleEgressAllV4: {
        name: "security-group-load-balancer-rule-egress-all-v4",
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
      nodeGroupPrivateClusterI_0745e3491469614b7: {
        name: "node-group-private-cluster::i-0745e3491469614b7",
        properties: {
          InstanceType: "t2.medium",
          ImageId: "ami-0ee353797c2e5f904",
          Placement: {
            AvailabilityZone: "eu-west-2a",
          },
          Tags: [
            {
              Key: "k8s.io/cluster-autoscaler/enabled",
              Value: "true",
            },
            {
              Key: "eks:nodegroup-name",
              Value: "node-group-private-cluster",
            },
            {
              Key: "aws:ec2:fleet-id",
              Value: "fleet-6d5fca30-4b17-71dd-0498-0baa8a444671",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
            {
              Key: "aws:ec2launchtemplate:id",
              Value: "lt-014e6cdab310dedf5",
            },
            {
              Key: "aws:autoscaling:groupName",
              Value: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
            },
            {
              Key: "aws:ec2launchtemplate:version",
              Value: "1",
            },
            {
              Key: "eks:cluster-name",
              Value: "cluster",
            },
            {
              Key: "k8s.io/cluster-autoscaler/cluster",
              Value: "owned",
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
      eks_5abd6ec8_6bfaB582_9a57_975f586ae231: {
        name: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
        properties: {
          Tags: [
            {
              ResourceId: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
              ResourceType: "auto-scaling-group",
              Key: "eks:cluster-name",
              Value: "cluster",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
              ResourceType: "auto-scaling-group",
              Key: "eks:nodegroup-name",
              Value: "node-group-private-cluster",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
              ResourceType: "auto-scaling-group",
              Key: "k8s.io/cluster-autoscaler/cluster",
              Value: "owned",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
              ResourceType: "auto-scaling-group",
              Key: "k8s.io/cluster-autoscaler/enabled",
              Value: "true",
              PropagateAtLaunch: true,
            },
            {
              ResourceId: "eks-5abd6ec8-6bfa-b582-9a57-975f586ae231",
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
        },
      },
      listenerHttps: {
        name: "listener-https",
        properties: {
          Port: 443,
          Protocol: "HTTPS",
        },
      },
    },
    Rule: {
      ruleDefaultListenerHttp: {
        name: "rule-default-listener-http",
        properties: {
          Priority: "default",
          Conditions: [],
        },
      },
      ruleDefaultListenerHttps: {
        name: "rule-default-listener-https",
        properties: {
          Priority: "default",
          Conditions: [],
        },
      },
      ruleHttpRedirectHttps: {
        name: "rule-http-redirect-https",
        properties: {
          Priority: "1",
          Conditions: [
            {
              Field: "path-pattern",
              Values: ["/*"],
            },
          ],
          Actions: [
            {
              Type: "redirect",
              Order: 1,
              RedirectConfig: {
                Protocol: "HTTPS",
                Port: "443",
                Host: "#{host}",
                Path: "/#{path}",
                Query: "#{query}",
                StatusCode: "HTTP_301",
              },
            },
          ],
        },
      },
      ruleRestHttps: {
        name: "rule-rest-https",
        properties: {
          Priority: "10",
          Conditions: [
            {
              Field: "path-pattern",
              Values: ["/api/*"],
            },
          ],
        },
      },
      ruleWebHttps: {
        name: "rule-web-https",
        properties: {
          Priority: "11",
          Conditions: [
            {
              Field: "path-pattern",
              Values: ["/*"],
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
      testLoadBalancerGrucloudOrg: {
        name: "test-load-balancer.grucloud.org.",
        properties: {
          Name: "test-load-balancer.grucloud.org.",
        },
      },
    },
    Record: {
      certificateValidationStarhackitEksLeanGrucloudOrg: {
        name: "certificate-validation-starhackit-eks-lean.grucloud.org.",
      },
      loadBalancerDnsRecordAliasStarhackitEksLeanGrucloudOrg: {
        name: "load-balancer-dns-record-alias-starhackit-eks-lean.grucloud.org.",
      },
    },
  },
});
