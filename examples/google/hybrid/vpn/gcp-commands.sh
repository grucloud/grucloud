#!/bin/bash

# Variables
project_name=grucloud-test
network_name=network
region=us-east1
subnet_name=subnet-1
subnet_cidr=10.0.0.0/24
ip_address_name=ip-vpn-1
target_vpn_gateway_name=vpn-1

echo "compute networks create"
gcloud compute networks create "$network_name" --project="$project_name" \
    --subnet-mode=custom \
    --mtu=1460  \
    --bgp-routing-mode=regional \

# https://cloud.google.com/sdk/gcloud/reference/compute/networks/subnets/create
echo "compute networks subnets create"
gcloud compute networks subnets create "$subnet_name" \
    --project="$project_name" \
    --range="$subnet_cidr" \
    --stack-type=IPV4_ONLY \
    --network="$network_name" \
    --region=$region \

# https://cloud.google.com/sdk/gcloud/reference/compute/addresses/create
echo "gcloud compute addresses create"
gcloud compute addresses create "$ip_address_name" --project="$project_name" --region="$region"  

ip_address_1=$(gcloud compute addresses describe "$ip_address_name" --region="$region" --format="value(address)")
echo "ip address is $ip_address_1"

# https://cloud.google.com/sdk/gcloud/reference/compute/target-vpn-gateways/create
echo "gcloud compute target-vpn-gateways create"
gcloud compute target-vpn-gateways create "$target_vpn_gateway_name" --project="$project_name" --region="$region" --network="$network_name" 

# https://cloud.google.com/sdk/gcloud/reference/compute/forwarding-rules/create
echo "gcloud compute forwarding-rules create"
gcloud compute forwarding-rules create vpn-1-rule-esp --project="$project_name" --region="$region" --address="$ip_address_1" --ip-protocol=ESP --target-vpn-gateway="$target_vpn_gateway_name" 
gcloud compute forwarding-rules create vpn-1-rule-udp500 --project="$project_name" --region="$region" --address="$ip_address_1" --ip-protocol=UDP --ports=500 --target-vpn-gateway="$target_vpn_gateway_name" 
gcloud compute forwarding-rules create vpn-1-rule-udp4500 --project="$project_name" --region="$region" --address="$ip_address_1" --ip-protocol=UDP --ports=4500 --target-vpn-gateway="$target_vpn_gateway_name" 

# https://cloud.google.com/sdk/gcloud/reference/compute/vpn-tunnels/create
echo "gcloud compute vpn-tunnels create"
gcloud compute vpn-tunnels create vpn-1-tunnel-1 --project="$project_name" --region="$region" --peer-address=50.1.2.3 --shared-secret=iMSxop3xAneRSUb8sucGwBFUwlrxildo --ike-version=2 --local-traffic-selector=0.0.0.0/0 --remote-traffic-selector=0.0.0.0/0 --target-vpn-gateway="$target_vpn_gateway_name" 

# https://cloud.google.com/sdk/gcloud/reference/compute/routes/create

echo "gcloud compute routes create"
gcloud compute routes create vpn-1-tunnel-1-route-1 --project="$project_name" --network="$network_name" --priority=1000 --destination-range=10.0.0.0/16 --next-hop-vpn-tunnel=vpn-1-tunnel-1 --next-hop-vpn-tunnel-region="$region"