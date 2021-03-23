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

- [ingress on minikube](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/minikube/ingress.js#L14)
- [ingress on EKS](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/aws/eksIngress.js#L15)

## Listing

The following command list only the **Ingress** type:

```sh
gc l -t Ingress
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing
✓ k8s
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Ingress from k8s                                                                                        │
├──────────┬─────────────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                                                    │ Our  │
├──────────┼─────────────────────────────────────────────────────────────────────────────────────────┼──────┤
│ ingress  │ metadata:                                                                               │ Yes  │
│          │   name: ingress                                                                         │      │
│          │   namespace: default                                                                    │      │
│          │   selfLink: /apis/networking.k8s.io/v1beta1/namespaces/default/ingresses/ingress        │      │
│          │   uid: 03fe436f-8ae8-4fbe-b592-917f18d296ad                                             │      │
│          │   resourceVersion: 132466                                                               │      │
│          │   generation: 1                                                                         │      │
│          │   creationTimestamp: 2021-03-23T15:36:28Z                                               │      │
│          │   annotations:                                                                          │      │
│          │     CreatedByProvider: k8s                                                              │      │
│          │     ManagedBy: GruCloud                                                                 │      │
│          │     Name: ingress                                                                       │      │
│          │     alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:eu-west-2:840541460064:cert… │      │
│          │     alb.ingress.kubernetes.io/listen-ports: [{"HTTPS":443}, {"HTTP":80}]                │      │
│          │     alb.ingress.kubernetes.io/scheme: internet-facing                                   │      │
│          │     kubernetes.io/ingress.class: alb                                                    │      │
│          │     stage: dev                                                                          │      │
│          │   finalizers:                                                                           │      │
│          │     - "ingress.k8s.aws/resources"                                                       │      │
│          │ spec:                                                                                   │      │
│          │   rules:                                                                                │      │
│          │     - http:                                                                             │      │
│          │         paths:                                                                          │      │
│          │           - path: /api/*                                                                │      │
│          │             pathType: Prefix                                                            │      │
│          │             backend:                                                                    │      │
│          │               serviceName: rest                                                         │      │
│          │               servicePort: 9000                                                         │      │
│          │     - http:                                                                             │      │
│          │         paths:                                                                          │      │
│          │           - path: /*                                                                    │      │
│          │             pathType: Prefix                                                            │      │
│          │             backend:                                                                    │      │
│          │               serviceName: web                                                          │      │
│          │               servicePort: 80                                                           │      │
│          │ status:                                                                                 │      │
│          │   loadBalancer:                                                                         │      │
│          │     ingress:                                                                            │      │
│          │       - hostname: k8s-default-ingress-e514cce9f1-51015254.eu-west-2.elb.amazonaws.com   │      │
│          │                                                                                         │      │
└──────────┴─────────────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                                      │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ Ingress            │ ingress                                                                             │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t Ingress" executed in 4s
```

## Dependencies

- [Namespace](./Namespace)
