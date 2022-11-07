const assert = require("assert");
const { tap, pipe, map, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const {
  ElasticBeanstalkApplication,
} = require("./ElasticBeanstalkApplication");
const {
  ElasticBeanstalkApplicationVersion,
} = require("./ElasticBeanstalkApplicationVersion");
const {
  ElasticBeanstalkEnvironment,
} = require("./ElasticBeanstalkEnvironment");

const GROUP = "ElasticBeanstalk";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    {
      type: "Application",
      Client: ElasticBeanstalkApplication,
      omitProperties: [
        "ApplicationArn",
        "DateCreated",
        "DateUpdated",
        "Versions",
      ],
      inferName: get("properties.ApplicationName"),
      propertiesDefault: {},
      dependencies: {
        serviceRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            get("ResourceLifecycleConfig.ServiceRole"),
        },
      },
    },
    {
      type: "ApplicationVersion",
      Client: ElasticBeanstalkApplicationVersion,
      omitProperties: [
        "ApplicationVersionArn",
        "DateCreated",
        "DateUpdated",
        "Status",
        //TODO
        //"ApplicationName",
      ],
      inferName: ({
        properties: { VersionLabel },
        dependenciesSpec: { application },
      }) => pipe([() => `${application}::${VersionLabel}`])(),
      propertiesDefault: {},
      dependencies: {
        application: {
          type: "Application",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ApplicationName"),
        },
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) => get("SourceBundle.S3Bucket"),
        },
      },
    },
    {
      type: "Environment",
      Client: ElasticBeanstalkEnvironment,
      omitProperties: [
        "EnvironmentId",
        "EnvironmentArn",
        "Status",
        "EndpointURL",
        "CNAME",
        "DateCreated",
        "DateUpdated",
        "Health",
        "HealthStatus",
        "ApplicationName",
        "PlatformArn",
      ],
      inferName: ({
        properties: { EnvironmentName },
        dependenciesSpec: { application },
      }) =>
        pipe([
          tap((params) => {
            assert(application);
          }),
          () => `${application}::${EnvironmentName}`,
        ])(),
      propertiesDefault: { AbortableOperationInProgress: false },
      dependencies: {
        application: {
          type: "Application",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ApplicationName"),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
