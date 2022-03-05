---
id: DomainName
title: DomainName
---

Manages an [Api Gateway V2 Domain Name](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "DomainName",
    group: "ApiGatewayV2",
    name: "grucloud.org",
    dependencies: () => ({
      certificate: "grucloud.org",
    }),
  },
];
```

## Properties

- [CreateDomainNameCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createdomainnamecommandinput.html)

## Dependencies

- [Certificate](../ACM/Certificate.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)

## List

The DomainNames can be filtered with the _ApiGatewayV2::DomainName_ type:

```sh
gc l -t ApiGatewayV2::DomainName
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::DomainName from aws                                                │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: grucloud.org                                                                 │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   ApiMappingSelectionExpression: $request.basepath                                 │
│   DomainName: grucloud.org                                                         │
│   DomainNameConfigurations:                                                        │
│     - ApiGatewayDomainName: d-m8wiox98oj.execute-api.eu-west-2.amazonaws.com       │
│       CertificateArn: arn:aws:acm:eu-west-2:840541460064:certificate/d71ce4f7-df6… │
│       CertificateName: null                                                        │
│       CertificateUploadDate: null                                                  │
│       DomainNameStatus: AVAILABLE                                                  │
│       DomainNameStatusMessage: null                                                │
│       EndpointType: REGIONAL                                                       │
│       HostedZoneId: ZJ5UAJN8Y3Z2Q                                                  │
│       SecurityPolicy: TLS_1_2                                                      │
│       OwnershipVerificationCertificateArn: null                                    │
│   Tags:                                                                            │
│     gc-project-name: @grucloud/example-aws-api-gateway-lambda                      │
│     gc-managed-by: grucloud                                                        │
│     gc-stage: dev                                                                  │
│     gc-created-by-provider: aws                                                    │
│     Name: grucloud.org                                                             │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├──────────────────────────┬────────────────────────────────────────────────────────┤
│ ApiGatewayV2::DomainName │ grucloud.org                                           │
└──────────────────────────┴────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::DomainName" executed in 6s
```
