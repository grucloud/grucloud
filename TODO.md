## Bugs

- gc l -t Record is broken, it does not fetch the dependencies
- gc a: when an assert is thrown, it does not exit but ask for deployment confirmation.
- check stage for all providers

## Diagram

- check git repo from frontend https://isomorphic-git.org/docs/en/getRemoteInfo
  add k8s
  backup data.
  privacy policy
  resource table styling

- DBInstance : findDependencies KmsKeyId
- SecurityGroup self

## Common:

- gc info with config for gcp and azure
- https://stackshare.io/terraform/alternatives
- case where provider does have any resources
-
- add projectName and use it as the title of the graph
- destroy: use live instead of id
- gc d : EC2 │ web, web-iam, , web-server
  empty name !
- const getById = getByIdCore({ fieldIds: "AllocationIds", getList });

- gcp: projectName function to field
- PROMPT='%4~ %# '
- iam deal with deleted user

## Web site

- https://www.youtube.com/c/AdrianGoins/videos
- https://www.youtube.com/c/LondonAppDeveloper/about
- https://www.youtube.com/c/MarcelDempers/about
- https://www.youtube.com/c/WillBrock/about
- https://www.youtube.com/c/CloudYeti/about
- https://www.youtube.com/c/TechWorldwithNana/about
- https://www.youtube.com/c/TheCloudCoach/about
- https://www.youtube.com/c/Techtter/about
- https://www.youtube.com/c/NTFAQGuy/about
- https://www.youtube.com/user/binarythistle
- https://www.youtube.com/c/HoussemDellai/about
- https://www.youtube.com/channel/UCs6i6bHcsnu-lXwNL1th35A/about
- https://www.youtube.com/channel/UC33pBiUW51-InqrLd0BmhMQ/about

- https://alternativeto.net/Manage/AddItem.aspx

## Cli

## Kubernetes

- gc graph: wrong namespace, it is default, should be myapp
- minikite gc d -a: ✖ PersistentVolume 0/2 Request failed with status code 404
- cert-manager example
- kubectl cluster-info

## Azure

- remove NetworkWatcherRG from list
- check resource group name
- check machine type: https://docs.microsoft.com/en-us/rest/api/compute/availabilitysets/listavailablesizes#virtualmachinesize

- doc

## Aws

- https://aws.amazon.com/blogs/aws/easily-manage-security-group-rules-with-the-new-security-group-rule-id/
- eks-lean gc d -f: ✖ Subnet 0/4 You are not allowed to manage 'ela-attach' attachments.

- list ec2 instance in stopped state
- ec2 update: handle UserData

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html

- Resource pages
- delete keypair from kops
- HostedZone => Route53HostedZon
- Rule => ListenerRule

- aws_route53_delegation_set

- getBucketTagging should not log error when tad dos not exist.
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

- ssh should use use kp.pem instead of ssh-add
- aws.config.loadFromPath('./AwsConfig.json');

- error padend

aws iam create-user --user-name terraform-user
aws iam put-user-policy --user-name terraform-user --policy-name least-privilege --policy-document file://policy.json

- s3 notificationConfiguration example with ServerLess function, sns

- s3 analytics configuration

* cloudtrail

## TODO Goggle

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

- code coverage with monorepo
