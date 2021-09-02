module.exports = ({ stage }) => ({
  CloudWatchEvents: {
    Rule: {
      ruleTestEc2: {
        name: "rule-test-ec2",
        properties: {
          EventPattern:
            '{"source":["aws.acm"],"detail-type":["ACM Certificate Approaching Expiration"]}',
          State: "DISABLED",
        },
      },
    },
  },
});
