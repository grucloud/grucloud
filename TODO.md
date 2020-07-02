## Bugs

## Common:

- prevent creating the same instance
- compare or compareObject

for reference Error:
"state": "ERROR",
"error": {}

## Cli

- text wrap in table

## Azure

## TODO Aws:

- error: upsertResources error:Error: Resource SecurityGroup/securityGroup is not tagged correctly
- AssociatePublicIpAddress, do we need the subnet and sg in interface ?
- handle error when retry times out

## TODO Goggle

- https://cloud.google.com/community/tutorials/getting-started-on-gcp-with-terraform
- metadata = {
  ssh-keys = "INSERT_USERNAME:\${file("~/.ssh/id_rsa.pub")}"
  }
  }
- google_compute_firewall
- google_compute_network
- google_compute_subnetwork
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

- https://cloudcraft.co/
