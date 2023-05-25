// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Application",
    group: "AppConfig",
    properties: ({}) => ({
      Name: "appconfig-evidently",
    }),
  },
  {
    type: "Environment",
    group: "AppConfig",
    properties: ({}) => ({
      Name: "dev",
    }),
    dependencies: ({}) => ({
      application: "appconfig-evidently",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "EvidentlyProject/",
    }),
  },
  {
    type: "Experiment",
    group: "Evidently",
    properties: ({}) => ({
      metricGoals: [
        {
          desiredChange: "INCREASE",
          metricDefinition: {
            entityIdKey: "userdetails",
            name: "my-metric",
            valueKey: "details/value",
          },
        },
      ],
      name: "my-experiment",
      onlineAbConfig: {
        controlTreatmentName: "Variation1",
        treatmentWeights: {
          Variation1: 50000,
          Variation2: 50000,
        },
      },
      treatments: [
        {
          feature: "my-feature",
          name: "Variation1",
          variation: "Variation1",
        },
        {
          feature: "my-feature",
          name: "Variation2",
          variation: "Variation2",
        },
      ],
    }),
    dependencies: ({}) => ({
      project: "my-project",
    }),
  },
  {
    type: "Feature",
    group: "Evidently",
    properties: ({}) => ({
      defaultVariation: "Variation1",
      evaluationStrategy: "ALL_RULES",
      name: "my-feature",
      variations: [
        {
          name: "Variation1",
          value: {
            stringValue: "foo",
          },
        },
        {
          name: "Variation2",
          value: {
            stringValue: "bar",
          },
        },
      ],
    }),
    dependencies: ({}) => ({
      project: "my-project",
    }),
  },
  {
    type: "Launch",
    group: "Evidently",
    properties: ({}) => ({
      groups: [
        {
          feature: "my-feature",
          name: "V2",
          variation: "Variation1",
        },
        {
          feature: "my-feature",
          name: "V1",
          variation: "Variation2",
        },
      ],
      name: "my-launch",
      randomizationSalt: "my-launch",
      scheduledSplitsConfig: {
        steps: [
          {
            groupWeights: {
              V1: 0,
              V2: 0,
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      project: "my-project",
    }),
  },
  {
    type: "Project",
    group: "Evidently",
    properties: ({}) => ({
      dataDelivery: {
        cloudWatchLogs: {
          logGroup: "EvidentlyProject/",
        },
      },
      name: "my-project",
    }),
    dependencies: ({}) => ({
      appConfigApplication: "appconfig-evidently",
      appConfigEnvironment: "appconfig-evidently::dev",
    }),
  },
];