---
id: SslCertificate
title: SSL Certificate
---

Provides a managed SSL certificate.

```js
const sslCertificate = await provider.makeSslCertificate({
  name: "ssl-certificate",
  properties: () => ({
    managed: {
      domains: ["yourdomainhere.com"],
    },
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/sslCertificates/insert)

## Dependencies

## Used By

- [HttpsTargetProxy](./HttpsTargetProxy.md)
