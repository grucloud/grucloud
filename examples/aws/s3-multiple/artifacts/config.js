module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-s3-multiple",
  s3: {
    Bucket: {
      grucloudBucket_0: {
        name: "grucloud-bucket-0",
      },
      grucloudBucket_1: {
        name: "grucloud-bucket-1",
      },
      grucloudSimpleBucket: {
        name: "grucloud-simple-bucket",
      },
    },
  },
});
