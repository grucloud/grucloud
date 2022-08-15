#!/bin/bash

# Variables
rg=rg-ssh-public-key
location=uksouth
ssh_key_name="mykeypair"

# Resources::ResourceGroup
# https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-creates
az group create -n "$rg" -l "$location"

# Compute::SshPublicKey
# https://docs.microsoft.com/en-us/cli/azure/sshkey?view=azure-cli-latest#az-sshkey-create
az sshkey create --location "$location" --resource-group "$rg" --name "$ssh_key_name"   
#az sshkey create --location "$location" --resource-group "$rg" --name "$ssh_key_name" --public-key "@~/.ssh/id_rsa.pub"