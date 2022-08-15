#!/bin/bash

# Variables
rg=rg-firewall
location=uksouth
vnet_name=virtual-network
vnet_prefix=10.0.0.0/16
subnet_name=azurefirewallsubnet
subnet_prefix=10.0.0.0/24
ip_address_name=ip-address
policy_name=firewall-policy
firewall_name=firewall

# Resources::ResourceGroup
az group create -n "$rg" -l "$location"

# Network::VirtualNetwork
az network vnet create -g "$rg" -n "$vnet_name" --address-prefix "$vnet_prefix"

# Network::Subnet
az network vnet subnet create -g "$rg" -n "$subnet_name" --vnet-name "$vnet_name" --address-prefix "$subnet_prefix"

# Network::PublicIPAddress
az network public-ip create -g "$rg" -n "$ip_address_name" --allocation-method Static --sku Standard

# Network::FirewallPolicy
# https://docs.microsoft.com/en-us/cli/azure/network/firewall/policy?view=azure-cli-latest#az-network-firewall-policy-create
az network firewall policy create \
    --name "$policy_name" \
    --resource-group  "$rg"

# Network::AzureFirewall
# https://docs.microsoft.com/en-us/cli/azure/network/firewall?view=azure-cli-latest#az-network-firewall-create
az network firewall create -g "$rg" -n "$firewall_name"  --firewall-policy "$policy_name"

# https://docs.microsoft.com/en-us/cli/azure/network/firewall/ip-config?view=azure-cli-latest#az-network-firewall-ip-config-create
az network firewall ip-config create --firewall-name  "$firewall_name" \
                                     --name "ipconfig1" \
                                     --public-ip-address "$ip_address_name" \
                                     --resource-group "$rg" \
                                     --vnet-name "$vnet_name"
