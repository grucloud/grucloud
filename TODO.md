## Bugs

## Common:

- displayresources being created and destroyed
- provide CRUD url to CoreClient
- TagName.js move to scaleway
- compare or compareObject
- https://cloudcraft.co/

for reference Error:
"state": "ERROR",
"error": {}

## Cli

- text wrap in table

## Azure

debug: destroy url: /subscriptions/8e0e234e-8384-438d-a652-105826b63bc9/resourceGroups/resource-group-dev/providers/Microsoft.Network/networkSecurityGroups/security-group-dev/?api-version=2020-05-01
info: tx https://management.azure.com
error: delete azure/security-group-dev error:Error: timeout of 30000ms exceeded
error: delete azure/security-group-dev stack:Error: timeout of 30000ms exceeded

at createError (/Users/fredericheem/grucloud/node_modules/axios/lib/core/createError.js:16:15)

- public ip: https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces

## TODO Aws:

- zone in config ? check if zone belongs to region
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
