const createResources = ({ provider }) => {
  provider.CloudWatchEvents.makeRule({
    name: "rule-test-ec2",
    properties: () => ({
      EventPattern:
        '{"source":["aws.acm"],"detail-type":["ACM Certificate Approaching Expiration"]}',
      State: "DISABLED",
    }),
    dependencies: ({ resources }) => ({
      eventBus: resources.CloudWatchEvents.EventBus["bus-test"],
    }),
  });
};

exports.createResources = createResources;
