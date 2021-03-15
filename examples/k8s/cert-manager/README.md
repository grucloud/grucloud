# Cert-Manager

Integrate the [jetstack cert-manager](https://github.com/jetstack/cert-manager/) with GruCloud.

The cert-manager manifest is transformed into javascript code using the **k8s-manifest2code** tool:

```
npm run gen-code
```

This commands creates the **resource.js** file containing all the resources.

At this point, one can use the usual **gc** commands such as **apply**, **list** and **destroy**

```
gc apply
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                        │
├────────────────────┬────────────────────────────────────────────────────────────────────┤
│ CustomResourceDef… │ certificaterequests.cert-manager.io, certificates.cert-manager.io, │
│                    │ challenges.acme.cert-manager.io, clusterissuers.cert-manager.io,   │
│                    │ issuers.cert-manager.io, orders.acme.cert-manager.io               │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Namespace          │ cert-manager                                                       │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ ServiceAccount     │ cert-manager-cainjector, cert-manager, cert-manager-webhook        │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ ClusterRole        │ cert-manager-cainjector, cert-manager-controller-issuers,          │
│                    │ cert-manager-controller-clusterissuers,                            │
│                    │ cert-manager-controller-certificates,                              │
│                    │ cert-manager-controller-orders,                                    │
│                    │ cert-manager-controller-challenges,                                │
│                    │ cert-manager-controller-ingress-shim, cert-manager-view,           │
│                    │ cert-manager-edit                                                  │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ ClusterRoleBinding │ cert-manager-cainjector, cert-manager-controller-issuers,          │
│                    │ cert-manager-controller-clusterissuers,                            │
│                    │ cert-manager-controller-certificates,                              │
│                    │ cert-manager-controller-orders,                                    │
│                    │ cert-manager-controller-challenges,                                │
│                    │ cert-manager-controller-ingress-shim                               │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Role               │ cert-manager-webhook:dynamic-serving                               │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ RoleBinding        │ cert-manager-webhook:dynamic-serving                               │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Service            │ cert-manager, cert-manager-webhook                                 │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Deployment         │ cert-manager-cainjector, cert-manager, cert-manager-webhook        │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ MutatingWebhookCo… │ cert-manager-webhook                                               │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ ValidatingWebhook… │ cert-manager-webhook                                               │
└────────────────────┴────────────────────────────────────────────────────────────────────┘
✔ Are you sure to deploy 35 resources, 11 types on 1 provider? … yes
Deploying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Deploying
    ✓ CustomResourceDefinition 6/6
    ✓ Namespace 1/1
    ✓ ServiceAccount 3/3
    ✓ ClusterRole 9/9
    ✓ ClusterRoleBinding 7/7
    ✓ Role 1/1
    ✓ RoleBinding 1/1
    ✓ Service 2/2
    ✓ Deployment 3/3
    ✓ MutatingWebhookConfiguration 1/1
    ✓ ValidatingWebhookConfiguration 1/1
35 resources deployed of 11 types and 1 provider

```
