const { K8sProvider } = require("@grucloud/provider-k8s");
const Dashboard = require("./resources");

exports.createResources = async ({ provider }) => {
  const adminUsername = "dashboard-admin-user";

  const serviceAccountAdminUser = await provider.makeServiceAccount({
    name: adminUsername,
    properties: () => ({
      metadata: {
        namespace: "kubernetes-dashboard",
      },
    }),
  });

  const clusterRoleBindingAdminUser = await provider.makeClusterRoleBinding({
    name: adminUsername,
    properties: () => ({
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "cluster-admin",
      },
      subjects: [
        {
          kind: "ServiceAccount",
          name: adminUsername,
          namespace: "kubernetes-dashboard",
        },
      ],
    }),
  });

  const dashboardResources = await Dashboard.createResources({ provider });

  return {
    ...dashboardResources,
    serviceAccountAdminUser,
    clusterRoleBindingAdminUser,
  };
};
