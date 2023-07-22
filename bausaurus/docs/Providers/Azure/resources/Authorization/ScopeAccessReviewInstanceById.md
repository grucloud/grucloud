---
id: ScopeAccessReviewInstanceById
title: ScopeAccessReviewInstanceById
---
Provides a **ScopeAccessReviewInstanceById** from the **Authorization** group
## Examples
### GetAccessReviews
```js
exports.createResources = () => [
  {
    type: "ScopeAccessReviewInstanceById",
    group: "Authorization",
    name: "myScopeAccessReviewInstanceById",
    dependencies: ({}) => ({
      scheduleDefinitionId: "myScopeAccessReviewScheduleDefinitionById",
    }),
  },
];

```
## Dependencies
- [ScopeAccessReviewScheduleDefinitionById](../Authorization/ScopeAccessReviewScheduleDefinitionById.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    status: {
      type: 'string',
      readOnly: true,
      description: 'This read-only field specifies the status of an access review instance.',
      enum: [
        'NotStarted',    'InProgress',
        'Completed',     'Applied',
        'Initializing',  'Applying',
        'Completing',    'Scheduled',
        'AutoReviewing', 'AutoReviewed',
        'Starting'
      ],
      'x-ms-enum': { name: 'AccessReviewInstanceStatus', modelAsString: true }
    },
    startDateTime: {
      type: 'string',
      format: 'date-time',
      description: 'The DateTime when the review instance is scheduled to be start.',
      'x-nullable': false
    },
    endDateTime: {
      type: 'string',
      format: 'date-time',
      description: 'The DateTime when the review instance is scheduled to end.',
      'x-nullable': false
    },
    reviewers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          principalId: {
            type: 'string',
            description: 'The id of the reviewer(user/servicePrincipal)'
          },
          principalType: {
            type: 'string',
            readOnly: true,
            description: 'The identity type : user/servicePrincipal',
            enum: [ 'user', 'servicePrincipal' ],
            'x-ms-enum': { name: 'AccessReviewReviewerType', modelAsString: true }
          }
        },
        description: 'Descriptor for what needs to be reviewed'
      },
      'x-ms-identifiers': [ 'principalId' ],
      description: 'This is the collection of reviewers.'
    },
    backupReviewers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          principalId: {
            type: 'string',
            description: 'The id of the reviewer(user/servicePrincipal)'
          },
          principalType: {
            type: 'string',
            readOnly: true,
            description: 'The identity type : user/servicePrincipal',
            enum: [ 'user', 'servicePrincipal' ],
            'x-ms-enum': { name: 'AccessReviewReviewerType', modelAsString: true }
          }
        },
        description: 'Descriptor for what needs to be reviewed'
      },
      'x-ms-identifiers': [ 'principalId' ],
      description: 'This is the collection of backup reviewers.'
    },
    reviewersType: {
      type: 'string',
      readOnly: true,
      description: 'This field specifies the type of reviewers for a review. Usually for a review, reviewers are explicitly assigned. However, in some cases, the reviewers may not be assigned and instead be chosen dynamically. For example managers review or self review.',
      enum: [ 'Assigned', 'Self', 'Managers' ],
      'x-ms-enum': {
        name: 'AccessReviewInstanceReviewersType',
        modelAsString: true
      }
    }
  },
  description: 'Access Review Instance properties.'
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/authorization/resource-manager/Microsoft.Authorization/preview/2021-12-01-preview/authorization-AccessReviewCalls.json).
