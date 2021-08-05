module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-s3-simple",
  s3: {
    Bucket: {
      grucloudSimpleBucket: {
        name: "grucloud-simple-bucket",
        properties: {
          LocationConstraint: "",
        },
      },
    },
    Object: {
      grucloudSimpleFileTest: {
        name: "grucloud-simple-file-test",
        properties: {
          ContentType: "text/plain",
          ServerSideEncryption: "AES256",
          source: "s3/grucloud-simple-bucket/grucloud-simple-file-test.txt",
          Tags: [
            {
              Key: "key1",
              Value: "value1",
            },
            {
              Key: "key2",
              Value: "value2",
            },
          ],
        },
      },
    },
  },
});
