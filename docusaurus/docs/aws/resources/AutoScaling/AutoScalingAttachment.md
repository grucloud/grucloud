---
id: AutoScalingAttachment
title: AutoScaling Attachment
---

Attach a TargetGroup to an AutoScalingGroup.

## Sample code

```js
provider.AutoScaling.makeAutoScalingAttachment({
  dependencies: () => ({
    autoScalingGroup: "asg-ng-1",
    targetGroup: "target-group-rest",
  }),
});
```

## Dependencies

- [AutoScalingGroup](./AutoScalingGroup.md)
- [TargetGroup](../ELBv2/TargetGroup.md)

  ## Full Examples

- [AutoScalingGroup attached to a load balancer](https://github.com/grucloud/grucloud/tree/main/examples/aws/ELBv2/load-balancer)

## List

The autoscaling attachments can be filtered with the _AutoScalingAttachment_ type:

```sh
gc l -t AutoScalingAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 16/16
┌────────────────────────────────────────────────────────────────────────────────┐
│ 2 AutoScaling::AutoScalingAttachment from aws                                  │
├────────────────────────────────────────────────────────────────────────────────┤
│ name: autoscaling-attachment::ag::target-group-rest                            │
│ managedByUs: Yes                                                               │
│ live:                                                                          │
│   TargetGroupARN: arn:aws:elasticloadbalancing:us-east-1:840541460064:targetg… │
│   AutoScalingGroupName: ag                                                     │
│   AutoScalingGroupARN: arn:aws:autoscaling:us-east-1:840541460064:autoScaling… │
│                                                                                │
├────────────────────────────────────────────────────────────────────────────────┤
│ name: autoscaling-attachment::ag::target-group-web                             │
│ managedByUs: Yes                                                               │
│ live:                                                                          │
│   TargetGroupARN: arn:aws:elasticloadbalancing:us-east-1:840541460064:targetg… │
│   AutoScalingGroupName: ag                                                     │
│   AutoScalingGroupARN: arn:aws:autoscaling:us-east-1:840541460064:autoScaling… │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                           │
├────────────────────────────────────┬──────────────────────────────────────────┤
│ AutoScaling::AutoScalingAttachment │ autoscaling-attachment::ag::target-grou… │
│                                    │ autoscaling-attachment::ag::target-grou… │
└────────────────────────────────────┴──────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t AutoScalingAttachment" executed in 6s
```
