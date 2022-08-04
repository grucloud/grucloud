---
id: ScopeAccessReviewScheduleDefinitionById
title: ScopeAccessReviewScheduleDefinitionById
---
Provides a **ScopeAccessReviewScheduleDefinitionById** from the **Authorization** group
## Examples
### PutAccessReview
```js
exports.createResources = () => [
  {
    type: "ScopeAccessReviewScheduleDefinitionById",
    group: "Authorization",
    name: "myScopeAccessReviewScheduleDefinitionById",
  },
];

```
## Dependencies

## Swagger Schema
```js
{
  type: 'object',
  properties: {
    displayName: {
      type: 'string',
      description: 'The display name for the schedule definition.'
    },
    status: {
      type: 'string',
      readOnly: true,
      description: 'This read-only field specifies the status of an accessReview.',
      enum: [
        'NotStarted',    'InProgress',
        'Completed',     'Applied',
        'Initializing',  'Applying',
        'Completing',    'Scheduled',
        'AutoReviewing', 'AutoReviewed',
        'Starting'
      ],
      'x-ms-enum': {
        name: 'AccessReviewScheduleDefinitionStatus',
        modelAsString: true
      }
    },
    descriptionForAdmins: {
      type: 'string',
      description: 'The description provided by the access review creator and visible to admins.'
    },
    descriptionForReviewers: {
      type: 'string',
      description: 'The description provided by the access review creator to be shown to reviewers.'
    },
    createdBy: {
      readOnly: true,
      'x-ms-client-flatten': true,
      description: 'The user or other identity who created this review.',
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
    settings: {
      'x-ms-client-flatten': true,
      description: 'Access Review Settings.',
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
      }
    },
    scope: {
      readOnly: true,
      'x-ms-client-flatten': true,
      description: 'This is used to define what to include in scope of the review. The scope definition includes the resourceId and roleDefinitionId.',
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
      }
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
        name: 'AccessReviewScheduleDefinitionReviewersType',
        modelAsString: true
      }
    },
    instances: {
      type: 'array',
      items: {
        type: 'object',
        'x-ms-azure-resource': true,
        properties: {
          id: {
            type: 'string',
            readOnly: true,
            description: 'The access review instance id.'
          },
          name: {
            type: 'string',
            readOnly: true,
            description: 'The access review instance name.'
          },
          type: {
            type: 'string',
            readOnly: true,
            description: 'The resource type.'
          },
          properties: {
            'x-ms-client-flatten': true,
            description: 'Access Review properties.',
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
                'x-ms-enum': {
                  name: 'AccessReviewInstanceStatus',
                  modelAsString: true
                }
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
                      'x-ms-enum': {
                        name: 'AccessReviewReviewerType',
                        modelAsString: true
                      }
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
                      'x-ms-enum': {
                        name: 'AccessReviewReviewerType',
                        modelAsString: true
                      }
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
            }
          }
        },
        description: 'Access Review Instance.'
      },
      description: 'This is the collection of instances returned when one does an expand on it.'
    }
  },
  description: 'Access Review.'
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/authorization/resource-manager/Microsoft.Authorization/preview/2021-12-01-preview/authorization-AccessReviewCalls.json).
