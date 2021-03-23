---
id: Ingress
title: Ingress
---

Provides a k8s Ingress

## Examples

### Create a Ingress for minikube

```js
exports.createIngress = async ({
  provider,
  config: { restServer, ui },
  resources: { namespace, serviceWebServer, serviceRestServer },
}) => {
  return provider.makeIngress({
    name: "ingress",
    dependencies: {
      namespace,
      serviceWebServer,
      serviceRestServer,
    },
    properties: () => ({
      metadata: {
        annotations: {
          "nginx.ingress.kubernetes.io/use-regex": "true",
        },
      },
      spec: {
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/api/.*",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: restServer.serviceName,
                      port: {
                        number: restServer.port,
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            http: {
              paths: [
                {
                  path: "/.*",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: ui.serviceName,
                      port: {
                        number: ui.port,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    }),
  });
```

## Source Code Examples

- [starhackit on minikube](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/minikube/ingress.js#L14)

## Dependencies
