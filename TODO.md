## Bugs

- check stage for all providers

## Aws

- throwIfNotAwsError accepts an array of errors

- AWS::Events::Endpoint
- CodeStarConnections Host
  Lambda EventSourceMapping:
- Amazon DynamoDB Streams
- ECSTaskSet
- AWS::XRay
- aws_servicequotas_service_quota
- Network Manager SiteToSiteVpnAttachment
  aws_networkmanager_attachment_accepter
- SNS dep with firehose
- EC2 instance, sort groups
- API Gateway v1 Authorizer

- doc:
  DeliveryStream,

- cloudwan vpc attachment
- route to core network
- fix gc l -t
- Network Manager docs
- Example with non default DB Proxy Target Group,
- AutoScalingGroup: example with serviceLinkedRole
- VpcEndpoint: example with serviceLinkedRole
- ECS taskRole vs executionRole
- Firewall deps
- ECSTask dependency check
- CodeDeployDeploymentGroup configDefault with other dependencies
- WebAclDependencies dependencies refactor
- RAMPrincipalAssociation findName
- SNSSubscription deps sqs queue
- PrincipalAssociation replace associatedEntity from config
- ipamPoolIpv6
- HostedZone name with vpc
- omit AWSLogs S3 Objects
- elb target group getByName
- apprunner example npm test

- RDS DBCluster AvailabilityZones
- Nat gateway handle deleting
- resource schema
- document create key pair
- s3 analytics configuration
- s3 object gencode is missing ACL:public-read

- CloudTrail EventDataStore EventDataStore doc

- route to NetworkInterfaceId

## Refactoring

https://rushjs.io/

## Common:

- https://stackshare.io/terraform/alternatives

## Web site

## Kubernetes

## Azure

- message: maxContentLength size of -1 exceeded │
  │ code: ERR_BAD_RESPONSE

message: Encountered an error (ServiceUnavailable) from host runtime. │
│ code: ERR_BAD_REQUEST │
│ url: /subscriptions/bff6898b-a5ee-46dc-b7b6-c163dbf1bfbd/resourceGroups/rg-app-node/providers/Microsoft.Web/sites/grucloud-test/functions?api-version=2022-03-01 │
│ status: 400 │
│ data: │
│ Code: BadRequest │
│ Message: Encountered an error (ServiceUnavailable) from host runtime. │

- Disk vault dep vanished
- gc d -a
  Compute::VirtualMachineScaleSetExtension 0/3 Request failed with status code 400 On resource 'aks-agentpool-16833683-vmss',
  extension 'AKSLinuxExtension' specifies 'vmssCSE' in its provisionAfterExtensions property, but the extension 'vmssCSE' will no
  longer exist. First, remove the extension 'AKSLinuxExtension' or remove 'vmssCSE' from the provisionAfterExtensions property of '
  AKSLinuxExtension'

- remove WebAppProcessSlot
- storage location

- App:ContainerAppsAuthConfig getAll
- NetworkSecurityGroup defaultSecurityRules in gencode

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

## Goggle

- update firewall rule
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

- service account managedByUs false despite description: Managee By GruCloud
- vm instance: network interface from vpc network

- iam deal with deleted user

- https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2

## TODO Mock

## Nice to have

- https://node-security.com/posts/certificate-generation-pure-nodejs/
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
