#!/bin/bash

# Variables
rg=rg-vm-ad-login
location=uksouth
vnet_name=virtual-network
vnet_prefix=10.0.0.0/16
subnet_name=subnet
subnet_prefix=10.0.0.0/24
ip_address_name=ip-address
nat_gateway_name=nat-gw
nsg_name=security-group
nic_name=network-interface
ssh_key_name=keypair
vm_name=vm
vm_extension_name=AADSSHLoginForLinux

# Resources::ResourceGroup
# https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-creates
echo "group create"
az group create -n "$rg" -l "$location"

# Network::VirtualNetwork
# https://docs.microsoft.com/en-us/cli/azure/network/vnet?view=azure-cli-latest#az-network-vnet-create
az network vnet create -g "$rg" -n "$vnet_name" --address-prefix "$vnet_prefix" -l "$location"

# Network::Subnet
# https://docs.microsoft.com/en-us/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-create
az network vnet subnet create -g "$rg" -n "$subnet_name" --vnet-name "$vnet_name" --address-prefix "$subnet_prefix"

# Network::PublicIPAddress
# https://docs.microsoft.com/en-us/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create
az network public-ip create -g "$rg" -n "$ip_address_name" -l "$location" -o none

# Network::NetworkSecurityGroup
# https://docs.microsoft.com/en-us/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create
az network nsg create -g "$rg" -n "$nsg_name"

# https://docs.microsoft.com/en-us/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create
az network nsg rule create -g "$rg" --nsg-name "$nsg_name" -n SSH --priority 1000 --source-address-prefixes '*' --source-port-ranges '*' --destination-address-prefixes '*' --destination-port-ranges 22  --protocol Tcp --description "allow SSH"

# Network::NetworkInterface
# https://docs.microsoft.com/en-us/cli/azure/network/nic?view=azure-cli-latest#az-network-nic-create
az network nic create -g "$rg" --vnet-name "$vnet_name" --subnet "$subnet_name" -n "$nic_name"  --network-security-group "$nsg_name" --public-ip-address "$ip_address_name"  --ip-forwarding

# Compute::SshPublicKey
# https://docs.microsoft.com/en-us/cli/azure/sshkey?view=azure-cli-latest#az-sshkey-create
az sshkey create -n "$ssh_key_name" -g "$rg" 

# Compute::VirtualMachine
# https://docs.microsoft.com/en-us/cli/azure/vm?view=azure-cli-latest#az-vm-create
echo "vm create"

az vm create -n "$vm_name" -g "$rg" --image UbuntuLTS --size Standard_B1ls --nics "$nic_name" --admin-username ops --assign-identity [system] --ssh-key-name "$ssh_key_name"

# Compute::VirtualMachineExtension
# https://docs.microsoft.com/en-us/cli/azure/vm/extension?view=azure-cli-latest#az-vm-extension-set
echo "vm extension set"

az vm extension set -n "$vm_extension_name" --publisher "Microsoft.Azure.ActiveDirectory" --vm-name "$vm_name"  -g "$rg"    
