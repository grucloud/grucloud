---
id: Domain
title: Domain
---
Provides a **Domain** from the **DomainRegistration** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  description: 'Information about a domain.',
  type: 'object',
  allOf: [
    {
      description: 'Azure resource. This resource is tracked in Azure Resource Manager',
      required: [ 'location' ],
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        location: { description: 'Resource Location.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        },
        tags: {
          description: 'Resource tags.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Domain resource specific properties',
      required: [
        'contactAdmin',
        'contactBilling',
        'contactRegistrant',
        'contactTech',
        'consent'
      ],
      type: 'object',
      properties: {
        contactAdmin: {
          description: 'Administrative contact.',
          'x-ms-mutability': [ 'create' ],
          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],
          type: 'object',
          properties: {
            addressMailing: {
              description: 'Mailing address.',
              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],
              type: 'object',
              properties: {
                address1: {
                  description: 'First line of an Address.',
                  type: 'string'
                },
                address2: {
                  description: 'The second line of the Address. Optional.',
                  type: 'string'
                },
                city: {
                  description: 'The city for the address.',
                  type: 'string'
                },
                country: {
                  description: 'The country for the address.',
                  type: 'string'
                },
                postalCode: {
                  description: 'The postal code for the address.',
                  type: 'string'
                },
                state: {
                  description: 'The state or province for the address.',
                  type: 'string'
                }
              }
            },
            email: { description: 'Email address.', type: 'string' },
            fax: { description: 'Fax number.', type: 'string' },
            jobTitle: { description: 'Job title.', type: 'string' },
            nameFirst: { description: 'First name.', type: 'string' },
            nameLast: { description: 'Last name.', type: 'string' },
            nameMiddle: { description: 'Middle name.', type: 'string' },
            organization: {
              description: 'Organization contact belongs to.',
              type: 'string'
            },
            phone: { description: 'Phone number.', type: 'string' }
          }
        },
        contactBilling: {
          description: 'Billing contact.',
          'x-ms-mutability': [ 'create' ],
          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],
          type: 'object',
          properties: {
            addressMailing: {
              description: 'Mailing address.',
              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],
              type: 'object',
              properties: {
                address1: {
                  description: 'First line of an Address.',
                  type: 'string'
                },
                address2: {
                  description: 'The second line of the Address. Optional.',
                  type: 'string'
                },
                city: {
                  description: 'The city for the address.',
                  type: 'string'
                },
                country: {
                  description: 'The country for the address.',
                  type: 'string'
                },
                postalCode: {
                  description: 'The postal code for the address.',
                  type: 'string'
                },
                state: {
                  description: 'The state or province for the address.',
                  type: 'string'
                }
              }
            },
            email: { description: 'Email address.', type: 'string' },
            fax: { description: 'Fax number.', type: 'string' },
            jobTitle: { description: 'Job title.', type: 'string' },
            nameFirst: { description: 'First name.', type: 'string' },
            nameLast: { description: 'Last name.', type: 'string' },
            nameMiddle: { description: 'Middle name.', type: 'string' },
            organization: {
              description: 'Organization contact belongs to.',
              type: 'string'
            },
            phone: { description: 'Phone number.', type: 'string' }
          }
        },
        contactRegistrant: {
          description: 'Registrant contact.',
          'x-ms-mutability': [ 'create' ],
          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],
          type: 'object',
          properties: {
            addressMailing: {
              description: 'Mailing address.',
              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],
              type: 'object',
              properties: {
                address1: {
                  description: 'First line of an Address.',
                  type: 'string'
                },
                address2: {
                  description: 'The second line of the Address. Optional.',
                  type: 'string'
                },
                city: {
                  description: 'The city for the address.',
                  type: 'string'
                },
                country: {
                  description: 'The country for the address.',
                  type: 'string'
                },
                postalCode: {
                  description: 'The postal code for the address.',
                  type: 'string'
                },
                state: {
                  description: 'The state or province for the address.',
                  type: 'string'
                }
              }
            },
            email: { description: 'Email address.', type: 'string' },
            fax: { description: 'Fax number.', type: 'string' },
            jobTitle: { description: 'Job title.', type: 'string' },
            nameFirst: { description: 'First name.', type: 'string' },
            nameLast: { description: 'Last name.', type: 'string' },
            nameMiddle: { description: 'Middle name.', type: 'string' },
            organization: {
              description: 'Organization contact belongs to.',
              type: 'string'
            },
            phone: { description: 'Phone number.', type: 'string' }
          }
        },
        contactTech: {
          description: 'Technical contact.',
          'x-ms-mutability': [ 'create' ],
          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],
          type: 'object',
          properties: {
            addressMailing: {
              description: 'Mailing address.',
              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],
              type: 'object',
              properties: {
                address1: {
                  description: 'First line of an Address.',
                  type: 'string'
                },
                address2: {
                  description: 'The second line of the Address. Optional.',
                  type: 'string'
                },
                city: {
                  description: 'The city for the address.',
                  type: 'string'
                },
                country: {
                  description: 'The country for the address.',
                  type: 'string'
                },
                postalCode: {
                  description: 'The postal code for the address.',
                  type: 'string'
                },
                state: {
                  description: 'The state or province for the address.',
                  type: 'string'
                }
              }
            },
            email: { description: 'Email address.', type: 'string' },
            fax: { description: 'Fax number.', type: 'string' },
            jobTitle: { description: 'Job title.', type: 'string' },
            nameFirst: { description: 'First name.', type: 'string' },
            nameLast: { description: 'Last name.', type: 'string' },
            nameMiddle: { description: 'Middle name.', type: 'string' },
            organization: {
              description: 'Organization contact belongs to.',
              type: 'string'
            },
            phone: { description: 'Phone number.', type: 'string' }
          }
        },
        registrationStatus: {
          description: 'Domain registration status.',
          enum: [
            'Active',              'Awaiting',
            'Cancelled',           'Confiscated',
            'Disabled',            'Excluded',
            'Expired',             'Failed',
            'Held',                'Locked',
            'Parked',              'Pending',
            'Reserved',            'Reverted',
            'Suspended',           'Transferred',
            'Unknown',             'Unlocked',
            'Unparked',            'Updated',
            'JsonConverterFailed'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'DomainStatus', modelAsString: false }
        },
        provisioningState: {
          description: 'Domain provisioning state.',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'InProgress',
            'Deleting'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }
        },
        nameServers: {
          description: 'Name servers.',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        },
        privacy: {
          description: '<code>true</code> if domain privacy is enabled for this domain; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        createdTime: {
          format: 'date-time',
          description: 'Domain creation timestamp.',
          type: 'string',
          readOnly: true
        },
        expirationTime: {
          format: 'date-time',
          description: 'Domain expiration timestamp.',
          type: 'string',
          readOnly: true
        },
        lastRenewedTime: {
          format: 'date-time',
          description: 'Timestamp when the domain was renewed last time.',
          type: 'string',
          readOnly: true
        },
        autoRenew: {
          description: '<code>true</code> if the domain should be automatically renewed; otherwise, <code>false</code>.',
          default: true,
          type: 'boolean'
        },
        readyForDnsRecordManagement: {
          description: '<code>true</code> if Azure can assign this domain to App Service apps; otherwise, <code>false</code>. This value will be <code>true</code> if domain registration status is active and \n' +
            ' it is hosted on name servers Azure has programmatic access to.',
          type: 'boolean',
          readOnly: true
        },
        managedHostNames: {
          description: 'All hostnames derived from the domain and assigned to Azure resources.',
          type: 'array',
          items: {
            description: 'Details of a hostname derived from a domain.',
            type: 'object',
            properties: {
              name: { description: 'Name of the hostname.', type: 'string' },
              siteNames: {
                description: 'List of apps the hostname is assigned to. This list will have more than one app only if the hostname is pointing to a Traffic Manager.',
                type: 'array',
                items: { type: 'string' }
              },
              azureResourceName: {
                description: 'Name of the Azure resource the hostname is assigned to. If it is assigned to a Traffic Manager then it will be the Traffic Manager name otherwise it will be the app name.',
                type: 'string'
              },
              azureResourceType: {
                description: 'Type of the Azure resource the hostname is assigned to.',
                enum: [ 'Website', 'TrafficManager' ],
                type: 'string',
                'x-ms-enum': { name: 'AzureResourceType', modelAsString: false }
              },
              customHostNameDnsRecordType: {
                description: 'Type of the DNS record.',
                enum: [ 'CName', 'A' ],
                type: 'string',
                'x-ms-enum': {
                  name: 'CustomHostNameDnsRecordType',
                  modelAsString: false
                }
              },
              hostNameType: {
                description: 'Type of the hostname.',
                enum: [ 'Verified', 'Managed' ],
                type: 'string',
                'x-ms-enum': { name: 'HostNameType', modelAsString: false }
              }
            }
          },
          readOnly: true
        },
        consent: {
          description: 'Legal agreement consent.',
          'x-ms-mutability': [ 'create' ],
          type: 'object',
          properties: {
            agreementKeys: {
              description: 'List of applicable legal agreement keys. This list can be retrieved using ListLegalAgreements API under <code>TopLevelDomain</code> resource.',
              type: 'array',
              items: { type: 'string' }
            },
            agreedBy: { description: 'Client IP address.', type: 'string' },
            agreedAt: {
              format: 'date-time',
              description: 'Timestamp when the agreements were accepted.',
              type: 'string'
            }
          }
        },
        domainNotRenewableReasons: {
          description: 'Reasons why domain is not renewable.',
          type: 'array',
          items: {
            enum: [
              'RegistrationStatusNotSupportedForRenewal',
              'ExpirationNotInRenewalTimeRange',
              'SubscriptionNotActive'
            ],
            type: 'string'
          },
          readOnly: true
        },
        dnsType: {
          description: 'Current DNS type',
          enum: [ 'AzureDns', 'DefaultDomainRegistrarDns' ],
          type: 'string',
          'x-ms-enum': { name: 'DnsType', modelAsString: false }
        },
        dnsZoneId: { description: 'Azure DNS Zone to use', type: 'string' },
        targetDnsType: {
          description: 'Target DNS type (would be used for migration)',
          enum: [ 'AzureDns', 'DefaultDomainRegistrarDns' ],
          type: 'string',
          'x-ms-enum': { name: 'DnsType', modelAsString: false }
        },
        authCode: { type: 'string', 'x-ms-mutability': [ 'create', 'read' ] }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.DomainRegistration/stable/2021-03-01/Domains.json).
