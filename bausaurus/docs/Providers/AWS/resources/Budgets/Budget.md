---
id: Budget
title: Budget
---

Manages an [AWS Budget](https://console.aws.amazon.com/billing/home?&skipRegion=true#/budgets/overview).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Budget",
    group: "Budgets",
    properties: ({}) => ({
      BudgetLimit: {
        Amount: "15.0",
        Unit: "USD",
      },
      BudgetName: "budget",
      BudgetType: "COST",
      CostTypes: {
        IncludeCredit: false,
        IncludeDiscount: true,
        IncludeOtherSubscription: true,
        IncludeRecurring: true,
        IncludeRefund: false,
        IncludeSubscription: true,
        IncludeSupport: true,
        IncludeTax: true,
        IncludeUpfront: true,
        UseAmortized: false,
        UseBlended: false,
      },
      TimePeriod: {
        End: "2087-06-15T00:00:00.000Z",
        Start: "2020-05-01T00:00:00.000Z",
      },
      TimeUnit: "MONTHLY",
    }),
  },
];
```

## Properties

- [CreateBudgetCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-budgets/interfaces/createbudgetcommandinput.html)

## Dependencies

- [SNS Topic](../SNS/Topic.md)

## Used By

## Full Examples

- [budget simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Budgets/budget-simple)

## List

```sh
gc l -t Budgets::Budget
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 Budgets::Budget from aws                                               │
├──────────────────────────────────────────────────────────────────────────┤
│ name: budget                                                             │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   BudgetLimit:                                                           │
│     Amount: 15.0                                                         │
│     Unit: USD                                                            │
│   BudgetName: budget                                                     │
│   BudgetType: COST                                                       │
│   CalculatedSpend:                                                       │
│     ActualSpend:                                                         │
│       Amount: 31.6                                                       │
│       Unit: USD                                                          │
│     ForecastedSpend:                                                     │
│       Amount: 43.021                                                     │
│       Unit: USD                                                          │
│   CostFilters:                                                           │
│   CostTypes:                                                             │
│     IncludeCredit: false                                                 │
│     IncludeDiscount: true                                                │
│     IncludeOtherSubscription: true                                       │
│     IncludeRecurring: true                                               │
│     IncludeRefund: false                                                 │
│     IncludeSubscription: true                                            │
│     IncludeSupport: true                                                 │
│     IncludeTax: true                                                     │
│     IncludeUpfront: true                                                 │
│     UseAmortized: false                                                  │
│     UseBlended: false                                                    │
│   LastUpdatedTime: 2022-11-06T06:42:05.001Z                              │
│   TimePeriod:                                                            │
│     End: 2087-06-15T00:00:00.000Z                                        │
│     Start: 2020-05-01T00:00:00.000Z                                      │
│   TimeUnit: MONTHLY                                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├─────────────────┬───────────────────────────────────────────────────────┤
│ Budgets::Budget │ budget                                                │
└─────────────────┴───────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Budgets::Budget" executed in 3s, 106 MB
```
