module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-storage-simple",
  projectId: "grucloud-test",
  storage: {
    Bucket: {
      grucloudTest: {
        name: "grucloud-test",
        properties: {
          storageClass: "STANDARD",
          iamConfiguration: {
            bucketPolicyOnly: {
              enabled: false,
            },
            uniformBucketLevelAccess: {
              enabled: false,
            },
            publicAccessPrevention: "unspecified",
          },
          iam: {
            bindings: [
              {
                role: "roles/storage.legacyBucketOwner",
                members: [
                  "projectEditor:grucloud-test",
                  "projectOwner:grucloud-test",
                ],
              },
              {
                role: "roles/storage.legacyBucketReader",
                members: ["projectViewer:grucloud-test"],
              },
            ],
          },
        },
      },
    },
    Object: {
      myfile: {
        name: "myfile",
        properties: {
          contentType: "text/json",
          storageClass: "STANDARD",
        },
      },
    },
  },
});
