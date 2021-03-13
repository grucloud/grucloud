## Bugs

## Common:

- case where provider does have any resources

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

- multi-provider aws, k8s, ipProviderUp is down, gc d -f fails
- https://docs.aws.amazon.com/eks/latest/userguide/metrics-server.html
- https://docs.aws.amazon.com/eks/latest/userguide/dashboard-tutorial.html

- s3 exmaple: gc d tries to delete roles
- gc d -a: ✖ PersistentVolume 0/2 Request failed with status code 404: 404 should be ok

- gc d -a : resource sg-08c62cd971a2e1d43 has a dependent object
  sg depends on sg so hard to find out the dependencies, add a retry on DependencyViolation as a kludge
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

- https://kubedex.com/
- https://www.cncf.io/
- https://jonathan.bergknoff.com/journal/terraform-pain-points/
- terraform workspace new staging
- terraform workspace select (staging/production)
