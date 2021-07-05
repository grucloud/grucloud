# Full Stack Application on AWS EKS

This example automatically deploys a full-stack application with Kubernetes on AWS using their managed control plane called [Elastic Kubernetes Service](https://aws.amazon.com/eks/)

Automation is performed with [GruCloud](https://grucloud.com), which is an infrastructure as code tool written in Javascript.

## High-level description

This infrastructure combines 2 providers: AWS and Kubernetes.

A few modules for each of these providers are being used:

![module.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/modules.svg)

In this example, the load balancer, target groups, listeners, and rules are managed by GruCloud instead of the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html).
The benefit of not using the LBC is to free a lot of resources, the LBC depends on the [Cert Manager](https://cert-manager.io/) which brings more resources,
By not using the AWS LBC and the Cert Manager, we can save 4 pods, and numerous other resources such as ServiceAcount, ClusterRole, ClusterRoleBinding, we can even get rid of the CRD stuff.
Fewer pods mean we can choose a cheaper worker node.

### Modules for AWS resources

- [module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate)
- [module-aws-vpc](https://www.npmjs.com/package/@grucloud/module-aws-vpc)
- [module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-eks)
- [module-aws-load-balancer](https://www.npmjs.com/package/@grucloud/module-aws-load-balancer)

### Modules for K8s resources

The local module defining the app on the k8s side is located at [base](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/base).

There is no trace of manifests in YAML, instead, Kubernetes manifests are described in Javascript, allowing the use of variables, conditionals, loops, importing code, and even the use of a debugger. Therefore, GruCloud is an alternative to _helm_.

### Resources

From the infrastructure code, 2 kinds of visual representation can be generated with the GruCloud CLI **gc**:

- a mind map indicating the type of the resource: `gc tree`
- a diagram showing the relationship between the resources: `gc graph`

#### Mindmap

![resources-mindmap.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-mindmap.svg)

#### Diagram

The following [diagram](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/diagram-target.svg) shows the AWS and K8s resources and their relashionship:

![diagram-target.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/diagram-target.svg)

## Workflow

The next flowchart tells the actions to perform to configure, deploy, update and destroy this infrastructure:

![EKS full stack](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/eks-lean-workflow.svg)

### Requirements

#### AWS CLI

![AWS Requirements](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/aws-requirements.svg)

#### GruCloud CLI:

![gc-cli-install](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-cli-install.svg)

#### Getting the source code

![project-setup](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-project-setup.svg)

> This example is located at `examples/starhackit/eks-lean`

### Configuration

#### Amazon EKS

The first part of this deployment is to create an EKS control plane, a node group for the workers, and all their numerous dependencies.

Configuration for the AWS resources is located at [configAws.js](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/configAws.js)

Set the **rootDomainName** and **domainName** according to your use case

> For end-to-end automation, the **rootDomainName** should be registered or transferred to the AWS Route53 service.

#### K8s

The second part is the Kubernetes deployment of the full-stack application composed of a React front end, a Node backend, Postgres as the SQL database, and finally Redis for the cache and published/subscriber models.

Configuration for the K8s resources is located at [configK8s.js](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/configK8s.js)

> When the backend container is changed to another backend, do not forget to change the target group health check in **configAWS.js**

### GruCloud workflow

This chart depicts the workflow with the main **gc** commands:

- gc info
- gc graph
- gc apply
- gc list
- gc destroy

![grucloud commands](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-cli-commands.svg)

#### Listing

Let's find out if everything is set up properly by listing the live resources from AWS:

```sh
gc list
```

```txt
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 29/29
k8s
  Initialising
  Listing 0/8
List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                           │
├────────────────────┬──────────────────────────────────────────────────────────────────────────┤
│ IamPolicy          │ AmazonEKSClusterPolicy                                                   │
│                    │ AmazonEKSVPCResourceController                                           │
│                    │ AmazonEKSWorkerNodePolicy                                                │
│                    │ AmazonEC2ContainerRegistryReadOnly                                       │
│                    │ AmazonEKS_CNI_Policy                                                     │
├────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Route53Domain      │ grucloud.org                                                             │
├────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Vpc                │ default                                                                  │
├────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ InternetGateway    │ igw-9c2f1ae7                                                             │
├────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ SecurityGroup      │ default                                                                  │
├────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ Subnet             │ default                                                                  │
│                    │ default                                                                  │
│                    │ default                                                                  │
│                    │ default                                                                  │
│                    │ default                                                                  │
│                    │ default                                                                  │
├────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ RouteTable         │ rtb-19753867                                                             │
└────────────────────┴──────────────────────────────────────────────────────────────────────────┘
19 resources, 8 types, 1 provider
Command "gc l" executed in 5s
```

Note the presence of a default VPC, subnets, security group, and internet gateway.

> Verify that the domain name is registered with Route53Domain, in this case, _grucloud.org_

The Kubernetes control created by EKS is not up yet, as a consequence, listing the k8s resources cannot be retrieved at this stage.

#### Deploying

It is show time for deploying all the AWS and Kubernetes resources in one command:

```sh
gc apply
```

The app should be now running with Kubernetes on AWS after 15 minutes.

When all the resources are created, custom code can be invoked in [hook.js](./hook.js).
In this example, we verify access to the webserver and the API server securely.

The _kubeconfig_ has been updated with the endpoint from the EKS cluster.

```sh
kubectl config current-context
```

```txt
arn:aws:eks:eu-west-2:999541460000:cluster/cluster
```

Let's list and produce a diagram of the AWS resources freshly created:

```sh
gc list -p aws --graph -a --default-exclude --types-exclude Certificate --types-exclude Route53Domain --types-exclude NetworkInterface
```

![diagram-live.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/diagram-live.svg)

Notice that the _NodeGroup_ has created an _AutoScaling Group_, which in turn creates EC2 instances, instance profiles, and volumes.

#### Updating

Let's update the cluster with another version of the front end.
Edit [configK8s.js](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/configK8s.js) and change the frontend version.

The `gc apply` command will find out the difference between the expected version and the deployed version.

```txt
Querying resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 30/30
  ✓ Querying
    ✓ HostedZone 1/1
    ✓ Certificate 1/1
    ✓ Route53Record 2/2
    ✓ Vpc 1/1
    ✓ InternetGateway 1/1
    ✓ Subnet 4/4
    ✓ RouteTable 3/3
    ✓ Route 3/3
    ✓ ElasticIpAddress 1/1
    ✓ NatGateway 1/1
    ✓ IamRole 2/2
    SecurityGroup 3/4
    ✓ SecurityGroupRuleIngress 6/6
    ✓ SecurityGroupRuleEgress 1/1
    ✓ KmsKey 1/1
    ✓ EKSCluster 1/1
    ✓ EKSNodeGroup 1/1
    ✓ LoadBalancer 1/1
    ✓ TargetGroup 2/2
    ✓ Listener 2/2
    ✓ Rule 3/3
✓ k8s
  ✓ Initialising
  ✓ Listing 8/8
  ✓ Querying
    ✓ Namespace 1/1
    ✓ ConfigMap 2/2
    ✓ StatefulSet 2/2
    ✓ Service 4/4
    ✓ Deployment 2/2
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Deployment from k8s                                                                              │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────────────────────────────┐  │
│ │ UPDATE: name: default::web, id: web                                                           │  │
│ ├───────────────────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Key: spec                                                                                     │  │
│ ├───────────────────────────────────────────────┬───────────────────────────────────────────────┤  │
│ │ - template:                                   │ + template:                                   │  │
│ │   spec:                                       │   spec:                                       │  │
│ │     containers:                               │     containers:                               │  │
│ │       0:                                      │       0:                                      │  │
│ │         image: fredericheem/ui:v10.14.0       │         image: fredericheem/ui:v10.15.0       │  │
│ │                                               │                                               │  │
│ └───────────────────────────────────────────────┴───────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider aws                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                            │
├────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ default::web                                                           │
└────────────────────┴────────────────────────────────────────────────────────────────────────┘
? Are you sure to deploy 1 resource, 1 type on 1 provider? › (y/N)
```

It is the equivalent of `kubectl apply`, except that `kubectl` is "fire and forget", but _gc_ apply the changes and waits for the resources to be ready before returning.

#### Destroying

Running Kubernetes cluster on AWS or other cloud providers is not cheap. Stop paying when the cluster is not used with one command:

```sh
gc destroy
```

Resources will be destroyed in the right order and automatically.

## Links

- [GitHub](https://github.com/grucloud/grucloud)
- [Documentation](https://www.grucloud.com/docs/Introduction)
- [Website](https://www.grucloud.com)
- [Twitter](https://twitter.com/grucloud_iac)
