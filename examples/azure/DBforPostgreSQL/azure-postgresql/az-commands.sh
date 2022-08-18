#!/bin/bash

# Variables
rg=rg-postgres
location=uksouth
pg_name="gc-postgres"

# Resources::ResourceGroup
# https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-creates
az group create -n "$rg" -l "$location"

# DBforPostgreSQL::FlexibleServer
# https://docs.microsoft.com/en-us/cli/azure/postgres/flexible-server?view=azure-cli-latest#az-postgres-flexible-server-create
az postgres flexible-server create --name "$pg_name" --resource-group "$rg" --admin-user GcAdmin --admin-password AZERTYUIOP1234 --sku-name Standard_B1ms --tier Burstable --version 13 --storage-size 32

# DBforPostgreSQL::Configuration
# https://docs.microsoft.com/en-us/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest#az-postgres-flexible-server-parameter-set
az postgres flexible-server parameter set --resource-group "$rg" --server-name "$pg_name"  --name shared_preload_libraries --value "pg_cron,pg_stat_statements" --source user-override

