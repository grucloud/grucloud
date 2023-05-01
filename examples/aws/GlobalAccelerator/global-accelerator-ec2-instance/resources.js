// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "my-instance",
    properties: ({ config, getId }) => ({
      Image: {
        Description:
          "Amazon Linux 2 Kernel 5.10 AMI 2.0.20221004.0 x86_64 HVM gp2",
      },
      InstanceType: "t2.micro",
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          Groups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::vpc-default::launch-wizard-1",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-default::subnet-default-d",
          })}`,
        },
      ],
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-default::subnet-default-d"],
      securityGroups: ["sg::vpc-default::launch-wizard-1"],
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "launch-wizard-1",
      Description: "launch-wizard created 2022-10-24T21:50:15.364Z",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-default::launch-wizard-1",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-d",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Accelerator",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      AcceleratorAttributes: {
        FlowLogsEnabled: true,
        FlowLogsS3Bucket: "grucloud-global-accelarator",
        FlowLogsS3Prefix: "test",
      },
      Name: "my-accelerator",
    }),
    dependencies: ({}) => ({
      s3Bucket: "grucloud-global-accelarator",
    }),
  },
  {
    type: "EndpointGroup",
    group: "GlobalAccelerator",
    properties: ({ getId }) => ({
      AcceleratorName: "my-accelerator",
      EndpointConfigurations: [
        {
          ClientIPPreservationEnabled: true,
          EndpointId: `${getId({
            type: "Instance",
            group: "EC2",
            name: "my-instance",
          })}`,
          Weight: 128,
        },
      ],
      EndpointGroupRegion: "us-east-1",
      HealthCheckPort: 443,
      HealthCheckProtocol: "TCP",
    }),
    dependencies: ({}) => ({
      listener: "my-accelerator::TCP::443::443",
      ec2Instances: ["my-instance"],
    }),
  },
  {
    type: "Listener",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      AcceleratorName: "my-accelerator",
      PortRanges: [
        {
          FromPort: 443,
          ToPort: 443,
        },
      ],
      Protocol: "TCP",
    }),
    dependencies: ({}) => ({
      accelerator: "my-accelerator",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: "grucloud-global-accelarator",
      Policy: {
        Version: "2012-10-17",
        Id: "AWSLogDeliveryWrite20150319",
        Statement: [
          {
            Sid: "AWSLogDeliveryWrite",
            Effect: "Allow",
            Principal: {
              Service: "delivery.logs.amazonaws.com",
            },
            Action: "s3:PutObject",
            Resource: `arn:aws:s3:::grucloud-global-accelarator/test/AWSLogs/${config.accountId()}/*`,
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
                "s3:x-amz-acl": "bucket-owner-full-control",
              },
              ArnLike: {
                "aws:SourceArn": `arn:aws:logs:us-west-2:${config.accountId()}:*`,
              },
            },
          },
          {
            Sid: "AWSLogDeliveryAclCheck",
            Effect: "Allow",
            Principal: {
              Service: "delivery.logs.amazonaws.com",
            },
            Action: "s3:GetBucketAcl",
            Resource: "arn:aws:s3:::grucloud-global-accelarator",
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
              },
              ArnLike: {
                "aws:SourceArn": `arn:aws:logs:us-west-2:${config.accountId()}:*`,
              },
            },
          },
        ],
      },
    }),
  },
];
