## Bugs

## Common:

- refactor skiping test
- add command duration
- TagName.js move to scaleway
- await client.create({ name: resourceName, payload }); should return {id}
- compare or compareObject
- https://cloudcraft.co/

## Cli

- fix displayDeployError
- properties:
  tags
  {
  properties: {}

}

## Azure

- Subnet
- Network security group
- network_interface
- public ip
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
