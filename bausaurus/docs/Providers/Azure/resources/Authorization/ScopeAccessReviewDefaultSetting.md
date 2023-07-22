---
id: ScopeAccessReviewDefaultSetting
title: ScopeAccessReviewDefaultSetting
---
Provides a **ScopeAccessReviewDefaultSetting** from the **Authorization** group
## Examples
### GetAccessReviewDefaultSettings
```js
exports.createResources = () => [
  {
    type: "ScopeAccessReviewDefaultSetting",
    group: "Authorization",
    name: "myScopeAccessReviewDefaultSetting",
  },
];

```
## Dependencies

## Swagger Schema
```js
{
  type: 'object',
  properties: {
    mailNotificationsEnabled: {
      type: 'boolean',
      description: 'Flag to indicate whether sending mails to reviewers and the review creator is enabled.'
    },
    reminderNotificationsEnabled: {
      type: 'boolean',
      description: 'Flag to indicate whether sending reminder emails to reviewers are enabled.'
    },
    defaultDecisionEnabled: {
      type: 'boolean',
      description: 'Flag to indicate whether reviewers are required to provide a justification when reviewing access.'
    },
    justificationRequiredOnApproval: {
      type: 'boolean',
      description: 'Flag to indicate whether the reviewer is required to pass justification when recording a decision.'
    },
    defaultDecision: {
      type: 'string',
      description: 'This specifies the behavior for the autoReview feature when an access review completes.',
      enum: [ 'Approve', 'Deny', 'Recommendation' ],
      'x-ms-enum': { name: 'DefaultDecisionType', modelAsString: true }
    },
    autoApplyDecisionsEnabled: {
      type: 'boolean',
      description: 'Flag to indicate whether auto-apply capability, to automatically change the target object access resource, is enabled. If not enabled, a user must, after the review completes, apply the access review.'
    },
    recommendationsEnabled: {
      type: 'boolean',
      description: 'Flag to indicate whether showing recommendations to reviewers is enabled.'
    },
    recommendationLookBackDuration: {
      type: 'string',
      format: 'duration',
      description: 'Recommendations for access reviews are calculated by looking back at 30 days of data(w.r.t the start date of the review) by default. However, in some scenarios, customers want to change how far back to look at and want to configure 60 days, 90 days, etc. instead. This setting allows customers to configure this duration. The value should be in ISO  8601 format (http://en.wikipedia.org/wiki/ISO_8601#Durations).This code can be used to convert TimeSpan to a valid interval string: XmlConvert.ToString(new TimeSpan(hours, minutes, seconds))'
    },
    instanceDurationInDays: {
      type: 'integer',
      format: 'int32',
      description: 'The duration in days for an instance.'
    },
    recurrence: {
      'x-ms-client-flatten': true,
      description: 'Access Review Settings.',
      type: 'object',
      properties: {
        pattern: {
          'x-ms-client-flatten': true,
          description: 'Access Review schedule definition recurrence pattern.',
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'The recurrence type : weekly, monthly, etc.',
              enum: [ 'weekly', 'absoluteMonthly' ],
              'x-ms-enum': {
                name: 'AccessReviewRecurrencePatternType',
                modelAsString: true
              }
            },
            interval: {
              type: 'integer',
              format: 'int32',
              description: 'The interval for recurrence. For a quarterly review, the interval is 3 for type : absoluteMonthly.'
            }
          }
        },
        range: {
          'x-ms-client-flatten': true,
          description: 'Access Review schedule definition recurrence range.',
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'The recurrence range type. The possible values are: endDate, noEnd, numbered.',
              enum: [ 'endDate', 'noEnd', 'numbered' ],
              'x-ms-enum': {
                name: 'AccessReviewRecurrenceRangeType',
                modelAsString: true
              }
            },
            numberOfOccurrences: {
              type: 'integer',
              format: 'int32',
              description: 'The number of times to repeat the access review. Required and must be positive if type is numbered.'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'The DateTime when the review is scheduled to be start. This could be a date in the future. Required on create.',
              'x-nullable': true
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'The DateTime when the review is scheduled to end. Required if type is endDate',
              'x-nullable': true
            }
          }
        }
      }
    }
  },
  description: 'Settings of an Access Review.'
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/authorization/resource-manager/Microsoft.Authorization/preview/2021-12-01-preview/authorization-AccessReviewCalls.json).
