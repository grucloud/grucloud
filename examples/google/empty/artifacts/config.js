module.exports = ({ stage }) => ({
  projectName: "example-grucloud-infra-google",
  projectId: "grucloud-test",
  iam: {
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
    Binding: {
      rolesComputeAdmin: {
        name: "roles/compute.admin",
        properties: {
          role: "roles/compute.admin",
          members: [
            "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
      rolesComputeServiceAgent: {
        name: "roles/compute.serviceAgent",
        properties: {
          role: "roles/compute.serviceAgent",
          members: [
            "serviceAccount:service-91170824493@compute-system.iam.gserviceaccount.com",
          ],
        },
      },
      rolesComputeViewer: {
        name: "roles/compute.viewer",
        properties: {
          role: "roles/compute.viewer",
          members: [
            "serviceAccount:sa-grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
      rolesDnsAdmin: {
        name: "roles/dns.admin",
        properties: {
          role: "roles/dns.admin",
          members: [
            "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
      rolesIamServiceAccountAdmin: {
        name: "roles/iam.serviceAccountAdmin",
        properties: {
          role: "roles/iam.serviceAccountAdmin",
          members: [
            "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
      rolesOwner: {
        name: "roles/owner",
        properties: {
          role: "roles/owner",
          members: ["user:fred@grucloud.com"],
        },
      },
      rolesResourcemanagerProjectIamAdmin: {
        name: "roles/resourcemanager.projectIamAdmin",
        properties: {
          role: "roles/resourcemanager.projectIamAdmin",
          members: [
            "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
      rolesStorageAdmin: {
        name: "roles/storage.admin",
        properties: {
          role: "roles/storage.admin",
          members: [
            "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
      rolesStorageObjectAdmin: {
        name: "roles/storage.objectAdmin",
        properties: {
          role: "roles/storage.objectAdmin",
          members: [
            "serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com",
          ],
        },
      },
    },
  },
});
