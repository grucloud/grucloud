## Bugs

## Common:

gc d --name grucloud-s3bucket-test
No resources to destroy

- remove ramda

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

- add tags for every resource
- public Ip address in example

- s3
- cloudtrail

## TODO Goggle

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

- terraform workspace new staging
- terraform workspace select (staging/production)
- https://cloudcraft.co/
