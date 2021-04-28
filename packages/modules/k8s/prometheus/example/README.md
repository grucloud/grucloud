# GruCloud example Prometheus

This example shows how to consume [@grucloud/module-k8s-prometheus](https://www.npmjs.com/package/@grucloud/example-module-k8s-prometheus), a GruCloud Kubernetes module to manage the [Prometheus](https://prometheus.io/) monitoring system.

## Requirements

You are supposed to get access to a k8s cluster, for this demo, we'll use [minikube](https://minikube.sigs.k8s.io/docs/start/)

If this command is successful, you are ready to proceed:

```sh
minikube start
```

## Installation

Ensure [Node.js](https://nodejs.org/en/) is present on your machine:

```sh
node --version
```

Install the npm dependencies for this project:

```sh
npm install
```

For convenience, install the GruCloud CLI:

```sh
npm install -g @grucloud/core
```

## Workflow

We'll show the major commands to manage the Prometheus deployment:

- gc apply
- gc list
- gc destroy

### Deploy

The k8s resources will be installed with the _apply_ command.

```sh
gc apply
```

```txt
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                              │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                           │
├────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ Namespace          │ pgo, monitoring                                                       │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Alertmanager       │ monitoring::monitoring-main                                           │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ PodDisruptionBudg… │ monitoring::monitoring-alertmanager-main,                             │
│                    │ monitoring::monitoring-prometheus-k8s                                 │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ PrometheusRule     │ monitoring::monitoring-alertmanager-main-rules,                       │
│                    │ monitoring::monitoring-kube-prometheus-rules,                         │
│                    │ monitoring::monitoring-kube-state-metrics-rules,                      │
│                    │ monitoring::monitoring-kubernetes-monitoring-rules,                   │
│                    │ monitoring::monitoring-node-exporter-rules,                           │
│                    │ monitoring::monitoring-prometheus-operator-rules,                     │
│                    │ monitoring::monitoring-prometheus-k8s-prometheus-rules                │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Secret             │ monitoring::monitoring-alertmanager-main,                             │
│                    │ monitoring::monitoring-grafana-datasources                            │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Service            │ monitoring::monitoring-alertmanager-main,                             │
│                    │ monitoring::monitoring-blackbox-exporter,                             │
│                    │ monitoring::monitoring-grafana,                                       │
│                    │ monitoring::monitoring-kube-state-metrics,                            │
│                    │ monitoring::monitoring-node-exporter,                                 │
│                    │ monitoring::monitoring-prometheus-adapter,                            │
│                    │ monitoring::monitoring-prometheus-k8s,                                │
│                    │ monitoring::monitoring-prometheus-operator                            │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ ServiceAccount     │ monitoring::monitoring-alertmanager-main,                             │
│                    │ monitoring::monitoring-blackbox-exporter,                             │
│                    │ monitoring::monitoring-grafana,                                       │
│                    │ monitoring::monitoring-kube-state-metrics,                            │
│                    │ monitoring::monitoring-node-exporter,                                 │
│                    │ monitoring::monitoring-prometheus-adapter,                            │
│                    │ monitoring::monitoring-prometheus-k8s,                                │
│                    │ monitoring::monitoring-prometheus-operator                            │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ ServiceMonitor     │ monitoring::monitoring-alertmanager,                                  │
│                    │ monitoring::monitoring-blackbox-exporter,                             │
│                    │ monitoring::monitoring-grafana,                                       │
│                    │ monitoring::monitoring-kube-state-metrics,                            │
│                    │ monitoring::monitoring-kube-apiserver,                                │
│                    │ monitoring::monitoring-coredns,                                       │
│                    │ monitoring::monitoring-kube-controller-manager,                       │
│                    │ monitoring::monitoring-kube-scheduler,                                │
│                    │ monitoring::monitoring-kubelet, monitoring::monitoring-node-exporter, │
│                    │ monitoring::monitoring-prometheus-adapter,                            │
│                    │ monitoring::monitoring-prometheus-operator,                           │
│                    │ monitoring::monitoring-prometheus-k8s                                 │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ ClusterRole        │ blackbox-exporter, kube-state-metrics, node-exporter,                 │
│                    │ prometheus-adapter, system:aggregated-metrics-reader,                 │
│                    │ resource-metrics-server-resources, prometheus-k8s,                    │
│                    │ prometheus-operator                                                   │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ ClusterRoleBinding │ blackbox-exporter, kube-state-metrics, node-exporter,                 │
│                    │ prometheus-adapter, resource-metrics:system:auth-delegator,           │
│                    │ prometheus-k8s, prometheus-operator                                   │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ ConfigMap          │ monitoring::monitoring-blackbox-exporter-configuration,               │
│                    │ monitoring::monitoring-grafana-dashboard-apiserver,                   │
│                    │ monitoring::monitoring-grafana-dashboard-cluster-total,               │
│                    │ monitoring::monitoring-grafana-dashboard-controller-manager,          │
│                    │ monitoring::monitoring-grafana-dashboard-k8s-resources-cluster,       │
│                    │ monitoring::monitoring-grafana-dashboard-k8s-resources-namespace,     │
│                    │ monitoring::monitoring-grafana-dashboard-k8s-resources-node,          │
│                    │ monitoring::monitoring-grafana-dashboard-k8s-resources-pod,           │
│                    │ monitoring::monitoring-grafana-dashboard-k8s-resources-workload,      │
│                    │ monitoring::monitoring-grafana-dashboard-k8s-resources-workloads-nam… │
│                    │ monitoring::monitoring-grafana-dashboard-kubelet,                     │
│                    │ monitoring::monitoring-grafana-dashboard-namespace-by-pod,            │
│                    │ monitoring::monitoring-grafana-dashboard-namespace-by-workload,       │
│                    │ monitoring::monitoring-grafana-dashboard-node-cluster-rsrc-use,       │
│                    │ monitoring::monitoring-grafana-dashboard-node-rsrc-use,               │
│                    │ monitoring::monitoring-grafana-dashboard-nodes,                       │
│                    │ monitoring::monitoring-grafana-dashboard-persistentvolumesusage,      │
│                    │ monitoring::monitoring-grafana-dashboard-pod-total,                   │
│                    │ monitoring::monitoring-grafana-dashboard-prometheus-remote-write,     │
│                    │ monitoring::monitoring-grafana-dashboard-prometheus,                  │
│                    │ monitoring::monitoring-grafana-dashboard-proxy,                       │
│                    │ monitoring::monitoring-grafana-dashboard-scheduler,                   │
│                    │ monitoring::monitoring-grafana-dashboard-statefulset,                 │
│                    │ monitoring::monitoring-grafana-dashboard-workload-total,              │
│                    │ monitoring::monitoring-grafana-dashboards,                            │
│                    │ monitoring::monitoring-adapter-config                                 │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Deployment         │ monitoring::monitoring-blackbox-exporter,                             │
│                    │ monitoring::monitoring-grafana,                                       │
│                    │ monitoring::monitoring-kube-state-metrics,                            │
│                    │ monitoring::monitoring-prometheus-adapter,                            │
│                    │ monitoring::monitoring-prometheus-operator                            │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ DaemonSet          │ monitoring::monitoring-node-exporter                                  │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ APIService         │ v1beta1.metrics.k8s.io                                                │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ RoleBinding        │ kube-system::kube-system-resource-metrics-auth-reader,                │
│                    │ monitoring::monitoring-prometheus-k8s-config,                         │
│                    │ default::default-prometheus-k8s,                                      │
│                    │ kube-system::kube-system-prometheus-k8s,                              │
│                    │ monitoring::monitoring-prometheus-k8s                                 │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Prometheus         │ monitoring::monitoring-k8s                                            │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Role               │ monitoring::monitoring-prometheus-k8s-config,                         │
│                    │ default::default-prometheus-k8s,                                      │
│                    │ kube-system::kube-system-prometheus-k8s,                              │
│                    │ monitoring::monitoring-prometheus-k8s                                 │
├────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ CustomResourceDef… │ alertmanagerconfigs.monitoring.coreos.com,                            │
│                    │ alertmanagers.monitoring.coreos.com,                                  │
│                    │ podmonitors.monitoring.coreos.com, probes.monitoring.coreos.com,      │
│                    │ prometheuses.monitoring.coreos.com,                                   │
│                    │ prometheusrules.monitoring.coreos.com,                                │
│                    │ servicemonitors.monitoring.coreos.com,                                │
│                    │ thanosrulers.monitoring.coreos.com                                    │
└────────────────────┴───────────────────────────────────────────────────────────────────────┘
? Are you sure to deploy 109 resources, 18 types on 1 provider? › (y/N)

Deploying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Deploying
    ✓ Namespace 2/2
    ✓ Alertmanager 1/1
    ✓ PodDisruptionBudget 2/2
    ✓ PrometheusRule 7/7
    ✓ Secret 2/2
    ✓ Service 8/8
    ✓ ServiceAccount 8/8
    ✓ ServiceMonitor 13/13
    ✓ ClusterRole 8/8
    ✓ ClusterRoleBinding 7/7
    ✓ ConfigMap 26/26
    ✓ Deployment 5/5
    ✓ DaemonSet 1/1
    ✓ APIService 1/1
    ✓ RoleBinding 5/5
    ✓ Prometheus 1/1
    ✓ Role 4/4
    ✓ CustomResourceDefinition 8/8
109 resources deployed of 18 types and 1 provider
Running OnDeployedGlobal resources on 1 provider: k8s
Command "gc a" executed in 1m 46s
```

All the Prometheus resources should have been installed, up and running.

### Accessing the Web UI

We'll the the `kubectl port-forward` command to access the web ui locally:

```sh
kubectl --namespace monitoring port-forward svc/prometheus-k8s 9090
```

Open the prometheus web interface: [http://localhost:9090/](http://localhost:9090/)

### Listing

List the resources deployed by GruCloud:

```
gc list --our
```

Intertested only in listing the pods ?

```sh
gc l -t Pod
```

Would you like to inspect a specific pod by name ?

```
gc l -t Pod --name prometheus-k8s-0
```

Maybe listing the pods and the deployments ?

```sh
gc l -t Pod -t Deployment
```

### Destroy

The resources can be destroyed with the _destroy_ command:

```sh
gc destroy
```
