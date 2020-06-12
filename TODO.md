## Bugs

## Common:

- replace <<NA>> with id or name
- replace \_.merge
- set environment: prod , dev etc...
- compare or compareObject
- CPD

## Cli

- add "Are you sure to destroy these 3 resources" in red
- save result to json
- config file with options

## TODO Aws:

error: upsertResources error:Error: Resource SecurityGroup/securityGroup is not tagged correctly

AssociatePublicIpAddress, do we need the subnet and sg in interface ?

- vpc and subnet: when up state is "available"
- handle error when retry times out
- subnet

## TODO Goggle

then check ip address from instance is the one from address and check status == "RUNNING"

- instance: add service account
- is config.tag still being used ? yes but in instance device name, rename tag to something else
- create new project such as grucloud-e2e
- WARNING when gloud config is difference from our config, i.e region
- document ssh key in meta data
- add service account

## TODO Mock

Add mock example
