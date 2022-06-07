#!/bin/bash

# Global variables
ipsec_psk='Microsoft123'

#########
# Azure #
#########

# Variables
rg=multicloud
location=uksouth
vnet_name=azure
vnet_prefix=192.168.0.0/16
gateway_subnet_prefix=192.168.1.0/24
vm_subnet_prefix=192.168.2.0/24
vm_sku=Standard_B1s
vpngw_name=vpngw
vpngw_asn=65001

# Create RG and VNets
az group create -n "$rg" -l "$location"
az network vnet create -g "$rg" -n "$vnet_name" --address-prefix "$vnet_prefix" -l "$location"
az network vnet subnet create -g "$rg" -n GatewaySubnet --vnet-name "$vnet_name" --address-prefix "$gateway_subnet_prefix"
az network vnet subnet create -g "$rg" -n vm --vnet-name "$vnet_name" --address-prefix "$vm_subnet_prefix"

# Create test VM
az vm create -n testvm -g $rg --image UbuntuLTS --generate-ssh-keys --size $vm_sku -l $location \
   --vnet-name $vnet_name --subnet vm --public-ip-address vmtest-pip --public-ip-sku Standard

# Create PIPs and VNGs
az network public-ip create -g "$rg" -n ergw-pip --allocation-method Dynamic --sku Basic -l "$location" -o none
az network public-ip create -g "$rg" -n vpngw-a-pip --allocation-method Dynamic --sku Basic -l "$location" -o none
az network public-ip create -g "$rg" -n vpngw-b-pip --allocation-method Dynamic --sku Basic -l "$location" -o none
az network vnet-gateway create -g "$rg" --sku VpnGw1 --gateway-type Vpn --vpn-type RouteBased --vnet $vnet_name -n $vpngw_name --public-ip-addresses vpngw-a-pip vpngw-b-pip --asn "$vpngw_asn"
vpngw_pip_0=$(az network vnet-gateway show -n "$vpngw_name" -g $rg --query 'bgpSettings.bgpPeeringAddresses[0].tunnelIpAddresses[0]' -o tsv) && echo "$vpngw_pip_0"
vpngw_private_ip_0=$(az network vnet-gateway show -n "$vpngw_name" -g "$rg" --query 'bgpSettings.bgpPeeringAddresses[0].defaultBgpIpAddresses[0]' -o tsv) && echo "$vpngw_private_ip_0"
vpngw_pip_1=$(az network vnet-gateway show -n "$vpngw_name" -g "$rg" --query 'bgpSettings.bgpPeeringAddresses[1].tunnelIpAddresses[0]' -o tsv) && echo "$vpngw_pip_1"
vpngw_private_ip_1=$(az network vnet-gateway show -n "$vpngw_name" -g "$rg" --query 'bgpSettings.bgpPeeringAddresses[1].defaultBgpIpAddresses[0]' -o tsv) && echo "$vpngw_private_ip_1"
vpngw_asn=$(az network vnet-gateway show -n "$vpngw_name" -g "$rg" --query 'bgpSettings.asn' -o tsv) && echo "$vpngw_asn"

# Logs
logws_name=$(az monitor log-analytics workspace list -g $rg --query "[?location=='${location}'].name" -o tsv)
if [[ -z "$logws_name" ]]
then
    logws_name=log$RANDOM
    echo "INFO: Creating log analytics workspace ${logws_name} in ${location}..."
    az monitor log-analytics workspace create -n $logws_name -g $rg -l $location -o none
else
    echo "INFO: Log Analytics workspace $logws_name in $location found in resource group $rg"
fi
logws_id=$(az resource list -g $rg -n $logws_name --query '[].id' -o tsv)
logws_customerid=$(az monitor log-analytics workspace show -n $logws_name -g $rg --query customerId -o tsv)
vpngw_id=$(az network vnet-gateway show -n $vpngw_name -g $rg --query id -o tsv)
az monitor diagnostic-settings create -n vpndiag --resource "$vpngw_id" --workspace "$logws_id" \
    --metrics '[{"category": "AllMetrics", "enabled": true, "retentionPolicy": {"days": 0, "enabled": false }, "timeGrain": null}]' \
    --logs '[{"category": "GatewayDiagnosticLog", "enabled": true, "retentionPolicy": {"days": 0, "enabled": false}}, 
            {"category": "TunnelDiagnosticLog", "enabled": true, "retentionPolicy": {"days": 0, "enabled": false}},
            {"category": "RouteDiagnosticLog", "enabled": true, "retentionPolicy": {"days": 0, "enabled": false}},
            {"category": "IKEDiagnosticLog", "enabled": true, "retentionPolicy": {"days": 0, "enabled": false}}]' -o none


