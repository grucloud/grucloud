#!/bin/bash

# Variables
rg=rg-ag
location=uksouth
vnet_name=virtual-network
vnet_prefix=10.0.0.0/16
ag_subnet_name=subnet_ag
subnet_prefix_ag=10.0.1.0/24
subnet_name=subnet
subnet_prefix=10.0.0.0/24
ip_address_name=ip-address
nsg_name=security-group
ag_name=ag
image="UbuntuLTS"
admin_username="ops"
vmss_name=vm-scale-set

# Resources::ResourceGroup
az group create -n "$rg" -l "$location"

# Network::VirtualNetwork
az network vnet create -g "$rg" -n "$vnet_name" --address-prefix "$vnet_prefix"

# Network::Subnet for ag
az network vnet subnet create -g "$rg" -n "$ag_subnet_name" --vnet-name "$vnet_name" --address-prefix "$subnet_prefix_ag"

# Network::Subnet
az network vnet subnet create -g "$rg" -n "$subnet_name" --vnet-name "$vnet_name" --address-prefix "$subnet_prefix"

# Network::PublicIPAddress
# https://docs.microsoft.com/en-us/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create
az network public-ip create -g "$rg" -n "$ip_address_name" --allocation-method Static --sku Standard

# Network::NetworkSecurityGroup
# https://docs.microsoft.com/en-us/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create
az network nsg create -g "$rg" -n "$nsg_name"

# Network::ApplicationGateway
# https://docs.microsoft.com/en-us/cli/azure/network/application-gateway?view=azure-cli-latest#az-network-application-gateway-create
az network application-gateway create --name "$ag_name" \
                                      --resource-group  "$rg" \
                                      --public-ip-address "$ip_address_name" \
                                      --subnet "$ag_subnet_name" \
                                      --vnet-name "$vnet_name" \
                                      --sku Standard_v2 \
                                      --frontend-port 80 \
                                      --priority 1

# Compute::VirtualMachineScaleSet
# https://docs.microsoft.com/en-us/cli/azure/vmss?view=azure-cli-latest#az-vmss-create
az vmss create -n "$vmss_name" -g "$rg" --image  "$image" --vm-sku Standard_B1ls  \
    --subnet "$subnet_name"  \
    --vnet-name "$vnet_name" \
    --ssh-key-values "@~/.ssh/id_rsa.pub"  \
    --nsg  "$nsg_name" \
    --admin-username  "$admin_username" \
    --computer-name-prefix "vm-scale-" \
    --app-gateway "$ag_name"