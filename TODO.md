## Bugs

## Common:

after create, is up by id, not name

- warn if dev.json is not present

* compare or compareObject

## Cli

## TODO Aws:

error: upsertResources error:Error: Resource SecurityGroup/securityGroup is not tagged correctly

when deploying only ec2 without sg, subnet and vpc:
"No subnets found for the default VPC 'vpc-bbbafcd3'. Please specify a subnet.",

AssociatePublicIpAddress, do we need the subnet and sg in interface ?

- vpc and subnet: when up state is "available"
- handle error when retry times out
- subnet

## TODO Goggle

- instance: add service account
- is config.tag still being used ? yes but in instance device name, rename tag to something else
- create new project such as grucloud-e2e
- WARNING when gloud config is difference from our config, i.e region
- document ssh key in meta data
- add service account

## TODO Mock

Add mock example
