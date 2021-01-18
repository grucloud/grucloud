## Bugs

## Common:

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

- licences github
- https://alternativeto.net/Manage/AddItem.aspx
- sitemap

## Cli

## Azure

- check resource group name
- check machine type: https://docs.microsoft.com/en-us/rest/api/compute/availabilitysets/listavailablesizes#virtualmachinesize

- doc

## TODO Aws:

- security group update
- invalidate cloufront cache
- CallerReference distribution
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
- refactor: client.getList({
  resources: provider.getResourcesByType(client.spec.type),

- service account managedByUs false despite description: Managee By GruCloud
- vm instance: network interface from vpc network
- validate config: check project and region

- https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2

- rename in gcp

## TODO Mock

## Nice to have

- https://www.cncf.io/
- https://jonathan.bergknoff.com/journal/terraform-pain-points/
- terraform workspace new staging
- terraform workspace select (staging/production)
- https://cloudcraft.co/
