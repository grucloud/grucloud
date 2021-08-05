module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-s3-simple",
  s3: {
    Bucket: {
      grucloudSimpleBucket: {
        name: "grucloud-simple-bucket",
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
              Key: "Key2",
              Value: "Value2",
            },
            {
              Key: "Key1",
              Value: "Value1",
            },
          ],
        },
      },
    },
  },
});
