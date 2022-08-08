#!/bin/bash

# Variables
rg=rg-natgateway
location=uksouth
vnet_name=virtual-network
vnet_prefix=10.0.0.0/16
vm_subnet_prefix=10.0.0.0/24
ip_address_name=ip-address
nat_gateway_name=nat-gw

# Resources::ResourceGroup
az group create -n "$rg" -l "$location"
# Network::VirtualNetwork
az network vnet create -g "$rg" -n "$vnet_name" --address-prefix "$vnet_prefix" -l "$location"
# Network::Subnet
az network vnet subnet create -g "$rg" -n vm --vnet-name "$vnet_name" --address-prefix "$vm_subnet_prefix"
# Network::PublicIPAddress
az network public-ip create -g "$rg" -n "$ip_address_name" --allocation-method Static --sku Standard -l "$location" -o none
# Network::NatGateway
az network nat gateway create --resource-group "$rg" --name "$nat_gateway_name" --location "$location" --public-ip-addresses  "$ip_address_name"