#######
# AWS #
#######

# # Variables
# sg_name=multicloudsg
# kp_name=joseaws
# instance_size='t2.nano'
# instance_image=ami-'059cd2be9c27a0e81'
# # instance_image=ami-a4827dc9
# vpc_prefix='172.16.0.0/16'
# subnet1_prefix='172.16.1.0/24'
# subnet2_prefix='172.16.2.0/24'
# vgw_asn=65002
# ipsec_startup_action='start'

# # Create Key Pair if not there
# kp_id=$(aws ec2 describe-key-pairs --key-name "$kp_name" --query 'KeyPairs[0].KeyPairId' --output text)
# if [[ -z "$kp_id" ]]; then
#     echo "Key pair $kp_name does not exist, creating new..."
#     pemfile="$HOME/.ssh/${kp_name}.pem"
#     touch "$pemfile"
#     aws ec2 create-key-pair --key-name $kp_name --key-type rsa --query 'KeyMaterial' --output text > "$pemfile"
#     chmod 400 "$pemfile"
# else
#     echo "Key pair $kp_name already exists with ID $kp_id"
# fi

# # VPC and subnet
# # https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnets-commands-example.html
# vpc_id=$(aws ec2 create-vpc --cidr-block "$vpc_prefix" --query Vpc.VpcId --output text)
# zone1_id=$(aws ec2 describe-availability-zones --query 'AvailabilityZones[0].ZoneId' --output text)
# zone2_id=$(aws ec2 describe-availability-zones --query 'AvailabilityZones[1].ZoneId' --output text)
# subnet1_id=$(aws ec2 create-subnet --vpc-id "$vpc_id" --cidr-block "$subnet1_prefix" --availability-zone-id "$zone1_id" --query Subnet.SubnetId --output text)
# subnet2_id=$(aws ec2 create-subnet --vpc-id "$vpc_id" --cidr-block "$subnet2_prefix" --availability-zone-id "$zone2_id" --query Subnet.SubnetId --output text)
# igw_id=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
# if [[ -n "$igw_id" ]]; then
#     aws ec2 attach-internet-gateway --vpc-id "$vpc_id" --internet-gateway-id "$igw_id"
# fi
# aws ec2 modify-subnet-attribute --subnet-id "$subnet1_id" --map-public-ip-on-launch
# aws ec2 modify-subnet-attribute --subnet-id "$subnet2_id" --map-public-ip-on-launch

# # If subnet and VPC already existed
# vpc_id=$(aws ec2 describe-vpcs --filters "Name=cidr-block,Values=$vpc_prefix" --query 'Vpcs[0].VpcId' --output text)
# subnet1_id=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" "Name=cidr-block,Values=$subnet1_prefix" --query 'Subnets[0].SubnetId' --output text)
# subnet2_id=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" "Name=cidr-block,Values=$subnet2_prefix" --query 'Subnets[0].SubnetId' --output text)

# # Route table
# rt_id=$(aws ec2 create-route-table --vpc-id "$vpc_id" --query RouteTable.RouteTableId --output text)
# aws ec2 create-route --route-table-id "$rt_id" --destination-cidr-block 0.0.0.0/0 --gateway-id "$igw_id"
# aws ec2 associate-route-table --subnet-id "$subnet1_id" --route-table-id "$rt_id"
# aws ec2 associate-route-table --subnet-id "$subnet2_id" --route-table-id "$rt_id"

# # Create SG
# aws ec2 create-security-group --group-name $sg_name --description "Test SG" --vpc-id "$vpc_id"
# sg_id=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$sg_name" --query 'SecurityGroups[0].GroupId' --output text)
# aws ec2 authorize-security-group-ingress --group-id "$sg_id" --protocol tcp --port 22 --cidr 0.0.0.0/0

