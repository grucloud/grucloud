## Bugs

- RouteTable should accepts an array of subnet
- kubectl logs -n kube-system deployment.apps/aws-load-balancer-controller

User "system:serviceaccount:kube-system:aws-load-balancer-controller" cannot list resource "pods" in API group "" at the cluster scope

- EC2 │ ec2-volume-test, ec2-volume-test
- gc a: when an assert is thrown, it does not exit but ask for deployment confirmation.
- use why-is-node-running to find out why the app is not exiting
- code coverage with monorepo
- check stage for all providers

## Common:

- kubectl edit ingress ingress
- https://stackshare.io/terraform/alternatives
- case where provider does have any resources
-
- add projectName and use it as the title of the graph
- destroy: use live instead of id
- gc d : EC2 │ web, web-iam, , web-server
  empty name !
- const getById = getByIdCore({ fieldIds: "AllocationIds", getList });

- ebs volume: use lsblk ?
- file -s /dev/xvdf
- mkfs -t ext4 /dev/xvdf
- dh -hT
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

- licences github
- https://alternativeto.net/Manage/AddItem.aspx
- sitemap

## Cli

## Kubernetes

- kubectl cluster-info

## Azure

- check resource group name
- check machine type: https://docs.microsoft.com/en-us/rest/api/compute/availabilitysets/listavailablesizes#virtualmachinesize

- doc

## TODO Aws:

- https://kubernetes.github.io/ingress-nginx/deploy/

- getBucketTagging should not log error when tad dos not exist.
- delete load balancers in vpc
- minikite gc d -a: ✖ PersistentVolume 0/2 Request failed with status code 404
- https://docs.aws.amazon.com/eks/latest/userguide/metrics-server.html
- https://docs.aws.amazon.com/eks/latest/userguide/dashboard-tutorial.html

- s3 exmaple: gc d tries to delete roles
- gc d -a: ✖ PersistentVolume 0/2 Request failed with status code 404: 404 should be ok

- https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
- https://docs.aws.amazon.com/eks/latest/userguide/load-balancing.html
- https://medium.com/cloudzone/aws-alb-ingress-controller-guide-ec16233f5903
- https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/
- aws load balancer ingress https://github.com/stacksimplify/aws-eks-kubernetes-masterclass/blob/f46e2b15533a96b7641662656cf5deebb63d5dae/11-DevOps-with-AWS-Developer-Tools/Application-Manifests/kube-manifests/03-DEVOPS-Nginx-ALB-IngressService.yml

- CloudFrontDistribution 0/1 The specified SSL certificate doesn't exist, isn't in us-east-1 region, isn't valid, or doesn't include a valid certificate chain

- VpcEndpoint
- https://medium.com/dev-genius/create-an-amazon-eks-cluster-with-managed-node-group-using-terraform-a3b50d276b13
- security group update

- ssh should use use kp.pem instead of ssh-add
- add example code in AwsGettingStarted
- aws.config.loadFromPath('./AwsConfig.json');

- error padend

aws iam create-user --user-name terraform-user
aws iam put-user-policy --user-name terraform-user --policy-name least-privilege --policy-document file://policy.json

- s3 notificationConfiguration example with ServerLess function, sns

- s3 analytics configuration

* cloudtrail

## TODO Goggle

- infer projectId from projectName
- The field 'entity.managedZone.dnsName' cannot be modified.
- gcp object path properties

- isExpectedException: (error) => {
  return error.response?.status === 409;
  },
- service account managedByUs false despite description: Managee By GruCloud
- vm instance: network interface from vpc network
- validate config: check project and region

- https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2

- rename in gcp

## TODO Mock

## Nice to have

- terraform workspace new staging
- terraform workspace select (staging/production)

* retry when deleting:

"Input": {
"data": [undefined]
"url": "delete https://compute.googleapis.com/compute/v1/projects/grucloud-e2e/global/networks/99300703649411466"
}
"Message": "Request failed with status code 400"
"Output": {
"error": {
"code": 400
"errors": [
{
"domain": "global"
"message": "The resource 'projects/grucloud-e2e/global/networks/vpc-dev' is not ready"
"reason": "resourceNotReady"
}
]
"message": "The resource 'projects/grucloud-e2e/global/networks/vpc-dev' is not ready"
}
}

## Bugs

nodeGroup result: {
"nodegroupName": "node-group-public-cluster",
"nodegroupArn": "arn:aws:eks:eu-west-2:840541460064:nodegroup/cluster/node-group-public-cluster/f6bc56cd-aa2e-5c37-7aa1-2eb8c607c661",
"clusterName": "cluster",
"version": "1.18",
"releaseVersion": "1.18.9-20210329",
"createdAt": "2021-04-07T18:32:23.002Z",
"modifiedAt": "2021-04-07T18:32:37.117Z",
"status": "CREATE_FAILED",
"capacityType": "ON_DEMAND",
"scalingConfig": {
"minSize": 1,
"maxSize": 1,
"desiredSize": 1
},
"instanceTypes": [
"t2.medium"
],
"subnets": [
"subnet-0b684fe8afd1bcdee",
"subnet-0aab30dda9279c1fe"
],
"amiType": "AL2_x86_64",
"nodeRole": "arn:aws:iam::840541460064:role/role-node-group",
"resources": {
"remoteAccessSecurityGroup": null
},
"diskSize": 20,
"health": {
"issues": [
{
"code": "Ec2SubnetInvalidConfiguration",
"message": "One or more Amazon EC2 Subnets of [subnet-0b684fe8afd1bcdee, subnet-0aab30dda9279c1fe] for node group node-group-public-cluster does not automatically assign public IP addresses to instances launched into it. If you want your instances to be assigned a public IP address, then you need to enable auto-assign public IP address for the subnet. See IP addressing in VPC guide: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html#subnet-public-ip",
"resourceIds": [
"subnet-0b684fe8afd1bcdee",
"subnet-0aab30dda9279c1fe"
]
}
]
},
