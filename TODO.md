## Bugs

RestorePoint
AppServiceEnvironments_ListMultiRolePools => AppServiceEnvironments_GetMultiRolePool

- missing getAll for WebApps_ListConfigurations => WebApps_GetConfiguration
  WebAppInstanceProcess missing dependency

az::Storage::FileShare pickProperties: "properties.metadata",

- check stage for all providers
- compare refactor
- compare Tags

## Diagram

- check git repo from frontend https://isomorphic-git.org/docs/en/getRemoteInfo
  add k8s
  backup data.
  privacy policy
  resource table styling

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

- cat ../my-beautiful-diagram.puml | curl -v -H "Content-Type: text/plain" --data-binary @- http://localhost:8080/png/ --output - > /tmp/out.png

- gc new :
  az provider register --namespace Microsoft.Network
  az provider register --namespace Microsoft.Compute

- Network::Subnet 0/1 Request failed with status code 400 Subnet subnet is in use by /subscriptions/8e0e234e-8384-438d-a652-105826b63bc9/resourceGroups
  /resource-group/providers/Microsoft.Network/networkInterfaces/network-interface/ipConfigurations/ipconfig and cannot be deleted. In order to delete the subnet, delete
  all the resources within the subnet. See aka.ms/deletesubnet.

- remove NetworkWatcherRG from list
- doc

## Aws2gc

- ec2 image
- EKS cluster tags

## Aws

- gc d -f -a: APIGateway::DomainName 1/2 in grey
- inferName for SecurityGroup, and Route Table
- Nat gateway handle deleting
- EC2 Instance placement
- Route display internet gateway or nat gateway in configDefault
- resource schema

- Lambda env var dependencies with DynamoDB table
- Policy dependencies with other resources: DynamoDB table

- ✖ kms::Key 0/1 User: arn:aws:iam::840541460064:root is not authorized to perform: kms:DisableKey on resource: arn:aws:kms:us-east-1:84054146006
  4:key/79507edb-c301-43a8-8217-524d24f6daa7
- ec2::SecurityGroupRuleIngress 0/1 client.update is not a function
- document create key pair
- throw error => throw Error(error.message);
- https://aws.amazon.com/blogs/aws/easily-manage-security-group-rules-with-the-new-security-group-rule-id/

- UserData: ec2 update and displayResource
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

aws iam create-user --user-name terraform-user
aws iam put-user-policy --user-name terraform-user --policy-name least-privilege --policy-document file://policy.json

- s3 notificationConfiguration example with ServerLess function, sns

- s3 analytics configuration

* cloudtrail

## TODO Goggle

- fix cannotBeDeleted for Disk:

- ✖ Destroying  
   ✖ compute::Disk 0/1 Request failed with status code 400 The disk resource 'projects/grucloud-test/zones/southamerica-east1-b/disks/instance-1' is already being used by 'projects/grucloud-test/zones/southamerica-east1-b/instances/instance-1'
  ✓ compute::VmInstance 1/1

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

- examples mock with createProvider

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
