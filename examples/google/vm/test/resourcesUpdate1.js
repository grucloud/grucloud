// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Firewall",
    group: "compute",
    properties: ({}) => ({
      name: "firewall-22-80-433",
      description: "Managed By GruCloud",
      priority: 1000,
      allowed: [
        {
          IPProtocol: "tcp",
          ports: ["22", "80", "433", "5432"],
        },
      ],
      direction: "INGRESS",
      logConfig: {
        enable: false,
      },
    }),
  },
];
