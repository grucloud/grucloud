---
id: GlobalForwardingRule
title: Global Forwarding Rule
---

Provides global forwaring rule need by the HTTPS load balancer

```js
const bucketName = "mybucketname";

const sslCertificate = await provider.makeSslCertificate({
  name: "ssl-certificate",
  properties: () => ({
    managed: {
      domains: [domain],
    },
  }),
});

const myBucket = await provider.makeBucket({
  name: bucketName,
  properties: () => ({}),
});

const backendBucket = await provider.makeBackendBucket({
  name: "backend-bucket",
  properties: () => ({
    bucketName,
  }),
});

const urlMap = await provider.makeUrlMap({
  name: "url-map",
  dependencies: { service: backendBucket },
  properties: () => ({}),
});

const httpsTargetProxy = await provider.makeHttpsTargetProxy({
  name: "https-target-proxy",
  dependencies: { sslCertificate, urlMap },
  properties: () => ({}),
});

const globalForwardingRule = await provider.makeGlobalForwardingRule({
  name: "global-forwarding-rule",
  dependencies: { httpsTargetProxy },
  properties: () => ({}),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/globalForwardingRules/insert)

## Dependencies

- [HttpsTargetProxy](./HttpsTargetProxy.md)

## List

List all Global Forwarding Rules with the **GlobalForwardingRule** type

```sh
gc l -t GlobalForwardingRule
```

```txt
✓ google
  ✓ Initialising
  ✓ Listing 5/5
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 GlobalForwardingRule from google                                             │
├────────────────────────┬────────────────────────────────────────────────┬──────┤
│ Name                   │ Data                                           │ Our  │
├────────────────────────┼────────────────────────────────────────────────┼──────┤
│ global-forwarding-rule │ id: 953550543260874208                         │ Yes  │
│                        │ creationTimestamp: 2021-06-30T03:44:31.211-07… │      │
│                        │ name: global-forwarding-rule                   │      │
│                        │ description: Managed By GruCloud               │      │
│                        │ IPAddress: 34.149.122.91                       │      │
│                        │ IPProtocol: TCP                                │      │
│                        │ portRange: 443-443                             │      │
│                        │ target: https://www.googleapis.com/compute/v1… │      │
│                        │ selfLink: https://www.googleapis.com/compute/… │      │
│                        │ loadBalancingScheme: EXTERNAL                  │      │
│                        │ networkTier: PREMIUM                           │      │
│                        │ labelFingerprint: 42WmSpB8rSM=                 │      │
│                        │ fingerprint: 3GGsVKhNuO4=                      │      │
│                        │ kind: compute#forwardingRule                   │      │
│                        │                                                │      │
└────────────────────────┴────────────────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌───────────────────────────────────────────────────────────────────────────────┐
│ google                                                                        │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ GlobalForwardingR… │ global-forwarding-rule                                   │
└────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 5 types, 1 provider
Command "gc l -t GlobalForwardingRule" executed in 4s
```
