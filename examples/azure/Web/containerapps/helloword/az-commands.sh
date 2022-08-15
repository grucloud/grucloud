#!/bin/bash

# Variables
rg=rg-app-container
location=uksouth

workspace_name=workspacergappcontainer
containerapp_env="managedEnvironment-rgappcontainer"
containerapp="helloworld"
image="mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" 
# Resources::ResourceGroup
# https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-creates
az group create -n "$rg" -l "$location"

# OperationalInsights::Workspace
# https://docs.microsoft.com/en-us/cli/azure/monitor/log-analytics/workspace?view=azure-cli-latest#az-monitor-log-analytics-workspace-create
#  az monitor log-analytics workspace create -g "$rg" -n "$workspace_name"

# App::ManagedEnvironmen
# https://docs.microsoft.com/en-us/cli/azure/containerapp/env?view=azure-cli-latest#az-containerapp-env-create
az containerapp env create -n "$containerapp_env" -g "$rg"  --location "$location"

# App:ContainerApp
# https://docs.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-create
az containerapp create -n "$containerapp" -g "$rg" \
    --image "$image" --environment "$containerapp_env" \
    --ingress external --target-port 80 \
    --query properties.configuration.ingress.fqdn