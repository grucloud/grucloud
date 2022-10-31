---
id: Dashboard
title: Dashboard
---

Manages an [Cloud Watch Dashboard](https://console.aws.amazon.com/cloudwatch/home?#dashboards).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Dashboard",
    group: "CloudWatch",
    properties: ({}) => ({
      DashboardBody: {
        widgets: [
          {
            type: "metric",
            x: 0,
            y: 15,
            width: 6,
            height: 6,
            properties: {
              view: "timeSeries",
              stacked: false,
              metrics: [
                [
                  "AWS/Billing",
                  "EstimatedCharges",
                  "Currency",
                  "USD",
                  {
                    period: 21600,
                    stat: "Maximum",
                  },
                ],
              ],
              region: "us-east-1",
            },
          },
        ],
      },
      DashboardName: "my-dashboard",
    }),
  },
];
```

## Properties

- [PutDashboardCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch/interfaces/putdashboardcommandinput.html)

## Full Examples

- [cloudwatch-dashboard](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatch/cloudwatch-dashboard)

## List

The dashboard can be filtered with the _CloudWatch::Dashboard_ type:

```sh
gc l -t CloudWatch::Dashboard
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatch::Dashboard from aws                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ name: my-dashboard                                                      │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   DashboardArn: arn:aws:cloudwatch::840541460064:dashboard/my-dashboard │
│   DashboardBody:                                                        │
│     widgets:                                                            │
│       - type: metric                                                    │
│         x: 0                                                            │
│         y: 15                                                           │
│         width: 6                                                        │
│         height: 6                                                       │
│         properties:                                                     │
│           view: timeSeries                                              │
│           stacked: false                                                │
│           metrics:                                                      │
│             -                                                           │
│               - "AWS/Billing"                                           │
│               - "EstimatedCharges"                                      │
│               - "Currency"                                              │
│               - "USD"                                                   │
│               - period: 21600                                           │
│                 stat: Maximum                                           │
│           region: us-east-1                                             │
│   DashboardName: my-dashboard                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├───────────────────────┬────────────────────────────────────────────────┤
│ CloudWatch::Dashboard │ my-dashboard                                   │
└───────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatch::Dashboard" executed in 3s, 101 MB
```
