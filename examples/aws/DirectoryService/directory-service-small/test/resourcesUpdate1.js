// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Directory",
    group: "DirectoryService",
    properties: ({}) => ({
      Name: "grucloud.org",
      ShortName: "grucloud",
      Size: "Small",
      Type: "SimpleAD",
      EventTopics: [
        {
          TopicName: "DirectoryMonitoring_grucloud",
        },
      ],
      Password: process.env.GRUCLOUD_ORG_PASSWORD,
    }),
    dependencies: ({}) => ({
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-b",
      ],
      snsTopics: ["DirectoryMonitoring_grucloud"],
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "DirectoryMonitoring_grucloud",
    properties: ({}) => ({
      Attributes: {
        DisplayName: "AWSDIRSrvc",
      },
    }),
  },
];
