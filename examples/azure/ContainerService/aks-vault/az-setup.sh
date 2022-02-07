#!/bin/sh
REGION=canadacentral
RESOURCE_GROUP=rg-aks-vault
KEY_VAULT=gc-aks-vault
DISK_ENCRYPTION_SET_NAME=des
KEY_NAME=deskey
CLUSTER_NAME=cluster

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
desIdentity="$(az disk-encryption-set show -n $desName -g $buildRG --query [identity.principalId] -o tsv)"

## Vault with Access Policy, we don't want that.
# echo "Set vault policy"
# az keyvault set-policy -n $KEY_VAULT -g $RESOURCE_GROUP --object-id $desIdentity --key-permissions wrapkey unwrapkey get


diskEncryptionSetId=$(az disk-encryption-set show -n $DISK_ENCRYPTION_SET_NAME -g $RESOURCE_GROUP --query "[id]" -o tsv)

echo "Creating AKS Cluster $CLUSTER_NAME, diskEncryptionSetId: $diskEncryptionSetId"
az aks create -n $CLUSTER_NAME -g $RESOURCE_GROUP --node-osdisk-diskencryptionset-id $diskEncryptionSetId --generate-ssh-keys

