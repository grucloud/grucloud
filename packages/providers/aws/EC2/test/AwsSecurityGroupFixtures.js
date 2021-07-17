exports.SecurityGroupRulesFixture = [
  {
    SecurityGroupRuleId: "sgr-1234567890",
    GroupId: "sg-08c44658ef9788a55",
    IpProtocol: "tcp",
    FromPort: 22,
    ToPort: 22,
    CidrIpv6: "::/0",
    Tags: [
      {
        Key: "Name",
        Value: "sg-rule-ingress-port-22",
      },
    ],
  },
  {
    SecurityGroupRuleId: "sgr-2234567890",
    GroupId: "sg-f4139a96",
    IpProtocol: "-1",
    FromPort: -1,
    ToPort: -1,
    CidrIpv4: "0.0.0.0/0",
    Tags: [],
  },
  {
    SecurityGroupRuleId: "sgr-3234567890",
    GroupId: "sg-08c44658ef9788a55",
    IpProtocol: "tcp",
    FromPort: 22,
    ToPort: 22,
    CidrIpv4: "0.0.0.0/0",
    Tags: [
      {
        Key: "Name",
        Value: "sg-rule-ingress-port-22",
      },
    ],
  },
  {
    SecurityGroupRuleId: "sgr-4234567890",
    GroupId: "sg-09e37cba85cd2b978",
    IpProtocol: "-1",
    FromPort: -1,
    ToPort: -1,
    ReferencedGroupInfo: {
      GroupId: "sg-09e37cba85cd2b978",
      UserId: "840541460064",
    },
    Tags: [],
  },
];

exports.SecurityGroupRulesFixtureMerged = [
  {
    SecurityGroupRuleId: "sgr-2234567890",
    GroupId: "sg-f4139a96",
    IpPermission: {
      IpProtocol: "-1",
      FromPort: -1,
      ToPort: -1,
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
    },
    Tags: [],
  },
  {
    SecurityGroupRuleId: "sgr-3234567890",
    GroupId: "sg-08c44658ef9788a55",
    IpPermission: {
      IpProtocol: "tcp",
      FromPort: 22,
      ToPort: 22,
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
    },
    Tags: [
      {
        Key: "Name",
        Value: "sg-rule-ingress-port-22",
      },
    ],
  },

  {
    SecurityGroupRuleId: "sgr-4234567890",
    GroupId: "sg-09e37cba85cd2b978",
    IpPermission: {
      IpProtocol: "-1",
      FromPort: -1,
      ToPort: -1,
      UserIdGroupPairs: [{ GroupId: "sg-09e37cba85cd2b978" }],
    },
    Tags: [],
  },
];