# # Create instances
# aws ec2 run-instances --image-id "$instance_image" --key-name "$kp_name" --security-group-ids "$sg_id" --instance-type "$instance_size" --subnet-id "$subnet1_id"
# aws ec2 run-instances --image-id "$instance_image" --key-name "$kp_name" --security-group-ids "$sg_id" --instance-type "$instance_size" --subnet-id "$subnet2_id"
# # aws ec2 run-instances  --image-id ami-5ec1673e --key-name MyKey --security-groups EC2SecurityGroup --instance-type t2.micro --placement AvailabilityZone=us-west-2b --block-device-mappings DeviceName=/dev/sdh,Ebs={VolumeSize=100} --count 2
# instance1_id=$(aws ec2 describe-instances --filters "Name=subnet-id,Values=$subnet1_id" --query 'Reservations[0].Instances[0].InstanceId' --output text)
# instance2_id=$(aws ec2 describe-instances --filters "Name=subnet-id,Values=$subnet2_id" --query 'Reservations[0].Instances[0].InstanceId' --output text)

# # Check SSH access
# instance1_pip=$(aws ec2 describe-instances --instance-id "$instance1_id" --query 'Reservations[*].Instances[*].PublicIpAddress' --output text) && echo "$instance1_pip"
# instance2_pip=$(aws ec2 describe-instances --instance-id "$instance2_id" --query 'Reservations[*].Instances[*].PublicIpAddress' --output text) && echo "$instance2_pip"
# pemfile="$HOME/.ssh/${kp_name}.pem"
# user=ec2-user
# ssh -n -o BatchMode=yes -o StrictHostKeyChecking=no -i "$pemfile" "${user}@${instance1_pip}" "ip a"
# ssh -n -o BatchMode=yes -o StrictHostKeyChecking=no -i "$pemfile" "${user}@${instance2_pip}" "ip a"

# # Create CGWs for Azure (2 required)
# # cgw_type=$(aws ec2 get-vpn-connection-device-types --query 'VpnConnectionDeviceTypes[?starts_with(Vendor,`Generic`)]|[0].VpnConnectionDeviceTypeId' --output text)
# aws ec2 create-customer-gateway --bgp-asn "$vpngw_asn" --public-ip "$vpngw_pip_0" --device-name vpngw-0 --type 'ipsec.1'
# aws ec2 create-customer-gateway --bgp-asn "$vpngw_asn" --public-ip "$vpngw_pip_1" --device-name vpngw-1 --type 'ipsec.1'

# # Create VGW and attach to VPC
# vgw_id=$(aws ec2 create-vpn-gateway --type 'ipsec.1' --amazon-side-asn $vgw_asn --query 'VpnGateway.VpnGatewayId' --output text)
# vpc_id=$(aws ec2 describe-vpcs --filters "Name=cidr-block,Values=$vpc_prefix" --query 'Vpcs[0].VpcId' --output text) && echo "$vpc_id"
# aws ec2 attach-vpn-gateway --vpn-gateway-id "$vgw_id" --vpc-id "$vpc_id"
# aws ec2 describe-vpcs --vpc-id "$vpc_id"
# rt_id=$(aws ec2 describe-route-tables --query 'RouteTables[*].Associations[?SubnetId==`'$subnet1_id'`].RouteTableId' --output text)
# aws ec2 enable-vgw-route-propagation --gateway-id "$vgw_id" --route-table-id "$rt_id"

# # Create 2 tunnels, one to each CGW
# cgw0_id=$(aws ec2 describe-customer-gateways --filters "Name=device-name,Values=vpngw-0" --query 'CustomerGateways[*].CustomerGatewayId' --output text)
# cgw1_id=$(aws ec2 describe-customer-gateways --filters "Name=device-name,Values=vpngw-1" --query 'CustomerGateways[*].CustomerGatewayId' --output text)
# vpncx0_options="{\"TunnelOptions\": [ 
#     {\"TunnelInsideCidr\": \"169.254.21.0/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" },
#     {\"TunnelInsideCidr\": \"169.254.21.4/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" } 
#     ] }"
# vpncx1_options="{\"TunnelOptions\": [ 
#     {\"TunnelInsideCidr\": \"169.254.22.0/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" },
#     {\"TunnelInsideCidr\": \"169.254.22.4/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" } 
#     ] }"
# aws ec2 create-vpn-connection --vpn-gateway-id "$vgw_id" --customer-gateway-id "$cgw0_id" --type 'ipsec.1' --options "$vpncx0_options"
# aws ec2 create-vpn-connection --vpn-gateway-id "$vgw_id" --customer-gateway-id "$cgw1_id" --type 'ipsec.1' --options "$vpncx1_options"

