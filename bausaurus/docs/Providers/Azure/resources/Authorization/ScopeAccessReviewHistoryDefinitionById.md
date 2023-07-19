---
id: ScopeAccessReviewHistoryDefinitionById
title: ScopeAccessReviewHistoryDefinitionById
---
Provides a **ScopeAccessReviewHistoryDefinitionById** from the **Authorization** group
## Examples
### PutAccessReviewHistoryDefinition
```js
exports.createResources = () => [
  {
    type: "ScopeAccessReviewHistoryDefinitionById",
    group: "Authorization",
    name: "myScopeAccessReviewHistoryDefinitionById",
    dependencies: ({}) => ({ roleDefinition: ["myRoleDefinition"] }),
  },
];

```
## Dependencies
- [RoleDefinition](../Authorization/RoleDefinition.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    displayName: {
      type: 'string',
      description: 'The display name for the history definition.'
    },
    reviewHistoryPeriodStartDateTime: {
      type: 'string',
      format: 'date-time',
      description: 'Date time used when selecting review data, all reviews included in data start on or after this date. For use only with one-time/non-recurring reports.',
      'x-nullable': true,
      readOnly: true
    },
    reviewHistoryPeriodEndDateTime: {
      type: 'string',
      format: 'date-time',
      description: 'Date time used when selecting review data, all reviews included in data end on or before this date. For use only with one-time/non-recurring reports.',
      'x-nullable': true,
      readOnly: true
    },
    decisions: {
      type: 'array',
      items: {
        type: 'string',
        description: "Represents a reviewer's decision for a given review",
        enum: [ 'Approve', 'Deny', 'NotReviewed', 'DontKnow', 'NotNotified' ],
        'x-ms-enum': { name: 'AccessReviewResult', modelAsString: true }
      },
      description: 'Collection of review decisions which the history data should be filtered on. For example if Approve and Deny are supplied the data will only contain review results in which the decision maker approved or denied a review request.',
      'x-nullable': true
    },
    status: {
      type: 'string',
      readOnly: true,
      description: 'This read-only field specifies the of the requested review history data. This is either requested, in-progress, done or error.',
      enum: [ 'Requested', 'InProgress', 'Done', 'Error' ],
      'x-ms-enum': {
        name: 'AccessReviewHistoryDefinitionStatus',
        modelAsString: true
      }
    },
    createdDateTime: {
      type: 'string',
      format: 'date-time',
      description: 'Date time when history definition was created',
      'x-nullable': true,
      readOnly: true
    },
    createdBy: {
      'x-nullable': true,
      readOnly: true,
      'x-ms-client-flatten': true,
      description: 'The user or other identity who created this history definition.',
      type: 'object',
      properties: {
        principalId: {
          type: 'string',
          readOnly: true,
          description: 'The identity id'
        },
        principalType: {
          type: 'string',
          readOnly: true,
          description: 'The identity type : user/servicePrincipal',
          enum: [ 'user', 'servicePrincipal' ],
          'x-ms-enum': {
            name: 'AccessReviewActorIdentityType',
            modelAsString: true
          }
        },
        principalName: {
          type: 'string',
          readOnly: true,
          description: 'The identity display name'
        },
        userPrincipalName: {
          type: 'string',
          readOnly: true,
          description: 'The user principal name(if valid)'
        }
      }
    },
    scopes: {
      'x-nullable': false,
      type: 'array',
      items: {
        type: 'object',
        properties: {
          resourceId: {
            type: 'string',
            readOnly: true,
            description: 'ResourceId in which this review is getting created'
          },
          roleDefinitionId: {
            type: 'string',
            readOnly: true,
            description: 'This is used to indicate the role being reviewed'
          },
          principalType: {
            type: 'string',
            readOnly: true,
            description: 'The identity type user/servicePrincipal to review',
            enum: [
              'user',
              'guestUser',
              'servicePrincipal',
              'user,group',
              'redeemedGuestUser'
            ],
            'x-ms-enum': {
              name: 'AccessReviewScopePrincipalType',
              modelAsString: true
            }
          },
          assignmentState: {
            type: 'string',
            readOnly: true,
            description: 'The role assignment state eligible/active to review',
            enum: [ 'eligible', 'active' ],
            'x-ms-enum': {
              name: 'AccessReviewScopeAssignmentState',
              modelAsString: true
            }
          },
          inactiveDuration: {
            type: 'string',
            format: 'duration',
            description: 'Duration users are inactive for. The value should be in ISO  8601 format (http://en.wikipedia.org/wiki/ISO_8601#Durations).This code can be used to convert TimeSpan to a valid interval string: XmlConvert.ToString(new TimeSpan(hours, minutes, seconds))'
          },
          expandNestedMemberships: {
            type: 'boolean',
            description: 'Flag to indicate whether to expand nested memberships or not.'
          },
          includeInheritedAccess: {
            type: 'boolean',
            description: 'Flag to indicate whether to expand nested memberships or not.'
          },
          includeAccessBelowResource: {
            type: 'boolean',
            description: 'Flag to indicate whether to expand nested memberships or not.'
          },
          excludeResourceId: {
            type: 'string',
            description: 'This is used to indicate the resource id(s) to exclude'
          },
          excludeRoleDefinitionId: {
            type: 'string',
            description: 'This is used to indicate the role definition id(s) to exclude'
          }
        },
        description: 'Descriptor for what needs to be reviewed'
      },
      description: 'A collection of scopes used when selecting review history data',
      'x-ms-identifiers': []
    },
    settings: {
      'x-ms-client-flatten': true,
      'x-nullable': true,
      description: 'Recurrence settings for recurring history reports, skip for one-time reports.',
      type: 'object',
      properties: {
        pattern: {
          'x-ms-client-flatten': true,
          description: 'Access Review History Definition recurrence settings.',
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
          description: 'Access Review History Definition recurrence settings.',
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
    },
    instances: {
      type: 'array',
      items: {
        'x-ms-azure-resource': true,
        type: 'object',
        properties: {
          id: {
            type: 'string',
            readOnly: true,
            description: 'The access review history definition instance id.'
          },
          name: {
            type: 'string',
            readOnly: true,
            description: 'The access review history definition instance unique id.'
          },
          type: {
            type: 'string',
            readOnly: true,
            description: 'The resource type.'
          },
          properties: {
            'x-ms-client-flatten': true,
            description: 'Access Review History Definition Instance properties.',
            type: 'object',
            properties: {
              reviewHistoryPeriodStartDateTime: {
                type: 'string',
                format: 'date-time',
                readOnly: false,
                description: 'Date time used when selecting review data, all reviews included in data start on or after this date. For use only with one-time/non-recurring reports.'
              },
              reviewHistoryPeriodEndDateTime: {
                type: 'string',
                format: 'date-time',
                readOnly: false,
                description: 'Date time used when selecting review data, all reviews included in data end on or before this date. For use only with one-time/non-recurring reports.'
              },
              displayName: {
                type: 'string',
                description: 'The display name for the parent history definition.'
              },
              status: {
                type: 'string',
                readOnly: true,
                description: 'Status of the requested review history instance data. This is either requested, in-progress, done or error. The state transitions are as follows - Requested -> InProgress -> Done -> Expired',
                enum: [ 'Requested', 'InProgress', 'Done', 'Error' ],
                'x-ms-enum': {
                  name: 'AccessReviewHistoryDefinitionStatus',
                  modelAsString: true
                }
              },
              runDateTime: {
                type: 'string',
                format: 'date-time',
                description: 'Date time when the history data report is scheduled to be generated.',
                'x-nullable': true
              },
              fulfilledDateTime: {
                type: 'string',
                format: 'date-time',
                description: 'Date time when the history data report is scheduled to be generated.',
                'x-nullable': true
              },
              downloadUri: {
                readOnly: true,
                type: 'string',
                description: "Uri which can be used to retrieve review history data. To generate this Uri, generateDownloadUri() must be called for a specific accessReviewHistoryDefinitionInstance. The link expires after a 24 hour period. Callers can see the expiration date time by looking at the 'se' parameter in the generated uri."
              },
              expiration: {
                type: 'string',
                format: 'date-time',
                description: 'Date time when history data report expires and the associated data is deleted.',
                'x-nullable': true
              }
            }
          }
        },
        description: 'Access Review History Definition Instance.'
      },
      description: 'Set of access review history instances for this history definition.'
    }
  },
  description: 'Access Review History Instances.'
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/authorization/resource-manager/Microsoft.Authorization/preview/2021-12-01-preview/authorization-AccessReviewCalls.json).
