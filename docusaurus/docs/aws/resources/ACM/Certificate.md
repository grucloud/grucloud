---
id: Certificate
title: Certificate
---

Provides an SSL certificate.

> Certificates for CloudFront must be created in the us-east-1 region only.

## Examples

### Create a certificate with DNS validation

```js

exports.createResources = () => [
 {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
];
```

### Import a certificate

```js

exports.createResources = () => [
 {
    type: "Certificate",
    group: "ACM",
    properties: () => ({
      privateKeyFile: path.resolve(__dirname, "pki/client1.domain.tld.key"),
      certificateFile: path.resolve(__dirname, "pki/client1.domain.tld.crt"),
      certificateChainFile: path.resolve(__dirname, "pki/ca.crt"),
    }),
  },
];
```

## Source Code Examples

- [certificate validated by DNS](https://github.com/grucloud/grucloud/blob/main/examples/aws/ACM/certificate/resources.js)
- [https static website](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/resources.js)
- [client-vpn-endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/client-vpn-endpoint)

## Properties

- [RequestCertificateCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-acm/interfaces/requestcertificatecommandinput.html)
- [ImportCertificateCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-acm/interfaces/importcertificatecommandinput.html)

## UsedBy

- [Route53 Hosted Zone](../Route53/HostedZone.md)
- [CloudFront Distribution](../CloudFront/Distribution.md)
- [ApiGatewayV2 Domain Name](../ApiGatewayV2/DomainName.md)
- [CloudWatch Metric Alarm](../CloudWatch/MetricAlarm.md)
- [Client Vpn Endpoint](../EC2/ClientVpnEndpoint.md)

## List

The list of certificates can be displayed and filtered with the type **Certificate**:

```sh
gc list -t Certificate
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────┐
│ 2 ACM::Certificate from aws                                      │
├──────────────────────────────────────────────────────────────────┤
│ name: dev.cloudfront.aws.test.grucloud.org                       │
│ managedByUs: NO                                                  │
│ live:                                                            │
│   CertificateArn: arn:aws:acm:us-east-1:840541460064:certificat… │
│   DomainName: dev.cloudfront.aws.test.grucloud.org               │
│   SubjectAlternativeNames:                                       │
│     - "dev.cloudfront.aws.test.grucloud.org"                     │
│   DomainValidationOptions:                                       │
│     - DomainName: dev.cloudfront.aws.test.grucloud.org           │
│       ValidationDomain: dev.cloudfront.aws.test.grucloud.org     │
│       ValidationStatus: SUCCESS                                  │
│       ResourceRecord:                                            │
│         Name: _1c003a592ed0c0c949c1031f5deaef5e.dev.cloudfront.… │
│         Type: CNAME                                              │
│         Value: _20c68e8d64be718e90d61c5bbb573b2b.bbfvkzsszw.acm… │
│       ValidationMethod: DNS                                      │
│   Serial: 08:be:e5:a5:32:6e:83:1f:04:62:74:ad:35:40:35:59        │
│   Subject: CN=dev.cloudfront.aws.test.grucloud.org               │
│   Issuer: Amazon                                                 │
│   CreatedAt: 2021-09-21T18:09:06.000Z                            │
│   IssuedAt: 2021-09-21T18:10:02.000Z                             │
│   Status: ISSUED                                                 │
│   NotBefore: 2021-09-21T00:00:00.000Z                            │
│   NotAfter: 2022-10-20T23:59:59.000Z                             │
│   KeyAlgorithm: RSA-2048                                         │
│   SignatureAlgorithm: SHA256WITHRSA                              │
│   InUseBy: []                                                    │
│   Type: AMAZON_ISSUED                                            │
│   KeyUsages:                                                     │
│     - Name: DIGITAL_SIGNATURE                                    │
│     - Name: KEY_ENCIPHERMENT                                     │
│   ExtendedKeyUsages:                                             │
│     - Name: TLS_WEB_SERVER_AUTHENTICATION                        │
│       OID: 1.3.6.1.5.5.7.3.1                                     │
│     - Name: TLS_WEB_CLIENT_AUTHENTICATION                        │
│       OID: 1.3.6.1.5.5.7.3.2                                     │
│   RenewalEligibility: INELIGIBLE                                 │
│   Options:                                                       │
│     CertificateTransparencyLoggingPreference: ENABLED            │
│   Tags:                                                          │
│     - Key: gc-created-by-provider                                │
│       Value: aws                                                 │
│     - Key: gc-managed-by                                         │
│       Value: grucloud                                            │
│     - Key: gc-project-name                                       │
│       Value: @grucloud/example-aws-website-https                 │
│     - Key: gc-stage                                              │
│       Value: dev                                                 │
│     - Key: Name                                                  │
│       Value: dev.cloudfront.aws.test.grucloud.org                │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ name: grucloud.org                                               │
│ managedByUs: NO                                                  │
│ live:                                                            │
│   CertificateArn: arn:aws:acm:us-east-1:840541460064:certificat… │
│   DomainName: grucloud.org                                       │
│   SubjectAlternativeNames:                                       │
│     - "grucloud.org"                                             │
│   DomainValidationOptions:                                       │
│     - DomainName: grucloud.org                                   │
│       ValidationDomain: grucloud.org                             │
│       ValidationStatus: SUCCESS                                  │
│       ResourceRecord:                                            │
│         Name: _691e4a68814938b97e40e8e955bf1a30.grucloud.org.    │
│         Type: CNAME                                              │
│         Value: _19aece4a9123a510cd3c628c73fa754b.wggjkglgrm.acm… │
│       ValidationMethod: DNS                                      │
│   Serial: 04:66:5e:8d:c5:53:94:cc:cd:f7:33:70:73:a4:33:05        │
│   Subject: CN=grucloud.org                                       │
│   Issuer: Amazon                                                 │
│   CreatedAt: 2021-10-27T17:31:03.044Z                            │
│   IssuedAt: 2021-10-27T17:41:51.537Z                             │
│   Status: ISSUED                                                 │
│   NotBefore: 2021-10-27T00:00:00.000Z                            │
│   NotAfter: 2022-11-25T23:59:59.000Z                             │
│   KeyAlgorithm: RSA-2048                                         │
│   SignatureAlgorithm: SHA256WITHRSA                              │
│   InUseBy: []                                                    │
│   Type: AMAZON_ISSUED                                            │
│   KeyUsages:                                                     │
│     - Name: DIGITAL_SIGNATURE                                    │
│     - Name: KEY_ENCIPHERMENT                                     │
│   ExtendedKeyUsages:                                             │
│     - Name: TLS_WEB_SERVER_AUTHENTICATION                        │
│       OID: 1.3.6.1.5.5.7.3.1                                     │
│     - Name: TLS_WEB_CLIENT_AUTHENTICATION                        │
│       OID: 1.3.6.1.5.5.7.3.2                                     │
│   RenewalEligibility: INELIGIBLE                                 │
│   Options:                                                       │
│     CertificateTransparencyLoggingPreference: ENABLED            │
│   Tags: []                                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘


```