# # Get public and private IPs for each connection (each connection has 2 tunnels)
# vpncx0_id=$(aws ec2 describe-vpn-connections --filters "Name=customer-gateway-id,Values=$cgw0_id" --query 'VpnConnections[0].VpnConnectionId' --output text)
# vpncx1_id=$(aws ec2 describe-vpn-connections --filters "Name=customer-gateway-id,Values=$cgw1_id" --query 'VpnConnections[0].VpnConnectionId' --output text)
# aws0toaz0_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].OutsideIpAddress' --output text)
# while [[ "$aws0toaz0" == "None" ]]; do
#     sleep 30
#     aws0toaz0_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].OutsideIpAddress' --output text)
# done
# aws1toaz0_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[1].OutsideIpAddress' --output text)
# aws0toaz1_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx1_id" --query 'VpnConnections[0].Options.TunnelOptions[0].OutsideIpAddress' --output text)
# aws1toaz1_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx1_id" --query 'VpnConnections[0].Options.TunnelOptions[1].OutsideIpAddress' --output text)
# echo "Public IP addresses allocated to the tunnels: $aws0toaz0_pip, $aws0toaz1_pip, $aws1toaz0_pip, $aws1toaz1_pip"
# # aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].TunnelInsideCidr' --output text
# # aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].PreSharedKey' --output text

#########
# Azure #
#########

# # For stuff we need to do over REST
# azvpn_api_version="2022-01-01"

# # Create LNGs, update VNG with custom BGP IP addresses (aka APIPAs) and create connections
# az network vnet-gateway update -n "$vpngw_name" -g $rg \
#     --set 'bgpSettings.bgpPeeringAddresses[0].customBgpIpAddresses=["169.254.21.2", "169.254.21.6"]' \
#     --set 'bgpSettings.bgpPeeringAddresses[1].customBgpIpAddresses=["169.254.22.2", "169.254.22.6"]'

# # Create LNGs
# az network local-gateway create -g $rg -n aws00 --gateway-ip-address "$aws0toaz0_pip" --asn "$vgw_asn" --bgp-peering-address '169.254.21.1' --peer-weight 0 -l $location
# az network local-gateway create -g $rg -n aws01 --gateway-ip-address "$aws0toaz1_pip" --asn "$vgw_asn" --bgp-peering-address '169.254.22.1' --peer-weight 0 -l $location
# az network local-gateway create -g $rg -n aws10 --gateway-ip-address "$aws1toaz0_pip" --asn "$vgw_asn" --bgp-peering-address '169.254.21.5' --peer-weight 0 -l $location
# az network local-gateway create -g $rg -n aws11 --gateway-ip-address "$aws1toaz1_pip" --asn "$vgw_asn" --bgp-peering-address '169.254.22.5' --peer-weight 0 -l $location

# # Get VNG ipconfig IDs
# vpngw_config0_id=$(az network vnet-gateway show -n $vpngw_name -g $rg --query 'ipConfigurations[0].id' -o tsv)
# vpngw_config1_id=$(az network vnet-gateway show -n $vpngw_name -g $rg --query 'ipConfigurations[1].id' -o tsv)

# # Create connection: AWS00 (VPNGW0 - AWS0)
# az network vpn-connection create -g $rg --shared-key "$ipsec_psk" --enable-bgp -n aws00 --vnet-gateway1 $vpngw_name --local-gateway2 'aws00' -o none
# # az network vpn-connection update -g $rg -n aws00 --set 'connectionMode=ResponderOnly' -o none
# # az network vpn-connection update -g $rg -n aws00 --set 'connectionMode=Default' -o none
# aws00cx_id=$(az network vpn-connection show -n aws00 -g $rg --query id -o tsv)
# aws00cx_json=$(az rest --method GET --uri "${aws00cx_id}?api-version=${azvpn_api_version}")
# custom_ip_json='[{"customBgpIpAddress": "169.254.21.2", "ipConfigurationId": "'$vpngw_config0_id'"},{"customBgpIpAddress": "169.254.22.2", "ipConfigurationId": "'$vpngw_config1_id'"}]'
# aws00cx_json_updated=$(echo "$aws00cx_json" | jq ".properties.gatewayCustomBgpIpAddresses=$custom_ip_json")
# az rest --method PUT --uri "${aws00cx_id}?api-version=${azvpn_api_version}" --body "$aws00cx_json_updated" -o none

