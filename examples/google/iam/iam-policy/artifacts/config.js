module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-iac-policy",
  projectId: "grucloud-test",
  iam: {
    ServiceAccount: {
      saSaExamplePolicy: {
        name: "sa-example-policy",
        properties: {
          serviceAccount: {
            displayName: "SA dev",
            description: "Managed By GruCloud",
          },
        },
      },
    },
    Policy: {
      policy: {
        name: "policy",
        properties: {
          bindings: [
            {
              role: "roles/compute.admin",
              members: [
                "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/compute.serviceAgent",
              members: [
                "serviceAccount:service-91170824493@compute-system.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/compute.viewer",
              members: [
                "serviceAccount:sa-grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/dns.admin",
              members: [
                "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/iam.serviceAccountAdmin",
              members: [
                "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/owner",
              members: ["user:fred@grucloud.com"],
            },
            {
              role: "roles/resourcemanager.projectIamAdmin",
              members: [
                "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/storage.admin",
              members: [
                "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
            {
              role: "roles/storage.objectAdmin",
              members: [
                "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
              ],
            },
          ],
        },
      },
    },
  },
});
