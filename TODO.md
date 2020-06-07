## Bugs

## Common:

- remove status use list --our instead
- set environment: prod , dev etc...
- replace "<<NA>>" with the resource name if the id is not available
- compare or compareObject

## Cli

- save result to json
- add command alias
- config file with options
- gc list by name
- return negative value in case of error
- gc list -o should return a message when empty

## TODO Aws:

- handle error when retry times out
- subnet

## TODO Goggle

- split testProviderLifeCycle, do not destroy inside,
  then check ip address from instance is the one from address and check status == "RUNNING"
- instance: add service account
- is config.tag still being used ? yes but in instance device name, rename tag to something else
- create new project such as grucloud-e2e
- WARNING when gloud config is difference from our config, i.e region
- document ssh key in meta data
- add service account

## TODO Mock

Add mock example