# # Create connection: AWS01 (VPNGW1 - AWS0)
# az network vpn-connection create -g $rg --shared-key "$ipsec_psk" --enable-bgp -n aws01 --vnet-gateway1 $vpngw_name --local-gateway2 'aws01' -o none
# # az network vpn-connection update -g $rg -n aws01 --set 'connectionMode=ResponderOnly' -o none
# # az network vpn-connection update -g $rg -n aws01 --set 'connectionMode=Default' -o none
# aws01cx_id=$(az network vpn-connection show -n aws01 -g $rg --query id -o tsv)
# aws01cx_json=$(az rest --method GET --uri "${aws01cx_id}?api-version=${azvpn_api_version}")
# custom_ip_json='[{"customBgpIpAddress": "169.254.21.2", "ipConfigurationId": "'$vpngw_config0_id'"},{"customBgpIpAddress": "169.254.22.2", "ipConfigurationId": "'$vpngw_config1_id'"}]'
# aws01cx_json_updated=$(echo "$aws01cx_json" | jq ".properties.gatewayCustomBgpIpAddresses=$custom_ip_json")
# az rest --method PUT --uri "${aws01cx_id}?api-version=${azvpn_api_version}" --body "$aws01cx_json_updated" -o none

# # Create connection: AWS10 (VPNGW0 - AWS1)
# az network vpn-connection create -g $rg --shared-key "$ipsec_psk" --enable-bgp -n aws10 --vnet-gateway1 $vpngw_name --local-gateway2 'aws10' -o none
# # az network vpn-connection update -g $rg -n aws10 --set 'connectionMode=ResponderOnly' -o none
# # az network vpn-connection update -g $rg -n aws10 --set 'connectionMode=Default' -o none
# aws10cx_id=$(az network vpn-connection show -n aws10 -g $rg --query id -o tsv)
# aws10cx_json=$(az rest --method GET --uri "${aws10cx_id}?api-version=${azvpn_api_version}")
# custom_ip_json='[{"customBgpIpAddress": "169.254.21.6", "ipConfigurationId": "'$vpngw_config0_id'"},{"customBgpIpAddress": "169.254.22.6", "ipConfigurationId": "'$vpngw_config1_id'"}]'
# aws10cx_json_updated=$(echo "$aws10cx_json" | jq ".properties.gatewayCustomBgpIpAddresses=$custom_ip_json")
# az rest --method PUT --uri "${aws10cx_id}?api-version=${azvpn_api_version}" --body "$aws10cx_json_updated" -o none

# # Create connection: AWS11 (VPNGW1 - AWS1)
# az network vpn-connection create -g $rg --shared-key "$ipsec_psk" --enable-bgp -n aws11 --vnet-gateway1 $vpngw_name --local-gateway2 'aws11' -o none
# # az network vpn-connection update -g $rg -n aws11 --set 'connectionMode=ResponderOnly' -o none
# # az network vpn-connection update -g $rg -n aws11 --set 'connectionMode=Default' -o none
# aws11cx_id=$(az network vpn-connection show -n aws11 -g $rg --query id -o tsv)
# aws11cx_json=$(az rest --method GET --uri "${aws11cx_id}?api-version=${azvpn_api_version}")
# custom_ip_json='[{"customBgpIpAddress": "169.254.21.6", "ipConfigurationId": "'$vpngw_config0_id'"},{"customBgpIpAddress": "169.254.22.6", "ipConfigurationId": "'$vpngw_config1_id'"}]'
# aws11cx_json_updated=$(echo "$aws11cx_json" | jq ".properties.gatewayCustomBgpIpAddresses=$custom_ip_json")
# az rest --method PUT --uri "${aws11cx_id}?api-version=${azvpn_api_version}" --body "$aws11cx_json_updated" -o none
