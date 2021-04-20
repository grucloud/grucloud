# GruCloud Module for the K8s Cert Manager

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

```sh

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider cert-manager                                                  │
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
│                    │ cert-manager-edit,                                                 │
│                    │ cert-manager-controller-approve:cert-manager-io,                   │
│                    │ cert-manager-webhook:subjectaccessreviews                          │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ ClusterRoleBinding │ cert-manager-cainjector, cert-manager-controller-issuers,          │
│                    │ cert-manager-controller-clusterissuers,                            │
│                    │ cert-manager-controller-certificates,                              │
│                    │ cert-manager-controller-orders,                                    │
│                    │ cert-manager-controller-challenges,                                │
│                    │ cert-manager-controller-ingress-shim,                              │
│                    │ cert-manager-controller-approve:cert-manager-io,                   │
│                    │ cert-manager-webhook:subjectaccessreviews                          │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Role               │ cert-manager-cainjector:leaderelection,                            │
│                    │ cert-manager:leaderelection, cert-manager-webhook:dynamic-serving  │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ RoleBinding        │ cert-manager-cainjector:leaderelection,                            │
│                    │ cert-manager:leaderelection, cert-manager-webhook:dynamic-serving  │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Service            │ cert-manager, cert-manager-webhook                                 │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Deployment         │ cert-manager-cainjector, cert-manager, cert-manager-webhook        │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ MutatingWebhookCo… │ cert-manager-webhook                                               │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ ValidatingWebhook… │ cert-manager-webhook                                               │
└────────────────────┴────────────────────────────────────────────────────────────────────┘
Deploying resources on 1 provider: cert-manager
✓ cert-manager
  ✓ Initialising
  ✓ Deploying
    ✓ CustomResourceDefinition 6/6
    ✓ Namespace 1/1
    ✓ ServiceAccount 3/3
    ✓ ClusterRole 11/11
    ✓ ClusterRoleBinding 9/9
    ✓ Role 3/3
    ✓ RoleBinding 3/3
    ✓ Service 2/2
    ✓ Deployment 3/3
    ✓ MutatingWebhookConfiguration 1/1
    ✓ ValidatingWebhookConfiguration 1/1
  ✓ default::onDeployed
    ✓ CertificateRequest
43 resources deployed of 11 types and 1 provider
Running OnDeployedGlobal resources on 1 provider: cert-manager
Command "gc a -f" executed in 17s
```
