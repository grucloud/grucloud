module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-storage-simple",
  projectId: "grucloud-test",
  storage: {
    Bucket: {
      grucloudTest: {
        name: "grucloud-test",
        properties: {
          kind: "storage#bucket",
          selfLink: "https://www.googleapis.com/storage/v1/b/grucloud-test",
          id: "grucloud-test",
          name: "grucloud-test",
          projectNumber: "91170824493",
          metageneration: "1",
          location: "EUROPE-WEST4",
          storageClass: "STANDARD",
          etag: "CAE=",
          timeCreated: "2021-08-31T02:48:01.869Z",
          updated: "2021-08-31T02:48:01.869Z",
          labels: {
            "gc-stage": "dev",
            "managed-by": "grucloud",
          },
          iamConfiguration: {
            bucketPolicyOnly: {
              enabled: false,
            },
            uniformBucketLevelAccess: {
              enabled: false,
            },
            publicAccessPrevention: "unspecified",
          },
          locationType: "region",
          iam: {
            kind: "storage#policy",
            resourceId: "projects/_/buckets/grucloud-test",
            version: 1,
            etag: "CAE=",
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
          kind: "storage#object",
          id: "grucloud-test/myfile/1630378087852321",
          selfLink:
            "https://www.googleapis.com/storage/v1/b/grucloud-test/o/myfile",
          mediaLink:
            "https://storage.googleapis.com/download/storage/v1/b/grucloud-test/o/myfile?generation=1630378087852321&alt=media",
          name: "myfile",
          bucket: "grucloud-test",
          generation: "1630378087852321",
          metageneration: "1",
          contentType: "text/json",
          storageClass: "STANDARD",
          size: "1282",
          md5Hash: "4UYKqsQFhQLneBa+f35akQ==",
          crc32c: "VOh2jQ==",
          etag: "CKHSmtaf2vICEAE=",
          timeCreated: "2021-08-31T02:48:07.853Z",
          updated: "2021-08-31T02:48:07.853Z",
          timeStorageClassUpdated: "2021-08-31T02:48:07.853Z",
          metadata: {
            "managed-by": "grucloud",
            "gc-stage": "dev",
          },
        },
      },
    },
  },
});
