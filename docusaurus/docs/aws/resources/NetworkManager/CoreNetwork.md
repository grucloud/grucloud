---
id: CoreNetwork
title: Core Network
---

Provides a [Core Network](https://us-west-2.console.aws.amazon.com/networkmanager/home#/networks)

```js
exports.createResources = () => [
  {
    type: "CoreNetwork",
    group: "NetworkManager",
    name: "cloudwan-module-without",
    properties: ({}) => ({
      PolicyDocument: {
        "core-network-configuration": {
          "vpn-ecmp-support": false,
          "asn-ranges": ["64512-64554"],
          "edge-locations": [
            {
              location: "us-east-1",
              asn: 64512,
            },
          ],
        },
        "attachment-policies": [
          {
            "rule-number": 1,
            "condition-logic": "or",
            action: {
              "association-method": "constant",
              segment: "shared",
            },
            conditions: [
              {
                type: "tag-value",
                value: "shared",
                key: "segment",
                operator: "equals",
              },
            ],
          },
        ],
        version: "2021.12",
        "segment-actions": [
          {
            mode: "attachment-route",
            segment: "shared",
            action: "share",
            "share-with": "*",
          },
        ],
        segments: [
          {
            name: "shared",
            description: "SegmentForSharedServices",
            "require-attachment-acceptance": true,
          },
        ],
      },
      Description: "Core Network - AWS CloudWAN Module",
    }),
    dependencies: ({}) => ({
      globalNetwork: "cloudwan-module-without",
    }),
  },
];
```

### Examples

- [cloud-wan](https://github.com/grucloud/grucloud/blob/main/examples/aws/NetworkManager/cloud-wan)

### Properties

- [CreateCoreNetworkCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-networkmanager/interfaces/createcorenetworkcommandinput.html)

### Dependencies

- [Global Network](./GlobalNetwork.md)

### Used By

### List

```sh
gc l -t CoreNetwork
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 NetworkManager::CoreNetwork from aws                               │
├──────────────────────────────────────────────────────────────────────┤
│ name: cloudwan-module-without                                        │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   PolicyDocument:                                                    │
│     core-network-configuration:                                      │
│       vpn-ecmp-support: false                                        │
│       asn-ranges:                                                    │
│         - "64512-64555"                                              │
│       edge-locations:                                                │
│         - location: us-east-1                                        │
│           asn: 64512                                                 │
│     attachment-policies:                                             │
│       - rule-number: 1                                               │
│         condition-logic: or                                          │
│         action:                                                      │
│           association-method: constant                               │
│           segment: shared                                            │
│         conditions:                                                  │
│           - type: tag-value                                          │
│             value: shared                                            │
│             key: segment                                             │
│             operator: equals                                         │
│     version: 2021.12                                                 │
│     segment-actions:                                                 │
│       - mode: attachment-route                                       │
│         segment: shared                                              │
│         action: share                                                │
│         share-with: *                                                │
│     segments:                                                        │
│       - name: shared                                                 │
│         description: SegmentForSharedServices                        │
│         require-attachment-acceptance: true                          │
│   PolicyVersionId: 1                                                 │
│   CoreNetworkArn: arn:aws:networkmanager::840541460064:core-network… │
│   CoreNetworkId: core-network-00cd4a498078fd80c                      │
│   CreatedAt: 2022-07-01T21:04:54.000Z                                │
│   Description: Core Network - AWS CloudWAN Module                    │
│   Edges:                                                             │
│     - Asn: 64512                                                     │
│       EdgeLocation: us-east-1                                        │
│       InsideCidrBlocks: []                                           │
│   GlobalNetworkId: global-network-0edaf3ada7cafe3cc                  │
│   Segments:                                                          │
│     - EdgeLocations:                                                 │
│         - "us-east-1"                                                │
│       Name: shared                                                   │
│       SharedSegments: []                                             │
│   State: AVAILABLE                                                   │
│   Tags:                                                              │
│     - Key: gc-created-by-provider                                    │
│       Value: aws                                                     │
│     - Key: gc-managed-by                                             │
│       Value: grucloud                                                │
│     - Key: gc-project-name                                           │
│       Value: cloud-wan                                               │
│     - Key: gc-stage                                                  │
│       Value: dev                                                     │
│     - Key: Name                                                      │
│       Value: cloudwan-module-without                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├─────────────────────────────┬───────────────────────────────────────┤
│ NetworkManager::CoreNetwork │ cloudwan-module-without               │
└─────────────────────────────┴───────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CoreNetwork" executed in 8s, 114 MB
```
