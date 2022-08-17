#!/bin/bash

# Variables
rg=rg-ssh-vault-rbac
location=uksouth
key_vault_name="gcvaultrbac"
key_name=mykey

# Resources::ResourceGroup
# https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-creates
az group create -n "$rg" -l "$location"

# https://docs.microsoft.com/en-us/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create
echo "Create key vault $key_vault_name"
az keyvault create -n "$key_vault_name" -g "$rg" --enable-rbac-authorization true --enable-purge-protection true --enable-soft-delete true

# https://docs.microsoft.com/en-us/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-create
echo "Create key $key_vault_name"
az keyvault key create --vault-name "$key_vault_name" --name "$key_name" --protection software

keyVaultId=$(az keyvault show --name $key_vault_name --query "[id]" -o tsv)
echo "keyVaultId:"
echo $keyVaultId