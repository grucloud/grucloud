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

- [basic example](https://github.com/grucloud/grucloud/blob/master/examples/google/storage/website-https/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/globalForwardingRules/insert)

## Dependencies

- [HttpsTargetProxy](./HttpsTargetProxy.md)
