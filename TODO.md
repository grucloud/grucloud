## Bugs

- Are you sure to destroy 9 resources ? despite only one resource to destroy

## Common:

- client type redundant ?
- do not use index.js for S3 and EC2

- Provide a summary option for `plan` and/or `apply`

gc d --name grucloud-s3bucket-test
No resources to destroy

gc p --provider aws
error: unknown option '--provider'

- terraform output
- add multiple example for each provider

* compare or compareObject

## Cli

- text wrap in table

## Azure

- check resource group name
- check machine type: https://docs.microsoft.com/en-us/rest/api/compute/availabilitysets/listavailablesizes#virtualmachinesize

- doc

## TODO Aws:

- getList params in ec2.describeSubnets and
- do not display default acl
- add example code in AwsGettingStarted
- listObjectsV2
- aws.config.loadFromPath('./AwsConfig.json');

- error padend

aws iam create-user --user-name terraform-user
aws iam put-user-policy --user-name terraform-user --policy-name least-privilege --policy-document file://policy.json

- add tags for every resource
- public Ip address in example

- s3 notificationConfiguration example with ServerLess function, sns

- s3 analytics configuration

* cloudtrail

## TODO Goggle

- resource name 'sa-dev' already exists

- document enabling api via gcloud
- vm instance depends on firewall
- vm instance: network interface from vpc network
- validate config: check project and region

- https://cloud.google.com/community/tutorials/getting-started-on-gcp-with-terraform
- https://medium.com/faun/creating-reusable-infrastructure-with-terraform-on-gcp-e17745ac4ff2

- metadata = {
  ssh-keys = "INSERT_USERNAME:\${file("~/.ssh/id_rsa.pub")}"
  }
  }
- google_project_iam_member

- ssh `terraform output ip`
- rename in gcp
- instance: add service account
- is config.tag still being used ? yes but in instance device name, rename tag to something else
- create new project such as grucloud-e2e
- WARNING when gloud config is difference from our config, i.e region
- document ssh key in meta data
- add service account

## TODO Mock

## Nice to have

- https://www.cncf.io/
- https://jonathan.bergknoff.com/journal/terraform-pain-points/
- terraform workspace new staging
- terraform workspace select (staging/production)
- https://cloudcraft.co/
