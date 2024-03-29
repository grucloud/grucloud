---
id: Secret
title: Secret
---

Provides a [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/)

## Examples

### Create a secret

```js
provider.makeSecret({
  properties: () => ({
    apiVersion: "v1",
    metadata: {
      name: "secretName",
      namespace: "monitoring",
    },
    stringData: {
      "alertmanager.yaml":
        '"global":\n  "resolve_timeout": "5m"\n"inhibit_rules":\n- "equal":\n  - "namespace"\n  - "alertname"\n  "source_match":\n    "severity": "critical"\n  "target_match_re":\n    "severity": "warning|info"\n- "equal":\n  - "namespace"\n  - "alertname"\n  "source_match":\n    "severity": "warning"\n  "target_match_re":\n    "severity": "info"\n"receivers":\n- "name": "Default"\n- "name": "Watchdog"\n- "name": "Critical"\n"route":\n  "group_by":\n  - "namespace"\n  "group_interval": "5m"\n  "group_wait": "30s"\n  "receiver": "Default"\n  "repeat_interval": "12h"\n  "routes":\n  - "match":\n      "alertname": "Watchdog"\n    "receiver": "Watchdog"\n  - "match":\n      "severity": "critical"\n    "receiver": "Critical"',
    },
    type: "Opaque",
  }),
});
```

## Listing

The following command lists the **Secret** type:

```sh
gc list --types Secret
```

```sh
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                              │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ Secret             │ cert-manager-cainjector-token-whwgr                         │
│                    │ cert-manager-token-wtlnp                                    │
│                    │ cert-manager-webhook-ca                                     │
│                    │ cert-manager-webhook-token-7c8vx                            │
│                    │ default-token-zzg5b                                         │
│                    │ default-token-v75qd                                         │
│                    │ service-account-aws-token-7h9wn                             │
│                    │ default-token-2k2jd                                         │
│                    │ default-token-k4qbz                                         │
│                    │ attachdetach-controller-token-vv4kg                         │
│                    │ aws-cloud-provider-token-4mw7p                              │
│                    │ aws-load-balancer-controller-token-l8x6k                    │
│                    │ aws-load-balancer-webhook-tls                               │
│                    │ aws-node-token-8slq6                                        │
│                    │ certificate-controller-token-zf6sr                          │
│                    │ clusterrole-aggregation-controller-token-f9spn              │
│                    │ coredns-token-n45dw                                         │
│                    │ cronjob-controller-token-vnwmj                              │
│                    │ daemon-set-controller-token-nws5x                           │
│                    │ default-token-stvvz                                         │
│                    │ deployment-controller-token-4csd7                           │
│                    │ disruption-controller-token-79tm5                           │
│                    │ eks-vpc-resource-controller-token-tpbhq                     │
│                    │ endpoint-controller-token-f69qb                             │
│                    │ endpointslice-controller-token-w76jt                        │
│                    │ expand-controller-token-cj2pj                               │
│                    │ generic-garbage-collector-token-6gjcl                       │
│                    │ horizontal-pod-autoscaler-token-nnxjm                       │
│                    │ job-controller-token-bd2xd                                  │
│                    │ kube-proxy-token-wgkp5                                      │
│                    │ namespace-controller-token-d9k4b                            │
│                    │ node-controller-token-r9ltz                                 │
│                    │ persistent-volume-binder-token-c2wsc                        │
│                    │ pod-garbage-collector-token-psnth                           │
│                    │ pv-protection-controller-token-j8ss9                        │
│                    │ pvc-protection-controller-token-kg76v                       │
│                    │ replicaset-controller-token-kcdlk                           │
│                    │ replication-controller-token-mtb2g                          │
│                    │ resourcequota-controller-token-zp66l                        │
│                    │ service-account-controller-token-qxjps                      │
│                    │ service-controller-token-7tx8x                              │
│                    │ statefulset-controller-token-fcnz4                          │
│                    │ ttl-controller-token-zf4zm                                  │
│                    │ vpc-resource-controller-token-nsjph                         │
└────────────────────┴─────────────────────────────────────────────────────────────┘
44 resources, 1 type, 2 providers
Command "gc l -t Secret" executed in 5s
```
