---
id: LoggingConfiguration
title: Logging Configuration
---

Provides a [Network Firewall Logging Configuration](https://console.aws.amazon.com/vpc/home?#NetworkFirewalls:)

```js
exports.createResources = () => [
  {
    type: "LoggingConfiguration",
    group: "NetworkFirewall",
    properties: ({}) => ({
      LoggingConfiguration: {
        LogDestinationConfigs: [
          {
            LogDestination: {
              logGroup: "/aws/network-firewall/flows",
            },
            LogDestinationType: "CloudWatchLogs",
            LogType: "FLOW",
          },
          {
            LogDestination: {
              logGroup: "/aws/network-firewall/alerts",
            },
            LogDestinationType: "CloudWatchLogs",
            LogType: "ALERT",
          },
        ],
      },
    }),
    dependencies: () => ({
      firewall: "NetworkFirewall"
      logGroups: [
        "/aws/network-firewall/alerts",
        "/aws/network-firewall/flows",
      ],
    }),
  },
];
```

### Examples

- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

### Properties

- [UpdateLoggingConfigurationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-network-firewall/interfaces/updateloggingconfigurationcommandinput.html)

### Dependencies

- [Firewall](./Firewall.md)
- [CloudWatchLog LogGroup](../CloudWatchLogs/LogGroup.md)
- [S3 Bucket](../S3/Bucket.md)

### List

```sh
gc l -t NetworkFirewall::LoggingConfiguration
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 NetworkFirewall::LoggingConfiguration from aws                           │
├────────────────────────────────────────────────────────────────────────────┤
│ name: NetworkFirewall                                                      │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   FirewallArn: arn:aws:network-firewall:us-east-1:840541460064:firewall/N… │
│   LoggingConfiguration:                                                    │
│     LogDestinationConfigs:                                                 │
│       - LogDestination:                                                    │
│           logGroup: /aws/network-firewall/flows                            │
│         LogDestinationType: CloudWatchLogs                                 │
│         LogType: FLOW                                                      │
│       - LogDestination:                                                    │
│           logGroup: /aws/network-firewall/alerts                           │
│         LogDestinationType: CloudWatchLogs                                 │
│         LogType: ALERT                                                     │
│   FirewallName: NetworkFirewall                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├───────────────────────────────────────┬───────────────────────────────────┤
│ NetworkFirewall::LoggingConfiguration │ NetworkFirewall                   │
└───────────────────────────────────────┴───────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkFirewall::LoggingConfiguration" executed in 8s, 169 MB
```
