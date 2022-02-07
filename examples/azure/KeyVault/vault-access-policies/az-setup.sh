#!/bin/sh
REGION=canadacentral
RESOURCE_GROUP=rg-vault-ap
KEY_VAULT=gcvaultaccesspolicy
KEY_NAME=mykey

echo "Create Resource Group $RESOURCE_GROUP"
az group create -n $RESOURCE_GROUP -l canadacentral

echo "Create key vault $KEY_VAULT"
az keyvault create -n $KEY_VAULT -g $RESOURCE_GROUP -l $REGION --enable-purge-protection true --enable-soft-delete true

echo "Create key $KEY_NAME"
az keyvault key create --vault-name $KEY_VAULT --name $KEY_NAME --protection software

keyVaultId=$(az keyvault show --name $KEY_VAULT --query "[id]" -o tsv)
echo "keyVaultId:"
echo $keyVaultId

# keyVaultKeyUrl=$(az keyvault key show --vault-name $KEY_VAULT  --name $KEY_NAME  --query "[key.kid]" -o tsv)
# echo "keyVaultKeyUrl:"
# echo $keyVaultKeyUrl
