# Deployment on Scaleway

Go the [scaleway console](https://console.cloud.scaleway.com/home/dashboard)

API documentation: https://developers.scaleway.com/en/products/instance/api/

Api Specification: https://developers.scaleway.com/static/scaleway.instance.v1.Api-aeaf02103f0e178e4cc646a883a80474.yml

- Create a Scaleway account
- Generate an access and secret key
- [Find your organisation id](https://www.scaleway.com/en/docs/retrieve-my-organization-id-throught-the-api/)

## Environment variable to set

- SCW_ORGANISATION
- SCW_ACCESS_KEY
- SCW_SECRET_KEY

## Mamual Request

- Reserve an IP address

  curl -d '{"tags": ["myip"],"organization": "xxxxxxxxx-xxxxx-xxxx-xxxxxxxxx"}' -X POST https://api.scaleway.com/instance/v1/zones/fr-par-1/ips -H "X-Auth-Token: xxxxxx-xxxxxxxxx-xxxxxxxxxx" -H "Content-Type: application/json"

- Create a server

  curl -X POST https://api.scaleway.com/instance/v1/zones/fr-par-1/servers --data @createServer.json -H "X-Auth-Token:xxxxxxxxxxxxxx" -H "Content-Type:application/json"
