## Bugs

## Common:

- add azure in multi example
- provide CRUD url to CoreClient
- add command duration
- TagName.js move to scaleway
- await client.create({ name: resourceName, payload }); should return {id}
- compare or compareObject
- https://cloudcraft.co/

## Cli

- text wrap in table

## Azure

- network_interface: https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces
- public ip: https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces
- virtual_machine

## TODO Aws:

- when deploying only ec2 without sg, subnet and vpc:
  "No subnets found for the default VPC 'vpc-bbbafcd3'. Please specify a subnet.",

- error: upsertResources error:Error: Resource SecurityGroup/securityGroup is not tagged correctly
- AssociatePublicIpAddress, do we need the subnet and sg in interface ?
- handle error when retry times out

## TODO Goggle

- rename in gcp
- instance: add service account
- is config.tag still being used ? yes but in instance device name, rename tag to something else
- create new project such as grucloud-e2e
- WARNING when gloud config is difference from our config, i.e region
- document ssh key in meta data
- add service account

## TODO Mock

Add mock example
