// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ManagedPrefixList",
    group: "EC2",
    properties: ({}) => ({
      PrefixListName: "my-prefix",
      AddressFamily: "IPv4",
      MaxEntries: 6,
      Entries: [
        {
          Cidr: "10.0.0.0/24",
        },
        {
          Cidr: "10.0.2.0/24",
        },
      ],
    }),
  },
];
