const createResources = ({ provider }) => {
  provider.IAM.makeRole({
    name: "ecsInstanceRole",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["service-role/AmazonEC2ContainerServiceforEC2Role"],
    }),
  });

  provider.IAM.usePolicy({
    name: "service-role/AmazonEC2ContainerServiceforEC2Role",
    properties: ({}) => ({
      Arn: "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
    }),
  });

  provider.IAM.makeInstanceProfile({
    name: "ecsInstanceRole",
    dependencies: () => ({
      roles: ["ecsInstanceRole"],
    }),
  });
};

exports.createResources = createResources;
