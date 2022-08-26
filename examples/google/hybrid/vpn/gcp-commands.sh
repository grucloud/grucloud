#!/bin/bash

# Variables
project_name=grucloud-test
network_name=network
region=us-east1
subnet_name=subnet-1
subnet_cidr=10.0.0.0/24

echo "compute networks create"
gcloud compute networks create "$network_name" --project="$project_name" \
    --subnet-mode=custom \
    --mtu=1460  \
    --bgp-routing-mode=regional \

echo "compute networks subnets create"

gcloud compute networks subnets create "$subnet_name" \
    --project="$project_name" \
    --range="$subnet_cidr" \
    --stack-type=IPV4_ONLY \
    --network="$network_name" \
    --region=$region \


gcloud compute addresses create ip-vpn-1 --project="$project_name" --region="$region" 

# TODO grab  ip address

gcloud compute target-vpn-gateways create vpn-1 --project="$project_name" --region="$region" --network="$network_name" 
gcloud compute forwarding-rules create vpn-1-rule-esp --project="$project_name" --region="$region" --address=34.148.99.6 --ip-protocol=ESP --target-vpn-gateway=vpn-1 
gcloud compute forwarding-rules create vpn-1-rule-udp500 --project="$project_name" --region="$region" --address=34.148.99.6 --ip-protocol=UDP --ports=500 --target-vpn-gateway=vpn-1 
gcloud compute forwarding-rules create vpn-1-rule-udp4500 --project="$project_name" --region="$region" --address=34.148.99.6 --ip-protocol=UDP --ports=4500 --target-vpn-gateway=vpn-1 
gcloud compute vpn-tunnels create vpn-1-tunnel-1 --project="$project_name" --region="$region" --peer-address=50.1.2.3 --shared-secret=iMSxop3xAneRSUb8sucGwBFUwlrxildo --ike-version=2 --local-traffic-selector=0.0.0.0/0 --remote-traffic-selector=0.0.0.0/0 --target-vpn-gateway=vpn-1 
gcloud compute routes create vpn-1-tunnel-1-route-1 --project="$project_name" --network="$network_name" --priority=1000 --destination-range=10.0.0.0/16 --next-hop-vpn-tunnel=vpn-1-tunnel-1 --next-hop-vpn-tunnel-region=us-east1