module.exports = ({ stage }) => ({
  projectName: "aws-example-cloudwatchevent",
  CloudWatchEvents: {
    EventBus: {
      busTest: {
        name: "bus-test",
      },
    },
    Rule: {
      ruleTest: {
        name: "rule-test",
        properties: {
          EventPattern:
            '{"source":["aws.ec2"],"detail-type":["EC2 Instance State-change Notification"]}',
          State: "ENABLED",
          Description: "testing rule",
          Targets: [],
        },
      },
      ruleTestEc2: {
        name: "rule-test-ec2",
        properties: {
          EventPattern:
            '{"source":["aws.acm"],"detail-type":["ACM Certificate Approaching Expiration"]}',
          State: "ENABLED",
          Targets: [],
        },
      },
    },
  },
});
