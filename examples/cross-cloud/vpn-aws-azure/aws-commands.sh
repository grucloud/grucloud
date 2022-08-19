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
vpngw_name=vpn-gw
vpngw_asn=65001

# Public IP addresses to the customer gateways
vpngw_pip_0=$(az network public-ip show -g $rg -n vpngw-a-pip --query "ipAddress")
vpngw_pip_1=$(az network public-ip show -g $rg -n vpngw-b-pip --query "ipAddress")

#######
# AWS #
#######

# # Variables
sg_name=multicloudsg
kp_name=joseaws
instance_size='t2.nano'
instance_image=ami-'059cd2be9c27a0e81'
vpc_prefix='172.16.0.0/16'
subnet1_prefix='172.16.1.0/24'
subnet2_prefix='172.16.2.0/24'
vgw_asn=65002
ipsec_startup_action='start'

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
echo "create-vpc $vpc_prefix"
vpc_id=$(aws ec2 create-vpc --cidr-block "$vpc_prefix" --query Vpc.VpcId --output text)

zone1_id=$(aws ec2 describe-availability-zones --query 'AvailabilityZones[0].ZoneId' --output text)
zone2_id=$(aws ec2 describe-availability-zones --query 'AvailabilityZones[1].ZoneId' --output text)

echo "create-subnet $subnet1_prefix on vpc $vpc_id in zone $zone1_id"
subnet1_id=$(aws ec2 create-subnet --vpc-id "$vpc_id" --cidr-block "$subnet1_prefix" --availability-zone-id "$zone1_id" --query Subnet.SubnetId --output text)

echo "create-subnet $subnet2_prefix on vpc $vpc_id in zone $zone2_id"
subnet2_id=$(aws ec2 create-subnet --vpc-id "$vpc_id" --cidr-block "$subnet2_prefix" --availability-zone-id "$zone2_id" --query Subnet.SubnetId --output text)

echo "create-internet-gateway"

igw_id=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
if [[ -n "$igw_id" ]]; then
    echo "attach-internet-gateway $igw_id to $vpc_id"
    aws ec2 attach-internet-gateway --vpc-id "$vpc_id" --internet-gateway-id "$igw_id"
fi
echo "Set map-public-ip-on-launch on subnet $subnet1_id"
aws ec2 modify-subnet-attribute --subnet-id "$subnet1_id" --map-public-ip-on-launch
echo "Set map-public-ip-on-launch on subnet $subnet2_id"
aws ec2 modify-subnet-attribute --subnet-id "$subnet2_id" --map-public-ip-on-launch

# If subnet and VPC already existed
vpc_id=$(aws ec2 describe-vpcs --filters "Name=cidr-block,Values=$vpc_prefix" --query 'Vpcs[0].VpcId' --output text)
subnet1_id=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" "Name=cidr-block,Values=$subnet1_prefix" --query 'Subnets[0].SubnetId' --output text)
subnet2_id=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" "Name=cidr-block,Values=$subnet2_prefix" --query 'Subnets[0].SubnetId' --output text)

# Route table
echo "Create Route Table on vpc $vpc_id"
rt_id=$(aws ec2 create-route-table --vpc-id "$vpc_id" --query RouteTable.RouteTableId --output text)

echo "Create Route to internet gateway $igw_id on rt $rt_id"
aws ec2 create-route --route-table-id "$rt_id" --destination-cidr-block 0.0.0.0/0 --gateway-id "$igw_id"

echo "associate-route-table $rt_id to subnet1 $subnet1_id"
aws ec2 associate-route-table --subnet-id "$subnet1_id" --route-table-id "$rt_id"

echo "associate-route-table $rt_id to subnet2 $subnet2_id"
aws ec2 associate-route-table --subnet-id "$subnet2_id" --route-table-id "$rt_id"

# Create SG
echo "create-security-group $sg_name on vpc $vpc_id"
aws ec2 create-security-group --group-name $sg_name --description "Test SG" --vpc-id "$vpc_id"
sg_id=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$sg_name" --query 'SecurityGroups[0].GroupId' --output text)

echo "Authorize SSH on sg $sg_id"
aws ec2 authorize-security-group-ingress --group-id "$sg_id" --protocol tcp --port 22 --cidr 0.0.0.0/0

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

# Create CGWs for Azure (2 required)
# cgw_type=$(aws ec2 get-vpn-connection-device-types --query 'VpnConnectionDeviceTypes[?starts_with(Vendor,`Generic`)]|[0].VpnConnectionDeviceTypeId' --output text)

