// Generated by k8s-manifest2code from web-ui-dashboard.yaml
const assert = require("assert");
exports.createResources = ({ provider }) => {
  const kubernetesDashboardNamespace = provider.makeNamespace({
    properties: () => ({
      apiVersion: "v1",
      metadata: {
        name: "kubernetes-dashboard",
      },
    }),
  });

  const kubernetesDashboardkubernetesDashboardServiceAccount = provider.makeServiceAccount(
    {
      properties: () => ({
        apiVersion: "v1",
        metadata: {
          labels: {
            "k8s-app": "kubernetes-dashboard",
          },
          name: "kubernetes-dashboard",
          namespace: "kubernetes-dashboard",
        },
      }),
    }
  );

  const kubernetesDashboardkubernetesDashboardService = provider.makeService({
    properties: () => ({
      apiVersion: "v1",
      metadata: {
        labels: {
          "k8s-app": "kubernetes-dashboard",
        },
        name: "kubernetes-dashboard",
        namespace: "kubernetes-dashboard",
      },
      spec: {
        ports: [
          {
            port: 443,
            targetPort: 8443,
          },
        ],
        selector: {
          "k8s-app": "kubernetes-dashboard",
        },
      },
    }),
  });

  const kubernetesDashboardkubernetesDashboardCertsSecret = provider.makeSecret(
    {
      properties: () => ({
        apiVersion: "v1",
        metadata: {
          labels: {
            "k8s-app": "kubernetes-dashboard",
          },
          name: "kubernetes-dashboard-certs",
          namespace: "kubernetes-dashboard",
        },
        type: "Opaque",
      }),
    }
  );

  const kubernetesDashboardkubernetesDashboardCsrfSecret = provider.makeSecret({
    properties: () => ({
      apiVersion: "v1",
      metadata: {
        labels: {
          "k8s-app": "kubernetes-dashboard",
        },
        name: "kubernetes-dashboard-csrf",
        namespace: "kubernetes-dashboard",
      },
      type: "Opaque",
      data: {
        csrf: "",
      },
    }),
  });

  const kubernetesDashboardkubernetesDashboardKeyHolderSecret = provider.makeSecret(
    {
      properties: () => ({
        apiVersion: "v1",
        metadata: {
          labels: {
            "k8s-app": "kubernetes-dashboard",
          },
          name: "kubernetes-dashboard-key-holder",
          namespace: "kubernetes-dashboard",
        },
        type: "Opaque",
      }),
    }
  );

  const kubernetesDashboardkubernetesDashboardSettingsConfigMap = provider.makeConfigMap(
    {
      properties: () => ({
        apiVersion: "v1",
        metadata: {
          labels: {
            "k8s-app": "kubernetes-dashboard",
          },
          name: "kubernetes-dashboard-settings",
          namespace: "kubernetes-dashboard",
        },
      }),
    }
  );

  const kubernetesDashboardkubernetesDashboardRole = provider.makeRole({
    properties: () => ({
      apiVersion: "rbac.authorization.k8s.io/v1",
      metadata: {
        labels: {
          "k8s-app": "kubernetes-dashboard",
        },
        name: "kubernetes-dashboard",
        namespace: "kubernetes-dashboard",
      },
      rules: [
        {
          apiGroups: [""],
          resources: ["secrets"],
          resourceNames: [
            "kubernetes-dashboard-key-holder",
            "kubernetes-dashboard-certs",
            "kubernetes-dashboard-csrf",
          ],
          verbs: ["get", "update", "delete"],
        },
        {
          apiGroups: [""],
          resources: ["configmaps"],
          resourceNames: ["kubernetes-dashboard-settings"],
          verbs: ["get", "update"],
        },
        {
          apiGroups: [""],
          resources: ["services"],
          resourceNames: ["heapster", "dashboard-metrics-scraper"],
          verbs: ["proxy"],
        },
        {
          apiGroups: [""],
          resources: ["services/proxy"],
          resourceNames: [
            "heapster",
            "http:heapster:",
            "https:heapster:",
            "dashboard-metrics-scraper",
            "http:dashboard-metrics-scraper",
          ],
          verbs: ["get"],
        },
      ],
    }),
  });

  const kubernetesDashboardClusterRole = provider.makeClusterRole({
    properties: () => ({
      apiVersion: "rbac.authorization.k8s.io/v1",
      metadata: {
        labels: {
          "k8s-app": "kubernetes-dashboard",
        },
        name: "kubernetes-dashboard",
      },
      rules: [
        {
          apiGroups: ["metrics.k8s.io"],
          resources: ["pods", "nodes"],
          verbs: ["get", "list", "watch"],
        },
      ],
    }),
  });

  const kubernetesDashboardkubernetesDashboardRoleBinding = provider.makeRoleBinding(
    {
      properties: () => ({
        apiVersion: "rbac.authorization.k8s.io/v1",
        metadata: {
          labels: {
            "k8s-app": "kubernetes-dashboard",
          },
          name: "kubernetes-dashboard",
          namespace: "kubernetes-dashboard",
        },
        roleRef: {
          apiGroup: "rbac.authorization.k8s.io",
          kind: "Role",
          name: "kubernetes-dashboard",
        },
        subjects: [
          {
            kind: "ServiceAccount",
            name: "kubernetes-dashboard",
            namespace: "kubernetes-dashboard",
          },
        ],
      }),
    }
  );

  const kubernetesDashboardClusterRoleBinding = provider.makeClusterRoleBinding(
    {
      properties: () => ({
        apiVersion: "rbac.authorization.k8s.io/v1",
        metadata: {
          name: "kubernetes-dashboard",
        },
        roleRef: {
          apiGroup: "rbac.authorization.k8s.io",
          kind: "ClusterRole",
          name: "kubernetes-dashboard",
        },
        subjects: [
          {
            kind: "ServiceAccount",
            name: "kubernetes-dashboard",
            namespace: "kubernetes-dashboard",
          },
        ],
      }),
    }
  );

  const kubernetesDashboardkubernetesDashboardDeployment = provider.makeDeployment(
    {
      properties: () => ({
        apiVersion: "apps/v1",
        metadata: {
          labels: {
            "k8s-app": "kubernetes-dashboard",
          },
          name: "kubernetes-dashboard",
          namespace: "kubernetes-dashboard",
        },
        spec: {
          replicas: 1,
          revisionHistoryLimit: 10,
          selector: {
            matchLabels: {
              "k8s-app": "kubernetes-dashboard",
            },
          },
          template: {
            metadata: {
              labels: {
                "k8s-app": "kubernetes-dashboard",
              },
            },
            spec: {
              containers: [
                {
                  name: "kubernetes-dashboard",
                  image: "kubernetesui/dashboard:v2.2.0",
                  imagePullPolicy: "Always",
                  ports: [
                    {
                      containerPort: 8443,
                      protocol: "TCP",
                    },
                  ],
                  args: [
                    "--auto-generate-certificates",
                    "--namespace=kubernetes-dashboard",
                  ],
                  volumeMounts: [
                    {
                      name: "kubernetes-dashboard-certs",
                      mountPath: "/certs",
                    },
                    {
                      mountPath: "/tmp",
                      name: "tmp-volume",
                    },
                  ],
                  livenessProbe: {
                    httpGet: {
                      scheme: "HTTPS",
                      path: "/",
                      port: 8443,
                    },
                    initialDelaySeconds: 30,
                    timeoutSeconds: 30,
                  },
                  securityContext: {
                    allowPrivilegeEscalation: false,
                    readOnlyRootFilesystem: true,
                    runAsUser: 1001,
                    runAsGroup: 2001,
                  },
                },
              ],
              volumes: [
                {
                  name: "kubernetes-dashboard-certs",
                  secret: {
                    secretName: "kubernetes-dashboard-certs",
                  },
                },
                {
                  name: "tmp-volume",
                  emptyDir: {},
                },
              ],
              serviceAccountName: "kubernetes-dashboard",
              nodeSelector: {
                "kubernetes.io/os": "linux",
              },
              tolerations: [
                {
                  key: "node-role.kubernetes.io/master",
                  effect: "NoSchedule",
                },
              ],
            },
          },
        },
      }),
    }
  );

  const kubernetesDashboarddashboardMetricsScraperService = provider.makeService(
    {
      properties: () => ({
        apiVersion: "v1",
        metadata: {
          labels: {
            "k8s-app": "dashboard-metrics-scraper",
          },
          name: "dashboard-metrics-scraper",
          namespace: "kubernetes-dashboard",
        },
        spec: {
          ports: [
            {
              port: 8000,
              targetPort: 8000,
            },
          ],
          selector: {
            "k8s-app": "dashboard-metrics-scraper",
          },
        },
      }),
    }
  );

  const kubernetesDashboarddashboardMetricsScraperDeployment = provider.makeDeployment(
    {
      properties: () => ({
        apiVersion: "apps/v1",
        metadata: {
          labels: {
            "k8s-app": "dashboard-metrics-scraper",
          },
          name: "dashboard-metrics-scraper",
          namespace: "kubernetes-dashboard",
        },
        spec: {
          replicas: 1,
          revisionHistoryLimit: 10,
          selector: {
            matchLabels: {
              "k8s-app": "dashboard-metrics-scraper",
            },
          },
          template: {
            metadata: {
              labels: {
                "k8s-app": "dashboard-metrics-scraper",
              },
              annotations: {
                "seccomp.security.alpha.kubernetes.io/pod": "runtime/default",
              },
            },
            spec: {
              containers: [
                {
                  name: "dashboard-metrics-scraper",
                  image: "kubernetesui/metrics-scraper:v1.0.6",
                  ports: [
                    {
                      containerPort: 8000,
                      protocol: "TCP",
                    },
                  ],
                  livenessProbe: {
                    httpGet: {
                      scheme: "HTTP",
                      path: "/",
                      port: 8000,
                    },
                    initialDelaySeconds: 30,
                    timeoutSeconds: 30,
                  },
                  volumeMounts: [
                    {
                      mountPath: "/tmp",
                      name: "tmp-volume",
                    },
                  ],
                  securityContext: {
                    allowPrivilegeEscalation: false,
                    readOnlyRootFilesystem: true,
                    runAsUser: 1001,
                    runAsGroup: 2001,
                  },
                },
              ],
              serviceAccountName: "kubernetes-dashboard",
              nodeSelector: {
                "kubernetes.io/os": "linux",
              },
              tolerations: [
                {
                  key: "node-role.kubernetes.io/master",
                  effect: "NoSchedule",
                },
              ],
              volumes: [
                {
                  name: "tmp-volume",
                  emptyDir: {},
                },
              ],
            },
          },
        },
      }),
    }
  );

  return {
    kubernetesDashboardNamespace,
    kubernetesDashboardkubernetesDashboardServiceAccount,
    kubernetesDashboardkubernetesDashboardService,
    kubernetesDashboardkubernetesDashboardCertsSecret,
    kubernetesDashboardkubernetesDashboardCsrfSecret,
    kubernetesDashboardkubernetesDashboardKeyHolderSecret,
    kubernetesDashboardkubernetesDashboardSettingsConfigMap,
    kubernetesDashboardkubernetesDashboardRole,
    kubernetesDashboardClusterRole,
    kubernetesDashboardkubernetesDashboardRoleBinding,
    kubernetesDashboardClusterRoleBinding,
    kubernetesDashboardkubernetesDashboardDeployment,
    kubernetesDashboarddashboardMetricsScraperService,
    kubernetesDashboarddashboardMetricsScraperDeployment,
  };
};