---
id: AcmCertificate
title: Certificate
---

Provides an SSL certificate.

> Certificates for CloudFront must be created in the us-east-1 region only.

## Examples

### Create a certificate with DNS validation

```js
const domainName = "your.domain.name.com";

const certificate = await provider.acm.makeCertificate({
  name: domainName,
  properties: () => ({}),
});

const domain = await provider.route53Domain.useRoute53Domain({
  name: domainName,
});
const hostedZone = await provider.route53.makeHostedZone({
  name: `${domainName}.`,
  dependencies: { domain },
});

const recordValidation = await provider.route53.makeRoute53Record({
  name: `certificate-validation-${domainName}.`,
  dependencies: { hostedZone, certificate },
  properties: ({ dependencies: { certificate } }) => {
    const domainValidationOption =
      certificate?.live?.DomainValidationOptions[0];
    const record = domainValidationOption?.ResourceRecord;
    if (domainValidationOption) {
      assert(
        record,
        `missing record in DomainValidationOptions, certificate ${JSON.stringify(
          certificate.live
        )}`
      );
    }
    return {
      Name: record?.Name,
      ResourceRecords: [
        {
          Value: record?.Value,
        },
      ],
      TTL: 300,
      Type: "CNAME",
    };
  },
});
```

## Source Code Examples

- [module-aws-certificate](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/certificate/iac.js#L26)
- [https static website ](https://github.com/grucloud/grucloud/blob/main/examples/aws/website-https/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property)

## UsedBy

- [HostedZone](../Route53/Route53HostedZone)
- [CloudFrontDistribution](../CloudFront/CloudFrontDistribution)

## List

The list of certificates can be displayed and filtered with the type **Certificate**:

```sh
gc list -t Certificate
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Certificate from aws                                                                                                                                  │
├──────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name                                     │ Data                                                                                                  │ Our  │
├──────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┤
│ dev.example-module-aws-certificate.gruc… │ CertificateArn: arn:aws:acm:eu-west-2:840541460064:certificate/e7aa0b10-1606-4c90-b9cd-accde2259716   │ Yes  │
│                                          │ DomainName: dev.example-module-aws-certificate.grucloud.org                                           │      │
│                                          │ SubjectAlternativeNames:                                                                              │      │
│                                          │   - "dev.example-module-aws-certificate.grucloud.org"                                                 │      │
│                                          │ DomainValidationOptions:                                                                              │      │
│                                          │   - DomainName: dev.example-module-aws-certificate.grucloud.org                                       │      │
│                                          │     ValidationDomain: dev.example-module-aws-certificate.grucloud.org                                 │      │
│                                          │     ValidationStatus: SUCCESS                                                                         │      │
│                                          │     ResourceRecord:                                                                                   │      │
│                                          │       Name: _b43939171abf0b1c5022e767067716ea.dev.example-module-aws-certificate.grucloud.org.        │      │
│                                          │       Type: CNAME                                                                                     │      │
│                                          │       Value: _da38df93563490b16daee8c697da91ec.zjfbrrwmzc.acm-validations.aws.                        │      │
│                                          │     ValidationMethod: DNS                                                                             │      │
│                                          │ Serial: 0e:c9:76:47:08:94:d4:b2:70:db:4a:42:37:b1:13:62                                               │      │
│                                          │ Subject: CN=dev.example-module-aws-certificate.grucloud.org                                           │      │
│                                          │ Issuer: Amazon                                                                                        │      │
│                                          │ CreatedAt: 2021-04-03T01:31:53.000Z                                                                   │      │
│                                          │ IssuedAt: 2021-04-03T01:32:33.000Z                                                                    │      │
│                                          │ Status: ISSUED                                                                                        │      │
│                                          │ NotBefore: 2021-04-03T00:00:00.000Z                                                                   │      │
│                                          │ NotAfter: 2022-05-02T23:59:59.000Z                                                                    │      │
│                                          │ KeyAlgorithm: RSA-2048                                                                                │      │
│                                          │ SignatureAlgorithm: SHA256WITHRSA                                                                     │      │
│                                          │ InUseBy: []                                                                                           │      │
│                                          │ Type: AMAZON_ISSUED                                                                                   │      │
│                                          │ KeyUsages:                                                                                            │      │
│                                          │   - Name: DIGITAL_SIGNATURE                                                                           │      │
│                                          │   - Name: KEY_ENCIPHERMENT                                                                            │      │
│                                          │ ExtendedKeyUsages:                                                                                    │      │
│                                          │   - Name: TLS_WEB_SERVER_AUTHENTICATION                                                               │      │
│                                          │     OID: 1.3.6.1.5.5.7.3.1                                                                            │      │
│                                          │   - Name: TLS_WEB_CLIENT_AUTHENTICATION                                                               │      │
│                                          │     OID: 1.3.6.1.5.5.7.3.2                                                                            │      │
│                                          │ RenewalEligibility: INELIGIBLE                                                                        │      │
│                                          │ Options:                                                                                              │      │
│                                          │   CertificateTransparencyLoggingPreference: ENABLED                                                   │      │
│                                          │ Tags:                                                                                                 │      │
│                                          │   - Key: ManagedBy                                                                                    │      │
│                                          │     Value: GruCloud                                                                                   │      │
│                                          │   - Key: stage                                                                                        │      │
│                                          │     Value: dev                                                                                        │      │
│                                          │   - Key: projectName                                                                                  │      │
│                                          │     Value: @grucloud/example-module-aws-certificate                                                   │      │
│                                          │   - Key: CreatedByProvider                                                                            │      │
│                                          │     Value: aws                                                                                        │      │
│                                          │   - Key: Name                                                                                         │      │
│                                          │     Value: dev.example-module-aws-certificate.grucloud.org                                            │      │
│                                          │                                                                                                       │      │
└──────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                                                                    │
├────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Certificate        │ dev.example-module-aws-certificate.grucloud.org                                                                                   │
└────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
