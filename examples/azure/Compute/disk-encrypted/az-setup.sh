#!/bin/sh
REGION=canadacentral
RESOURCE_GROUP=rg-vm-des
KEY_VAULT=rg-vm-des
KEY_NAME=deskey
DISK_ENCRYPTION_SET_NAME=des

echo "Create Resource Group $RESOURCE_GROUP"
az group create -n $RESOURCE_GROUP -l canadacentral

echo "Create key vault $KEY_VAULT"
az keyvault create -n $KEY_VAULT -g $RESOURCE_GROUP -l $REGION  --enable-purge-protection true --enable-soft-delete true

echo "Create key $KEY_NAME"
az keyvault key create --vault-name $KEY_VAULT --name $KEY_NAME --protection software

keyVaultId=$(az keyvault show --name $KEY_VAULT --query "[id]" -o tsv)
echo "keyVaultId:"
echo $keyVaultId

keyVaultKeyUrl=$(az keyvault key show --vault-name $KEY_VAULT  --name $KEY_NAME  --query "[key.kid]" -o tsv)
echo "keyVaultKeyUrl:"
echo $keyVaultKeyUrl

echo "Create a DiskEncryptionSet $DISK_ENCRYPTION_SET_NAME"
az disk-encryption-set create -n $DISK_ENCRYPTION_SET_NAME  -l $REGION   -g $RESOURCE_GROUP --source-vault $keyVaultId --key-url $keyVaultKeyUrl 

# First, find the disk encryption set's Azure Application ID value.
desIdentity="$(az disk-encryption-set show -n $DISK_ENCRYPTION_SET_NAME -g $RESOURCE_GROUP --query [identity.principalId] -o tsv)"
echo "desIdentity: $desIdentity"
## Vault with Access Policy, we don't want that.
echo "Set vault policy"
az keyvault set-policy -n $KEY_VAULT -g $RESOURCE_GROUP --object-id $desIdentity --key-permissions wrapkey unwrapkey get

diskEncryptionSetId=$(az disk-encryption-set show -n $DISK_ENCRYPTION_SET_NAME -g $RESOURCE_GROUP --query "[id]" -o tsv)
echo "diskEncryptionSetId: $diskEncryptionSetId"
