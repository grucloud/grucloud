## Bugs

## Common:

- PROMPT='%4~ %# '
- displayPlan error
- add a delete summary
- iam deal with deleted user

## Web site

- https://alternativeto.net/Manage/AddItem.aspx
- sitemap

## Cli

## Azure

- check resource group name
- check machine type: https://docs.microsoft.com/en-us/rest/api/compute/availabilitysets/listavailablesizes#virtualmachinesize

- doc

## TODO Aws:

- check S3 Tags
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

- service account managedByUs false despite description: Managee By GruCloud
- vm instance: network interface from vpc network
- validate config: check project and region

- https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2

- rename in gcp
- WARNING when gloud config is difference from our config, i.e region

## TODO Mock

## Nice to have

- https://www.cncf.io/
- https://jonathan.bergknoff.com/journal/terraform-pain-points/
- terraform workspace new staging
- terraform workspace select (staging/production)
- https://cloudcraft.co/
