// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "ElasticIpAddress", group: "EC2", name: "my-ip" },
  {
    type: "Accelerator",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      AcceleratorAttributes: {
        FlowLogsEnabled: false,
      },
      Name: "my-accelarator",
    }),
  },
  {
    type: "EndpointGroup",
    group: "GlobalAccelerator",
    properties: ({ getId }) => ({
      EndpointConfigurations: [
        {
          ClientIPPreservationEnabled: false,
          EndpointId: `${getId({
            type: "ElasticIpAddress",
            group: "EC2",
            name: "my-ip",
          })}`,
          Weight: 128,
        },
      ],
      EndpointGroupRegion: "us-east-1",
      HealthCheckPort: 443,
      HealthCheckProtocol: "TCP",
      AcceleratorName: "my-accelarator",
    }),
    dependencies: ({}) => ({
      listener: "my-accelarator::TCP::443::443",
      eips: ["my-ip"],
    }),
  },
  {
    type: "Listener",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      PortRanges: [
        {
          FromPort: 443,
          ToPort: 443,
        },
      ],
      Protocol: "TCP",
      AcceleratorName: "my-accelarator",
    }),
    dependencies: ({}) => ({
      accelerator: "my-accelarator",
    }),
  },
];
