## Hosting a secure static website on GCP, domain managed by AWS Route53

The goal of this example is to automate with [GruCloud](https://grucloud.com), the deployment of a static website served with HTTPS on GCP, the Google Cloud Platform.

The domain and DNS settings are handled by _AWS Route53_.

See the manual way at [hosting static website](https://cloud.google.com/storage/docs/hosting-static-website)

[Google Domain](https://domains.google/) does not provide API, and the other google DNS service [Cloud Domain](https://cloud.google.com/domains/docs/overview) does not support transferring a domain.

For this reason, this example uses _AWS Route53_.

## Resources

This deployment is composed of the resources depicted in the following diagram:

![GraphTarget](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/storage/website-https/artifacts/diagram-target.svg)

> The command `gc graph` generates this diagram from the code [iac.js](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/iac.js).

Below are the links to the resource documentation:

- [Object](https://www.grucloud.com/docs/google/resources/storage/GcpObject)
- [Bucket](https://www.grucloud.com/docs/google/resources/storage/GcpBucket)
- [Backend Bucket](https://www.grucloud.com/docs/google/resources/Compute/BackendBucket)
- [Global Forwarding Rule](https://www.grucloud.com/docs/google/resources/Compute/GlobalForwardingRule)
- [Https Target Proxy](https://www.grucloud.com/docs/google/resources/Compute/HttpsTargetProxy)
- [SSL Certificate](https://www.grucloud.com/docs/google/resources/Compute/SslCertificate)
- [Url Map](https://www.grucloud.com/docs/google/resources/Compute/UrlMap)

## Hooks

The file [hook.js](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/hook.js) contains actions to perform after the infrastructure is deployed and after it is destroyed.

The file [route53Utils.js](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/route53Utils.js) contains functions to add and remove a DNS record of type A to map the domain name to the load balancer's IP address by calling the AWS CLI.

- `aws route53 list-hosted-zones-by-name --dns-name ${domainName}`
- `aws route53 list-resource-record-sets --hosted-zone-id ${hostedZoneId}`
- `aws route53 change-resource-record-sets --hosted-zone-id ${hostedZoneId} --change-batch '${changeBatch}'`

## Requirements

### GruCloud CLI

Ensure **gc**, the GruCloud CLI is installed:

![cli](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-cli-install.svg)

### GCP

Follow this flowchart to install and configure the `gcloud` CLI.

![gcp-requirements](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gcp-requirements.svg)

### AWS

Ensure the AWS CLI is installed as it will be invoked in the [hook.js](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/hook.js) to add and remove a DNS record to map the domain name to the load balancer's IP address.

![AWS Requirements](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/aws-requirements.svg)

### Route53 Domain

Let's verify that the AWS account has a domain name registered:

```sh
aws route53domains list-domains --region us-east-1
```

```txt
{
    "Domains": [
        {
            "DomainName": "grucloud.org",
            "AutoRenew": true,
            "TransferLock": false,
            "Expiry": "2021-11-16T13:56:10+01:00"
        }
    ]
}
```

Alternatively, see the [Route53 Domain Listing](https://console.aws.amazon.com/route53/home#DomainListing)

### Route53 Hosted Zone

Create a Hosted Zone, later on, a DNS record of type A will be created in this zone:

```sh
aws route53 create-hosted-zone --name grucloud.org --caller-reference 2021-06-30-2
```

You could also visit the [Route53 Dashboard](https://console.aws.amazon.com/route53/v2/home#Dashboard)

## Getting the source code

![project-setup](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-project-setup.svg)

> This example is located at `examples/google/storage/website-https`

## Config

Edit [config.js](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/config.js) and set the following variables:

- _projectId_: the project Id, must be unique, see restrictions [here](https://cloud.google.com/resource-manager/docs/creating-managing-projects#:~:text=The%20project%20ID%20must%20be,used%20for%20a%20deleted%20project.)
- _bucketName_: the bucket name which is also the domain name, i.e. mywebsite.com or subdomain.mywebsite.com, see the [bucket naming guideline](https://cloud.google.com/storage/docs/naming-buckets)
- _hostedZoneName_: the hosted zone name in Route53, i.e. mywebsite.com
- _websiteDir_: the directory containing the static website.

## Initialise

The _init_ command will create the project, set up the billing, enable the API services, create the service account and its credentials file, and bind the IAM roles to this service account

```
gc init
```

![gc-init-gcp](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/gcp-provider-init.svg)

## Add the service account as the domain owner

The service account operating by _grucloud_ needs to be added as the domain owner.

This service account created previously with the **init** command is in the form of grucloud@**YourProjectId**.iam.gserviceaccount.com

This service account is also stored in the generated credential file as the **client_email** property.
To find out where the credential file is located:

```sh
gc info
```

```txt
  - provider:
      name: google
      type: google
    stage: dev
    projectId: grucloud-test
    projectName: grucloud-test
    applicationCredentialsFile: /Users/yourusername/.config/gcloud/your-project-id.json
    serviceAccountName: grucloud
    hasGCloud: true
    config:
      bucketName: grucloud.org
      websiteDir: ./websites/simple
      managedByTag: -managed-by-gru
      managedByKey: managed-by
      managedByValue: grucloud
      region: europe-west4
      zone: europe-west4-a
```

Follow the manual steps at the [domain name verification documentation](https://cloud.google.com/storage/docs/domain-name-verification).

## GruCloud CLI Workflow

This chart shows the GruCloud CLI main commands:

![gc-work-flow](https://raw.githubusercontent.com/grucloud/grucloud/main/docusaurus/plantuml/grucloud-cli-commands.svg)

### Deploy

Deploy this infrastructure with the _apply_ command

```sh
gc apply
```

```txt
Querying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 7/7
  ✓ Querying
    ✓ Bucket 1/1
    ✓ Object 1/1
    ✓ SslCertificate 1/1
    ✓ BackendBucket 1/1
    ✓ UrlMap 1/1
    ✓ HttpsTargetProxy 1/1
    ✓ GlobalForwardingRule 1/1
┌────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider google                                   │
├────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                   │
├────────────────────┬───────────────────────────────────────────────┤
│ Bucket             │ grucloud.org                                  │
├────────────────────┼───────────────────────────────────────────────┤
│ Object             │ index.html                                    │
├────────────────────┼───────────────────────────────────────────────┤
│ SslCertificate     │ ssl-certificate                               │
├────────────────────┼───────────────────────────────────────────────┤
│ BackendBucket      │ backend-bucket                                │
├────────────────────┼───────────────────────────────────────────────┤
│ UrlMap             │ url-map                                       │
├────────────────────┼───────────────────────────────────────────────┤
│ HttpsTargetProxy   │ https-target-proxy                            │
├────────────────────┼───────────────────────────────────────────────┤
│ GlobalForwardingR… │ global-forwarding-rule                        │
└────────────────────┴───────────────────────────────────────────────┘
Deploying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Deploying
    ✓ Bucket 1/1
    ✓ Object 1/1
    ✓ SslCertificate 1/1
    ✓ BackendBucket 1/1
    ✓ UrlMap 1/1
    ✓ HttpsTargetProxy 1/1
    ✓ GlobalForwardingRule 1/1
  ✓ default::onDeployed
    ✓ add dns record for the load balancer
    ✓ get https://storage.googleapis.com/grucloud.org/index.html
    ✓ get https://storage.googleapis.com/grucloud.org
    ✓ ssl certificate ready
    ✓ get https://grucloud.org
7 resources deployed of 7 types and 1 provider
Running OnDeployedGlobal resources on 1 provider: google
Command "gc a -f" executed in 11m 48s
fredericheem@pc7 website-https %
```

At the end of the deployment of the GCP resources, the _onDeployed_ hook is invoked.

First, a DNS type A record is added to map the domain name to the load balancer's IPv4 address, i.e the _GlobalForwardingRule_ resource.

The SSL certificate is waiting for this record to verify the ownership of the domain. It may take a few minutes for the SSL certificate to be ready.

The last stage is to get the webpage with HTTPS.
It ensures the deployment is completed successfully.

### List the resources.

Verity the state of the resource with the **gc list** command, the _--graph_ generates a graph of the live resources.

```sh
gc list --graph
```

![GraphLive](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/storage/website-https/artifacts/diagram-live.svg)

```
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 7/7
┌─────────────────────────────────────────────────────────────────────┐
│ 1 SslCertificate from google                                        │
├─────────────────┬────────────────────────────────────────────┬──────┤
│ Name            │ Data                                       │ Our  │
├─────────────────┼────────────────────────────────────────────┼──────┤
│ ssl-certificate │ id: 6441474765553268206                    │ Yes  │
│                 │ creationTimestamp: 2021-06-30T03:44:17.99… │      │
│                 │ name: ssl-certificate                      │      │
│                 │ description: Managed By GruCloud           │      │
│                 │ selfLink: https://www.googleapis.com/comp… │      │
│                 │ certificate: -----BEGIN CERTIFICATE-----   │      │
│                 │ MIIFUTCCBDmgAwIBAgIRAPkAAOJC7+5VCgAAAADtD… │      │
│                 │ RjELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdvb2dsZ… │      │
│                 │ TEMxEzARBgNVBAMTCkdUUyBDQSAxRDQwHhcNMjEwN… │      │
│                 │ MTA0ODQyWjAXMRUwEwYDVQQDEwxncnVjbG91ZC5vc… │      │
│                 │ AQUAA4IBDwAwggEKAoIBAQCwg05xlwu+1ypsJgQ5W… │      │
│                 │ I6TrqTwTpTq8lIwpEBvksGz2w99nJ5lLiCBhH7MRW… │      │
│                 │ 4z4l7D+s/u8xCe7XB2D/B6suXPdVpPjl21kHLQUQC… │      │
│                 │ dwrlJS4M3KfRYXhesJxZEeO3+PoXKw3wBkIpSRfvk… │      │
│                 │ jqdpROyJRaJ/gH1/1Ixe9wxQ0xRf9jAZClyfL8M/D… │      │
│                 │ aQiL+jB/x1AJYwuud04PPZuBNE3ouln8UnD5MD65C… │      │
│                 │ BgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBB… │      │
│                 │ ADAdBgNVHQ4EFgQUn0Lwt6ba79AHuJDIGAlW2310Y… │      │
│                 │ DrJXkZQq5dRdhpCD3lOzuJIwagYIKwYBBQUHAQEEX… │      │
│                 │ dHRwOi8vb2NzcC5wa2kuZ29vZy9ndHMxZDQwMQYIK… │      │
│                 │ a2kuZ29vZy9yZXBvL2NlcnRzL2d0czFkNC5kZXIwF… │      │
│                 │ dWQub3JnMCEGA1UdIAQaMBgwCAYGZ4EMAQIBMAwGC… │      │
│                 │ BDUwMzAxoC+gLYYraHR0cDovL2NybHMucGtpLmdvb… │      │
│                 │ V0NrLmNybDCCAQYGCisGAQQB1nkCBAIEgfcEgfQA8… │      │
│                 │ Vo7jTRMZM7/fDC8gC8xO8WTjAAABelyN0mYAAAQDA… │      │
│                 │ 64j1+EfMUP7z2a1r49DvMLeIKdM1AiEA/JSBRq8oP… │      │
│                 │ POCDVgsI/BQAdwDuwJXujXJkD5Ljw7kbxxKjaWoJe… │      │
│                 │ jdKCAAAEAwBIMEYCIQDoxrQxCcEH2vVeg2AtstxI1… │      │
│                 │ AOsmu4oulyYswA7MTs/Dy29W+nXk0D0mGAOzAHkCz… │      │
│                 │ A4IBAQAoD2cok3xHy87yVKdF7NUtjVAS6/jB6/KUd… │      │
│                 │ ZXvfhKYWZuc9WCaEUNZo45y582uuf/Wv1dBXSiH6v… │      │
│                 │ fsiQzTeOA5+5EmnQLkvaSpfs1VgMwwc0w+bd3mhHa… │      │
│                 │ NlSHP9oWk4Y4sk9ngaDu6p+nilPNXpKOXeVWchB5f… │      │
│                 │ fSjfQ5lMpeZMQi68FPuiNkcaJ5CY0ntHcwenhUpew… │      │
│                 │ 7hT0UnMmPf21WKP4EdMmmw+4dHwx               │      │
│                 │ -----END CERTIFICATE-----                  │      │
│                 │ -----BEGIN CERTIFICATE-----                │      │
│                 │ MIIFjDCCA3SgAwIBAgINAgCOsgIzNmWLZM3bmzANB… │      │
│                 │ CQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRyd… │      │
│                 │ MBIGA1UEAxMLR1RTIFJvb3QgUjEwHhcNMjAwODEzM… │      │
│                 │ MDQyWjBGMQswCQYDVQQGEwJVUzEiMCAGA1UEChMZR… │      │
│                 │ Y2VzIExMQzETMBEGA1UEAxMKR1RTIENBIDFENDCCA… │      │
│                 │ ggEPADCCAQoCggEBAKvAqqPCE27l0w9zC8dTPIE89… │      │
│                 │ UebUQpK0yv2r678RJExK0HWDjeq+nLIHN1Em5j6rA… │      │
│                 │ saztIIJ7O0g/82qj/vGDl//3t4tTqxiRhLQnTLXJd… │      │
│                 │ H3Rcsejcqj8p5Sj19vBm6i1FhqLGymhMFroWVUGO3… │      │
│                 │ 2190Q0Lm/SiKmLbRJ5Au4y1euFJm2JM9eB84Fkqa3… │      │
│                 │ zvxtxvusLJzLWYHk55zcRAacDA2SeEtBbQfD1qsCA… │      │
│                 │ DwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDA… │      │
│                 │ AQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUJeIYDrJXk… │      │
│                 │ VR0jBBgwFoAU5K8rJnEaK0gnhS9SZizv8IkTcT4wa… │      │
│                 │ CCsGAQUFBzABhhpodHRwOi8vb2NzcC5wa2kuZ29vZ… │      │
│                 │ AoYkaHR0cDovL3BraS5nb29nL3JlcG8vY2VydHMvZ… │      │
│                 │ MCswKaAnoCWGI2h0dHA6Ly9jcmwucGtpLmdvb2cvZ… │      │
│                 │ A1UdIARGMEQwCAYGZ4EMAQIBMDgGCisGAQQB1nkCB… │      │
│                 │ aHR0cHM6Ly9wa2kuZ29vZy9yZXBvc2l0b3J5LzANB… │      │
│                 │ IVToy24jwXUr0rAPc924vuSVbKQuYw3nLflLfLh5A… │      │
│                 │ FZbhXkBH0PNcw97thaf2BeoDYY9Ck/b+UGluhx06z… │      │
│                 │ K+Xh3I0tqJy2rgOqNDflr5IMQ8ZTWA3yltakzSBKZ… │      │
│                 │ uPCJvscp1/m2pVTtyBjYPRQ+QuCQGAJKjtN7R5DFr… │      │
│                 │ 3cTIfzE7cmALskMKNLuDz+RzCcsYTsVaU7Vp3xL60… │      │
│                 │ YgPmOT4X3+7L51fXJyRH9KfLRP6nT31D5nmsGAOgZ… │      │
│                 │ VS5H0HyIBMEKyGMIPhFWrlt/hFS28N1zaKI0ZBGD3… │      │
│                 │ lVlWPzXe81vdoEnFbr5M272HdgJWo+WhT9BYM0Ji+… │      │
│                 │ 1dFpgJu8fF3LG0gl2ibSYiCi9a6hvU0TppjJyIWXh… │      │
│                 │ JDwRjW/656r0KVB02xHRKvm2ZKI03TglLIpmVCK3k… │      │
│                 │ x/9tpNFlQTl7B39rJlJWkR17QnZqVptFePFORoZmF… │      │
│                 │ -----END CERTIFICATE-----                  │      │
│                 │ -----BEGIN CERTIFICATE-----                │      │
│                 │ MIIFYjCCBEqgAwIBAgIQd70NbNs2+RrqIQ/E8FjTD… │      │
│                 │ MQswCQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU… │      │
│                 │ CxMHUm9vdCBDQTEbMBkGA1UEAxMSR2xvYmFsU2lnb… │      │
│                 │ OTAwMDA0MloXDTI4MDEyODAwMDA0MlowRzELMAkGA… │      │
│                 │ GUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBMTEMxFDASB… │      │
│                 │ MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCA… │      │
│                 │ ladAPKH9gvl9MgaCcfb2jH/76Nu8ai6Xl6OMS/kr9… │      │
│                 │ iV6nqlKr+CMny6SxnGPb15l+8Ape62im9MZaRw1NE… │      │
│                 │ KSUjB6G00j0uYODP0gmHu81I8E3CwnqIiru6z1kZ1… │      │
│                 │ DrXYfiYaRQM9sHmklCitD38m5agI/pboPGiUU+6DO… │      │
│                 │ j5ZPaK49l8KEj8C8QMALXL32h7M1bKwYUH+E4EzNk… │      │
│                 │ cuHKZPfmghCN6J3Cioj6OGaK/GP5Afl4/Xtcd/p2h… │      │
│                 │ CruOC7XFxYpVq9Os6pFLKcwZpDIlTirxZUTQAs6qz… │      │
│                 │ iYH6TKX/1Y7DzkvgtdizjkXPdsDtQCv9Uw+wp9U7D… │      │
│                 │ Eua++tgy/BBjFFFy3l3WFpO9KWgz7zpm7AeKJt8T1… │      │
│                 │ sZWwpbkNFhHax2xIPEDgfg1azVY80ZcFuctL7TlLn… │      │
│                 │ 9f6BQdgAmD06yK56mDcYBZUCAwEAAaOCATgwggE0M… │      │
│                 │ BgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTkrysmc… │      │
│                 │ BgNVHSMEGDAWgBRge2YaRQ2XyolQL30EzTSo//z9S… │      │
│                 │ JQYIKwYBBQUHMAGGGWh0dHA6Ly9vY3NwLnBraS5nb… │      │
│                 │ MAKGHWh0dHA6Ly9wa2kuZ29vZy9nc3IxL2dzcjEuY… │      │
│                 │ oCOGIWh0dHA6Ly9jcmwucGtpLmdvb2cvZ3NyMS9nc… │      │
│                 │ MAgGBmeBDAECATAIBgZngQwBAgIwDQYLKwYBBAHWe… │      │
│                 │ AwMwDQYJKoZIhvcNAQELBQADggEBADSkHrEoo9C0d… │      │
│                 │ NR3t5P+T4Vxfq7vqfM/b5A3Ri1fyJm9bvhdGaJQ3b… │      │
│                 │ WprKASOshIArAoyZl+tJaox118fessmXn1hIVw41o… │      │
│                 │ 9U5pCZEt4Wi4wStz6dTZ/CLANx8LZh1J7QJVj2fhM… │      │
│                 │ +qduBmpvvYuR7hZL6Dupszfnw0Skfths18dG9ZKb5… │      │
│                 │ d0lIKO2d1xozclOzgjXPYovJJIultzkMu34qQb9Sz… │      │
│                 │ -----END CERTIFICATE-----                  │      │
│                 │                                            │      │
│                 │ managed:                                   │      │
│                 │   domains:                                 │      │
│                 │     - "grucloud.org"                       │      │
│                 │   status: ACTIVE                           │      │
│                 │   domainStatus:                            │      │
│                 │     grucloud.org: ACTIVE                   │      │
│                 │ type: MANAGED                              │      │
│                 │ subjectAlternativeNames:                   │      │
│                 │   - "grucloud.org"                         │      │
│                 │ expireTime: 2021-09-28T03:48:42.000-07:00  │      │
│                 │ kind: compute#sslCertificate               │      │
│                 │                                            │      │
└─────────────────┴────────────────────────────────────────────┴──────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 Bucket from google                                                │
├──────────────┬───────────────────────────────────────────────┬──────┤
│ Name         │ Data                                          │ Our  │
├──────────────┼───────────────────────────────────────────────┼──────┤
│ grucloud.org │ kind: storage#bucket                          │ Yes  │
│              │ selfLink: https://www.googleapis.com/storage… │      │
│              │ id: grucloud.org                              │      │
│              │ name: grucloud.org                            │      │
│              │ projectNumber: 91170824493                    │      │
│              │ metageneration: 2                             │      │
│              │ location: EUROPE-WEST4                        │      │
│              │ storageClass: STANDARD                        │      │
│              │ etag: CAI=                                    │      │
│              │ timeCreated: 2021-06-30T10:44:18.829Z         │      │
│              │ updated: 2021-06-30T10:44:19.640Z             │      │
│              │ website:                                      │      │
│              │   mainPageSuffix: index.html                  │      │
│              │   notFoundPage: 404.html                      │      │
│              │ labels:                                       │      │
│              │   managed-by: grucloud                        │      │
│              │   stage: dev                                  │      │
│              │ iamConfiguration:                             │      │
│              │   bucketPolicyOnly:                           │      │
│              │     enabled: true                             │      │
│              │     lockedTime: 2021-09-28T10:44:18.829Z      │      │
│              │   uniformBucketLevelAccess:                   │      │
│              │     enabled: true                             │      │
│              │     lockedTime: 2021-09-28T10:44:18.829Z      │      │
│              │   publicAccessPrevention: unspecified         │      │
│              │ locationType: region                          │      │
│              │ iam:                                          │      │
│              │   kind: storage#policy                        │      │
│              │   resourceId: projects/_/buckets/grucloud.org │      │
│              │   version: 1                                  │      │
│              │   etag: CAI=                                  │      │
│              │   bindings:                                   │      │
│              │     - role: roles/storage.legacyBucketOwner   │      │
│              │       members:                                │      │
│              │         - "projectEditor:grucloud-test"       │      │
│              │         - "projectOwner:grucloud-test"        │      │
│              │     - role: roles/storage.legacyBucketReader  │      │
│              │       members:                                │      │
│              │         - "projectViewer:grucloud-test"       │      │
│              │     - role: roles/storage.legacyObjectOwner   │      │
│              │       members:                                │      │
│              │         - "projectEditor:grucloud-test"       │      │
│              │         - "projectOwner:grucloud-test"        │      │
│              │     - role: roles/storage.legacyObjectReader  │      │
│              │       members:                                │      │
│              │         - "projectViewer:grucloud-test"       │      │
│              │     - role: roles/storage.objectViewer        │      │
│              │       members:                                │      │
│              │         - "allUsers"                          │      │
│              │                                               │      │
└──────────────┴───────────────────────────────────────────────┴──────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 Object from google                                                │
├────────────┬─────────────────────────────────────────────────┬──────┤
│ Name       │ Data                                            │ Our  │
├────────────┼─────────────────────────────────────────────────┼──────┤
│ index.html │ kind: storage#object                            │ NO   │
│            │ id: grucloud.org/index.html/1625049860598468    │      │
│            │ selfLink: https://www.googleapis.com/storage/v… │      │
│            │ mediaLink: https://storage.googleapis.com/down… │      │
│            │ name: index.html                                │      │
│            │ bucket: grucloud.org                            │      │
│            │ generation: 1625049860598468                    │      │
│            │ metageneration: 1                               │      │
│            │ contentType: text/html                          │      │
│            │ storageClass: STANDARD                          │      │
│            │ size: 333                                       │      │
│            │ md5Hash: tVxlJ6kUMyBVNUg4XlUdJA==               │      │
│            │ crc32c: TISzGQ==                                │      │
│            │ etag: CMTVu72Wv/ECEAE=                          │      │
│            │ timeCreated: 2021-06-30T10:44:20.599Z           │      │
│            │ updated: 2021-06-30T10:44:20.599Z               │      │
│            │ timeStorageClassUpdated: 2021-06-30T10:44:20.5… │      │
│            │ metadata:                                       │      │
│            │   managed-by: grucloud                          │      │
│            │   stage: dev                                    │      │
│            │                                                 │      │
└────────────┴─────────────────────────────────────────────────┴──────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 BackendBucket from google                                         │
├────────────────┬─────────────────────────────────────────────┬──────┤
│ Name           │ Data                                        │ Our  │
├────────────────┼─────────────────────────────────────────────┼──────┤
│ backend-bucket │ id: 8720064536531564011                     │ Yes  │
│                │ creationTimestamp: 2021-06-30T03:44:20.676… │      │
│                │ name: backend-bucket                        │      │
│                │ description: Managed By GruCloud            │      │
│                │ selfLink: https://www.googleapis.com/compu… │      │
│                │ bucketName: grucloud.org                    │      │
│                │ enableCdn: false                            │      │
│                │ kind: compute#backendBucket                 │      │
│                │                                             │      │
└────────────────┴─────────────────────────────────────────────┴──────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 UrlMap from google                                                │
├──────────┬───────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                              │ Our  │
├──────────┼───────────────────────────────────────────────────┼──────┤
│ url-map  │ id: 1187115894224057828                           │ Yes  │
│          │ creationTimestamp: 2021-06-30T03:44:27.793-07:00  │      │
│          │ name: url-map                                     │      │
│          │ description: Managed By GruCloud                  │      │
│          │ selfLink: https://www.googleapis.com/compute/v1/… │      │
│          │ defaultService: https://www.googleapis.com/compu… │      │
│          │ fingerprint: AFWyLkZ6QVA=                         │      │
│          │ kind: compute#urlMap                              │      │
│          │                                                   │      │
└──────────┴───────────────────────────────────────────────────┴──────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 HttpsTargetProxy from google                                      │
├────────────────────┬─────────────────────────────────────────┬──────┤
│ Name               │ Data                                    │ Our  │
├────────────────────┼─────────────────────────────────────────┼──────┤
│ https-target-proxy │ id: 6271089959767242210                 │ Yes  │
│                    │ creationTimestamp: 2021-06-30T03:44:29… │      │
│                    │ name: https-target-proxy                │      │
│                    │ description: Managed By GruCloud        │      │
│                    │ selfLink: https://www.googleapis.com/c… │      │
│                    │ urlMap: https://www.googleapis.com/com… │      │
│                    │ c:                        │      │
│                    │   - "https://www.googleapis.com/comput… │      │
│                    │ fingerprint: _7WjZisemFI=               │      │
│                    │ kind: compute#targetHttpsProxy          │      │
│                    │                                         │      │
└────────────────────┴─────────────────────────────────────────┴──────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 GlobalForwardingRule from google                                  │
├────────────────────────┬─────────────────────────────────────┬──────┤
│ Name                   │ Data                                │ Our  │
├────────────────────────┼─────────────────────────────────────┼──────┤
│ global-forwarding-rule │ id: 953550543260874208              │ Yes  │
│                        │ creationTimestamp: 2021-06-30T03:4… │      │
│                        │ name: global-forwarding-rule        │      │
│                        │ description: Managed By GruCloud    │      │
│                        │ IPAddress: 34.149.122.91            │      │
│                        │ IPProtocol: TCP                     │      │
│                        │ portRange: 443-443                  │      │
│                        │ target: https://www.googleapis.com… │      │
│                        │ selfLink: https://www.googleapis.c… │      │
│                        │ loadBalancingScheme: EXTERNAL       │      │
│                        │ networkTier: PREMIUM                │      │
│                        │ labelFingerprint: 42WmSpB8rSM=      │      │
│                        │ fingerprint: 3GGsVKhNuO4=           │      │
│                        │ kind: compute#forwardingRule        │      │
│                        │                                     │      │
└────────────────────────┴─────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌────────────────────────────────────────────────────────────────────┐
│ google                                                             │
├────────────────────┬───────────────────────────────────────────────┤
│ SslCertificate     │ ssl-certificate                               │
├────────────────────┼───────────────────────────────────────────────┤
│ Bucket             │ grucloud.org                                  │
├────────────────────┼───────────────────────────────────────────────┤
│ Object             │ index.html                                    │
├────────────────────┼───────────────────────────────────────────────┤
│ BackendBucket      │ backend-bucket                                │
├────────────────────┼───────────────────────────────────────────────┤
│ UrlMap             │ url-map                                       │
├────────────────────┼───────────────────────────────────────────────┤
│ HttpsTargetProxy   │ https-target-proxy                            │
├────────────────────┼───────────────────────────────────────────────┤
│ GlobalForwardingR… │ global-forwarding-rule                        │
└────────────────────┴───────────────────────────────────────────────┘
7 resources, 7 types, 1 provider
Command "gc list" executed in 4s
```

### Update

Let's deploy a new version of the website, in this very simple example, edit [website/simple/index.html](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/websites/simple/index.html), change something, and save the file.

The _plan_ command helps to find out what is going to be deployed:

```sh
gc plan
```

```txt
Querying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 7/7
  ✓ Querying
    ✓ Bucket 1/1
    ✓ Object 1/1
    ✓ SslCertificate 1/1
    ✓ BackendBucket 1/1
    ✓ UrlMap 1/1
    ✓ HttpsTargetProxy 1/1
    ✓ GlobalForwardingRule 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Object from google                                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│ │ UPDATE: name: index.html, id: grucloud.org/index.html/1625068113228566                          │   │
│ ├─────────────────────────────────────────────────────────────────────────────────────────────────┤   │
│ │ Key: md5                                                                                        │   │
│ ├────────────────────────────────────────────────┬────────────────────────────────────────────────┤   │
│ │ - nnLSNGP9RyK8uy7mni91nA==                     │ + tVxlJ6kUMyBVNUg4XlUdJA==                     │   │
│ └────────────────────────────────────────────────┴────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider google                                                               │
├────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                               │
├────────────────────┬───────────────────────────────────────────────────────────────────────────┤
│ Object             │ index.html                                                                │
└────────────────────┴───────────────────────────────────────────────────────────────────────────┘
1 resource to deploy on 1 provider
Command "gc p" executed in 4s
```

In this case, _gc_ computes the MD5 hash of the file and compares it with the live version.
Next, use the _apply_ command to effectively deploy.

### Destroy

Dispose of the infrastructure in the right order with:

```
gc destroy
```

```txt
┌─────────────────────────────────────────────────────────────────────────────┐
│ Destroy summary for provider google                                         │
├────────────────────┬────────────────────────────────────────────────────────┤
│ SslCertificate     │ ssl-certificate                                        │
├────────────────────┼────────────────────────────────────────────────────────┤
│ Bucket             │ grucloud.org                                           │
├────────────────────┼────────────────────────────────────────────────────────┤
│ BackendBucket      │ backend-bucket                                         │
├────────────────────┼────────────────────────────────────────────────────────┤
│ UrlMap             │ url-map                                                │
├────────────────────┼────────────────────────────────────────────────────────┤
│ HttpsTargetProxy   │ https-target-proxy                                     │
├────────────────────┼────────────────────────────────────────────────────────┤
│ GlobalForwardingR… │ global-forwarding-rule                                 │
└────────────────────┴────────────────────────────────────────────────────────┘
Destroying resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Destroying
    ✓ SslCertificate 1/1
    ✓ Bucket 1/1
    ✓ BackendBucket 1/1
    ✓ UrlMap 1/1
    ✓ HttpsTargetProxy 1/1
    ✓ GlobalForwardingRule 1/1
  ✓ default::onDestroyed
    ✓ remove the load balancer A DNS record
6 resources destroyed, 6 types on 1 provider
Running OnDestroyedGlobal resources on 1 provider: google
Command "gc d -f" executed in 56s
```

## Links

- [GitHub](https://github.com/grucloud/grucloud)
- [Documentation](https://www.grucloud.com/docs/Introduction)
- [Website](https://www.grucloud.com)
- [Twitter](https://twitter.com/grucloud_iac)
