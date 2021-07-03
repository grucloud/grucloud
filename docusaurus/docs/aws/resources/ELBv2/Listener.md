---
id: AwsListener
title: Listener
---

Manage an [ELB Listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html).

## Example

### Http listener

```js
const vpc = provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const listenerHttp = provider.elb.makeListener({
  name: config.elb.listeners.http.name,
  dependencies: {
    loadBalancer,
    targetGroups: [targetGroups.web],
  },
  properties: ({
    dependencies: {
      targetGroups: [targetGroup],
    },
  }) => ({
    Port: 80,
    Protocol: "HTTP",
    DefaultActions: [
      {
        TargetGroupArn: targetGroup?.live?.TargetGroupArn,
        Type: "forward",
      },
    ],
  }),
});
```

## Properties

The list of properties are the parameter of [createTargetGroup](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property)

## Source Code

- [Load Balancer Module](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/load-balancer/iac.js)

## Dependencies

- [LoadBalancer](./LoadBalancer.md)
- [TargetGroup](./TargetGroup.md)

## List

```sh
gc l -t Listener
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 5/5
✓ k8s
  ✓ Initialising
  ✓ Listing
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 2 Listener from aws                                                              │
├────────────────┬──────────────────────────────────────────────────────────┬──────┤
│ Name           │ Data                                                     │ Our  │
├────────────────┼──────────────────────────────────────────────────────────┼──────┤
│ listener-http  │ ListenerArn: arn:aws:elasticloadbalancing:eu-west-2:840… │ Yes  │
│                │ LoadBalancerArn: arn:aws:elasticloadbalancing:eu-west-2… │      │
│                │ Port: 80                                                 │      │
│                │ Protocol: HTTP                                           │      │
│                │ Certificates: []                                         │      │
│                │ DefaultActions:                                          │      │
│                │   - Type: forward                                        │      │
│                │     TargetGroupArn: arn:aws:elasticloadbalancing:eu-wes… │      │
│                │     ForwardConfig:                                       │      │
│                │       TargetGroups:                                      │      │
│                │         - TargetGroupArn: arn:aws:elasticloadbalancing:… │      │
│                │           Weight: 1                                      │      │
│                │       TargetGroupStickinessConfig:                       │      │
│                │         Enabled: false                                   │      │
│                │ AlpnPolicy: []                                           │      │
│                │ Tags:                                                    │      │
│                │   - Key: ManagedBy                                       │      │
│                │     Value: GruCloud                                      │      │
│                │   - Key: stage                                           │      │
│                │     Value: dev                                           │      │
│                │   - Key: projectName                                     │      │
│                │     Value: starhackit                                    │      │
│                │   - Key: CreatedByProvider                               │      │
│                │     Value: aws                                           │      │
│                │   - Key: Name                                            │      │
│                │     Value: listener-http                                 │      │
│                │                                                          │      │
├────────────────┼──────────────────────────────────────────────────────────┼──────┤
│ listener-https │ ListenerArn: arn:aws:elasticloadbalancing:eu-west-2:840… │ Yes  │
│                │ LoadBalancerArn: arn:aws:elasticloadbalancing:eu-west-2… │      │
│                │ Port: 443                                                │      │
│                │ Protocol: HTTPS                                          │      │
│                │ Certificates:                                            │      │
│                │   - CertificateArn: arn:aws:acm:eu-west-2:840541460064:… │      │
│                │ SslPolicy: ELBSecurityPolicy-2016-08                     │      │
│                │ DefaultActions:                                          │      │
│                │   - Type: forward                                        │      │
│                │     TargetGroupArn: arn:aws:elasticloadbalancing:eu-wes… │      │
│                │     ForwardConfig:                                       │      │
│                │       TargetGroups:                                      │      │
│                │         - TargetGroupArn: arn:aws:elasticloadbalancing:… │      │
│                │           Weight: 1                                      │      │
│                │       TargetGroupStickinessConfig:                       │      │
│                │         Enabled: false                                   │      │
│                │ AlpnPolicy: []                                           │      │
│                │ Tags:                                                    │      │
│                │   - Key: ManagedBy                                       │      │
│                │     Value: GruCloud                                      │      │
│                │   - Key: stage                                           │      │
│                │     Value: dev                                           │      │
│                │   - Key: projectName                                     │      │
│                │     Value: starhackit                                    │      │
│                │   - Key: CreatedByProvider                               │      │
│                │     Value: aws                                           │      │
│                │   - Key: Name                                            │      │
│                │     Value: listener-https                                │      │
│                │                                                          │      │
└────────────────┴──────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├────────────────────┬────────────────────────────────────────────────────────────┤
│ Listener           │ listener-http                                              │
│                    │ listener-https                                             │
└────────────────────┴────────────────────────────────────────────────────────────┘
2 resources, 1 type, 2 providers
Command "gc l -t Listener" executed in 10s
```
