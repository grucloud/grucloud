## Bugs

-inferName OpenIDConnectProvider

- ✖ Deploying  
   ✖ AppRunner::Service 0/1 Error in assuming access role arn:aws:iam::840541460064:role/service-role/AppRunnerECRAccessRole
- example vpc-use still using make and use
- check stage for all providers

## Common:

- https://stackshare.io/terraform/alternatives

- const getById = getByIdCore({ fieldIds: "AllocationIds", getList });

- PROMPT='%4~ %# '
- iam deal with deleted user

## Web site

## Cli

## Kubernetes

## Azure

NetworkSecurityGroup defaultSecurityRules in gencode

remove aks-managed-createOperationID from tags

- tags: {
  "aks-managed-createOperationID": "fd8c6df9-abfd-4547-b838-643b0a994d6a",
  creationSource: "vmssclient-aks-agentpool-16282925-vmss",
  orchestrator: "Kubernetes:1.21.7",
  poolName: "agentpool",
  resourceNameSuffix: "18663747",
  },

- makeFirewallPolicy - logAnalyticsResources workspace dep as an array
- key or vault dependencies ?
- DBforPostgreSQL/ServerKey dep key
- Web::WebAppConfiguration dep Network::Subnet

- ContainerService::ManagedCluster dep OperationalInsights::Workspace

- Network::VirtualNetworkGateway dep Web::Site
- Network::VirtualNetworkGatewayConnection dep Web::Site

- Network::ApplicationGateway dep certificate and vault/key-
- Network::FirewallPolicy dep secret
- CertificateRegistration::AppServiceCertificateOrder dep Vault
- CertificateRegistration::AppServiceCertificateOrderCertificate dep vault
- Web::CertificateOrder dep vault

- remove identity from
  "type": "TaskRun",
  "group": "ContainerRegistry",
  "pickPropertiesCreate": [
  "identity.type",
  "identity.

- env var for "type": "Token",
  "group": "ContainerRegistry",

"type": "PrivateEndpointConnection",
"group": "KeyVault",

- aks-vault:
  "error": {
  "code": "ConflictError",
  "message": "A vault with the same name already exists in deleted state. You need to either recover or purge existing key vault. Follow this link https://go.microsoft.com/fwlink/?linkid=2149745 for more information on soft delete."
  }

- RestorePoint
  AppServiceEnvironments_ListMultiRolePools => AppServiceEnvironments_GetMultiRolePool

- missing getAll for WebApps_ListConfigurations => WebApps_GetConfiguration
  WebAppInstanceProcess missing dependency

az::Storage::FileShare pickProperties: "properties.metadata",

- delete NSG : failed with status code 429 A retry
- cat ../my-beautiful-diagram.puml | curl -v -H "Content-Type: text/plain" --data-binary @- http://localhost:8080/png/ --output - > /tmp/out.png

- az vm gc a : ✖ Compute::VirtualMachine 0/1 Request failed with status code 503 The request timed out. Diagnostic information: timestamp '20220204T234950Z', subscription id 'e012cd34-c794-4e35-916f-f38dcd8ac45c', tracking id '30c0a10d-83ab-42d6-a3f0-0253ee81c31f', request correlation id '30c0a10d-83ab-42d6-a3f0-0253ee81c31f'.
- application-gateway: gc a -f: Network::Subnet 0/2 Request failed with status code 409 Another operation on this or dependent resource is in progress. To retrieve status of the operation use uri:

## Aws2gc

- ec2 image

## Aws

- aws user tags for all resources
- compare refactor
- compare Tags
- RDS DBCluster AvailabilityZones
- ECR.makeRegistry delete
- gc d -f -a: APIGateway::DomainName 1/2 in grey
- inferName for SecurityGroup, and Route Table
- Nat gateway handle deleting
- EC2 Instance placement
- Route display internet gateway or nat gateway in configDefault
- resource schema

- Lambda env var dependencies with DynamoDB table
- Policy dependencies with other resources: DynamoDB table

- ec2::SecurityGroupRuleIngress 0/1 client.update is not a function
- document create key pair
- throw error => throw Error(error.message);
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

- discover API: https://www.googleapis.com/discovery/v1/apis/compute/v1/rest

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

## Diagram

- check git repo from frontend https://isomorphic-git.org/docs/en/getRemoteInfo
  add k8s
  backup data.
  privacy policy
  resource table styling
