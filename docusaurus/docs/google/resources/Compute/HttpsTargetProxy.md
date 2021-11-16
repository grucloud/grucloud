---
id: HttpsTargetProxy
title: Https Target Proxy
---

Provides a [Https Target Proxy](https://console.cloud.google.com/net-services/loadbalancing/advanced/targetProxies/list) required by an HTTPS load balancer.

```js
const bucketName = "mybucketname";

const sslCertificate = provider.compute.makeSslCertificate({
  name: "ssl-certificate",
  properties: () => ({
    managed: {
      domains: [domain],
    },
  }),
});

const myBucket = provider.storage.makeBucket({
  name: bucketName,
  properties: () => ({}),
});

const backendBucket = provider.compute.makeBackendBucket({
  name: "backend-bucket",
  properties: () => ({
    bucketName,
  }),
});

const urlMap = provider.compute.makeUrlMap({
  name: "url-map",
  dependencies: { service: backendBucket },
  properties: () => ({}),
});

const httpsTargetProxy = provider.compute.makeHttpsTargetProxy({
  name: "https-target-proxy",
  dependencies: { sslCertificate, urlMap },
  properties: () => ({}),
});
```

### Examples

- [Https Website](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https)

![website-https/artifacts/diagram-target.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/storage/website-https/artifacts/diagram-target.svg)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/targetHttpsProxies/insert)

## Dependencies

- [SslCertificate](./SslCertificate.md)
- [UrlMap](./UrlMap.md)

## Used by

- [GlobalForwardingRule](./GlobalForwardingRule.md)

## List

List all Https Target Proxies with the **HttpsTargetProxy** type

```sh
gc l -t HttpsTargetProxy
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 4/4
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 HttpsTargetProxy from google                                                 │
├────────────────────┬────────────────────────────────────────────────────┬──────┤
│ Name               │ Data                                               │ Our  │
├────────────────────┼────────────────────────────────────────────────────┼──────┤
│ https-target-proxy │ id: 6271089959767242210                            │ Yes  │
│                    │ creationTimestamp: 2021-06-30T03:44:29.553-07:00   │      │
│                    │ name: https-target-proxy                           │      │
│                    │ description: Managed By GruCloud                   │      │
│                    │ selfLink: https://www.googleapis.com/compute/v1/p… │      │
│                    │ urlMap: https://www.googleapis.com/compute/v1/pro… │      │
│                    │ sslCertificates:                                   │      │
│                    │   - "https://www.googleapis.com/compute/v1/projec… │      │
│                    │ fingerprint: _7WjZisemFI=                          │      │
│                    │ kind: compute#targetHttpsProxy                     │      │
│                    │                                                    │      │
└────────────────────┴────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌───────────────────────────────────────────────────────────────────────────────┐
│ google                                                                        │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ HttpsTargetProxy   │ https-target-proxy                                       │
└────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 4 types, 1 provider
Command "gc l -t HttpsTargetProxy" executed in 4s
```
