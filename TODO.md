## Bugs

npm WARN deprecated querystring@0.2.0: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.
npm WARN deprecated uuid@3.3.2: Please upgrade to version 7 or higher. Older versions may use Math.random() in certain circumstances, which is known to be problematic. See https://v8.dev/blog/math-random for details.

- examples mock with createProvider
- order
  Querying resources on 1 provider: aws
  ✓ aws
  ✓ Initialising
  ✓ Listing 21/21
  ✓ Querying
  ✓ iam::Role 1/1
  ✓ iam::InstanceProfile 1/1
  ✓ ec2::Vpc 1/1
  ✓ ec2::Subnet 2/2
  ✓ ec2::KeyPair 1/1
  ✓ ec2::SecurityGroup 1/1
  ✓ ec2::SecurityGroupRuleIngress 1/1
  ✓ ec2::LaunchTemplate 1/1
  ✓ autoscaling::AutoScalingGroup 1/1
- check stage for all providers
- compare refactor
- compare Tags

## Diagram

- check git repo from frontend https://isomorphic-git.org/docs/en/getRemoteInfo
  add k8s
  backup data.
  privacy policy
  resource table styling

- SecurityGroup self

## Common:

- TODO add client.toString()
- https://stackshare.io/terraform/alternatives
-
- add projectName and use it as the title of the graph
- destroy: use live instead of id
- const getById = getByIdCore({ fieldIds: "AllocationIds", getList });

- PROMPT='%4~ %# '
- iam deal with deleted user

## Web site

## Cli

## Kubernetes

- APIService problem deleting some
- gc graph: wrong namespace, it is default, should be myapp
- minikite gc d -a: ✖ PersistentVolume 0/2 Request failed with status code 404
- kubectl cluster-info

## Azure

- remove NetworkWatcherRG from list
- check resource group name
- check machine type: https://docs.microsoft.com/en-us/rest/api/compute/availabilitysets/listavailablesizes#virtualmachinesize

- doc

## Aws2gc

- ec2 image
- EKS cluster tags

## Aws

- examples ecr use accountId from config in configUpdate1

- gc d -f -a: ✖ ec2::NetworkInterface 0/1 Network interface 'eni-0f496fb1a5988286d' is currently in use.

- ✖ kms::Key 0/1 User: arn:aws:iam::840541460064:root is not authorized to perform: kms:DisableKey on resource: arn:aws:kms:us-east-1:84054146006
  4:key/79507edb-c301-43a8-8217-524d24f6daa7
- ec2::SecurityGroupRuleIngress 0/1 client.update is not a function
- document create key pair
- document apigateway
- throw error => throw Error(error.message);
- https://aws.amazon.com/blogs/aws/easily-manage-security-group-rules-with-the-new-security-group-rule-id/

- ec2 update: handle UserData
- Resource pages

- aws_route53_delegation_set

- https://docs.aws.amazon.com/eks/latest/userguide/metrics-server.html
- https://docs.aws.amazon.com/eks/latest/userguide/dashboard-tutorial.html

- https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
- https://docs.aws.amazon.com/eks/latest/userguide/load-balancing.html
- https://medium.com/cloudzone/aws-alb-ingress-controller-guide-ec16233f5903
- https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/
- aws load balancer ingress https://github.com/stacksimplify/aws-eks-kubernetes-masterclass/blob/f46e2b15533a96b7641662656cf5deebb63d5dae/11-DevOps-with-AWS-Developer-Tools/Application-Manifests/kube-manifests/03-DEVOPS-Nginx-ALB-IngressService.yml

- VpcEndpoint
- https://medium.com/dev-genius/create-an-amazon-eks-cluster-with-managed-node-group-using-terraform-a3b50d276b13
- security group update

- aws.config.loadFromPath('./AwsConfig.json');

- error padend

aws iam create-user --user-name terraform-user
aws iam put-user-policy --user-name terraform-user --policy-name least-privilege --policy-document file://policy.json

- s3 notificationConfiguration example with ServerLess function, sns

- s3 analytics configuration

* cloudtrail

## TODO Goggle

- examples vm-ssh key: create key pair with https://github.com/juliangruber/keypair

- ✖ VmInstance 0/1 Request failed with status code 400 Invalid value for field 'resource.networkInterfaces[0].subnetwork': 'projects/grucloud-test/regions/europe-west4/subnetworks/default'. The referenced subnetwork resource cannot be found.
- vminstance with service account
- The field 'entity.managedZone.dnsName' cannot be modified.
- gcp object path properties

- isExpectedException: (error) => {
  return error.response?.status === 409;
  },
- service account managedByUs false despite description: Managee By GruCloud
- vm instance: network interface from vpc network
- validate config: check project and region

- https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2

## TODO Mock

## Nice to have

- terraform workspace new staging
- terraform workspace select (staging/production)

* retry when deleting:

"Input": {
"data": [undefined]
"url": "delete https://compute.googleapis.com/compute/v1/projects/grucloud-test/global/networks/99300703649411466"
}
"Message": "Request failed with status code 400"
"Output": {
"error": {
"code": 400
"errors": [
{
"domain": "global"
"message": "The resource 'projects/grucloud-test/global/networks/vpc-dev' is not ready"
"reason": "resourceNotReady"
}
]
"message": "The resource 'projects/grucloud-test/global/networks/vpc-dev' is not ready"
}
}

## Nice to have