echo "create-customer-gateway with public ip $vpngw_pip_0"
aws ec2 create-customer-gateway --bgp-asn "$vpngw_asn" --public-ip "$vpngw_pip_0" --device-name vpngw-0 --type 'ipsec.1'


echo "create-customer-gateway with public ip $vpngw_pip_1"
aws ec2 create-customer-gateway --bgp-asn "$vpngw_asn" --public-ip "$vpngw_pip_1" --device-name vpngw-1 --type 'ipsec.1'

# Create VGW and attach to VPC
echo "create-vpn-gateway "
vgw_id=$(aws ec2 create-vpn-gateway --type 'ipsec.1' --amazon-side-asn $vgw_asn --query 'VpnGateway.VpnGatewayId' --output text)
vpc_id=$(aws ec2 describe-vpcs --filters "Name=cidr-block,Values=$vpc_prefix" --query 'Vpcs[0].VpcId' --output text) && echo "$vpc_id"

echo "attach-vpn-gateway vgw: $vgw_i, vpc $vpc_id"

aws ec2 attach-vpn-gateway --vpn-gateway-id "$vgw_id" --vpc-id "$vpc_id"
aws ec2 describe-vpcs --vpc-id "$vpc_id"
rt_id=$(aws ec2 describe-route-tables --query 'RouteTables[*].Associations[?SubnetId==`'$subnet1_id'`].RouteTableId' --output text)

echo "enable-vgw-route-propagation vgw: $vgw_id to rt $rt_id"
aws ec2 enable-vgw-route-propagation --gateway-id "$vgw_id" --route-table-id "$rt_id"

# Create 2 tunnels, one to each CGW
cgw0_id=$(aws ec2 describe-customer-gateways --filters "Name=device-name,Values=vpngw-0" --query 'CustomerGateways[*].CustomerGatewayId' --output text)
echo "cgw0_id: $cgw0_id"

cgw1_id=$(aws ec2 describe-customer-gateways --filters "Name=device-name,Values=vpngw-1" --query 'CustomerGateways[*].CustomerGatewayId' --output text)
echo "cgw1_id: $cgw1_id"

vpncx0_options="{\"TunnelOptions\": [ 
    {\"TunnelInsideCidr\": \"169.254.21.0/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" },
    {\"TunnelInsideCidr\": \"169.254.21.4/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" } 
    ] }"
vpncx1_options="{\"TunnelOptions\": [ 
    {\"TunnelInsideCidr\": \"169.254.22.0/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" },
    {\"TunnelInsideCidr\": \"169.254.22.4/30\", \"PreSharedKey\": \"$ipsec_psk\", \"StartupAction\": \"$ipsec_startup_action\" } 
    ] }"

echo "create-vpn-connection $vgw_id to $cgw0_id"
aws ec2 create-vpn-connection --vpn-gateway-id "$vgw_id" --customer-gateway-id "$cgw0_id" --type 'ipsec.1' --options "$vpncx0_options"

echo "create-vpn-connection $vgw_id to $cgw1_id"
aws ec2 create-vpn-connection --vpn-gateway-id "$vgw_id" --customer-gateway-id "$cgw1_id" --type 'ipsec.1' --options "$vpncx1_options"

# Get public and private IPs for each connection (each connection has 2 tunnels)
vpncx0_id=$(aws ec2 describe-vpn-connections --filters "Name=customer-gateway-id,Values=$cgw0_id" --query 'VpnConnections[0].VpnConnectionId' --output text)
vpncx1_id=$(aws ec2 describe-vpn-connections --filters "Name=customer-gateway-id,Values=$cgw1_id" --query 'VpnConnections[0].VpnConnectionId' --output text)


aws0toaz0_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].OutsideIpAddress' --output text)
while [[ "$aws0toaz0" == "None" ]]; do
    sleep 30
    aws0toaz0_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].OutsideIpAddress' --output text)
done
aws1toaz0_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[1].OutsideIpAddress' --output text)
aws0toaz1_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx1_id" --query 'VpnConnections[0].Options.TunnelOptions[0].OutsideIpAddress' --output text)
aws1toaz1_pip=$(aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx1_id" --query 'VpnConnections[0].Options.TunnelOptions[1].OutsideIpAddress' --output text)
echo "Public IP addresses allocated to the tunnels: $aws0toaz0_pip, $aws0toaz1_pip, $aws1toaz0_pip, $aws1toaz1_pip"
# aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].TunnelInsideCidr' --output text
# aws ec2 describe-vpn-connections --vpn-connection-id "$vpncx0_id" --query 'VpnConnections[0].Options.TunnelOptions[0].PreSharedKey' --output text
