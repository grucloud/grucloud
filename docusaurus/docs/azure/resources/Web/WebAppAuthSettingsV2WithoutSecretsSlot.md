---
id: WebAppAuthSettingsV2WithoutSecretsSlot
title: WebAppAuthSettingsV2WithoutSecretsSlot
---
Provides a **WebAppAuthSettingsV2WithoutSecretsSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
- [SiteSlot](../Web/SiteSlot.md)
## Swagger Schema
```js
{
  description: 'Configuration settings for the Azure App Service Authentication / Authorization V2 feature.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'SiteAuthSettingsV2 resource specific properties',
      type: 'object',
      properties: {
        platform: {
          description: 'The configuration settings of the platform of App Service Authentication/Authorization.',
          type: 'object',
          properties: {
            enabled: {
              description: '<code>true</code> if the Authentication / Authorization feature is enabled for the current app; otherwise, <code>false</code>.',
              type: 'boolean'
            },
            runtimeVersion: {
              description: 'The RuntimeVersion of the Authentication / Authorization feature in use for the current app.\n' +
                'The setting in this value can control the behavior of certain features in the Authentication / Authorization module.',
              type: 'string'
            },
            configFilePath: {
              description: 'The path of the config file containing auth settings if they come from a file.\n' +
                "If the path is relative, base will the site's root directory.",
              type: 'string'
            }
          }
        },
        globalValidation: {
          description: 'The configuration settings that determines the validation flow of users using App Service Authentication/Authorization.',
          type: 'object',
          properties: {
            requireAuthentication: {
              description: '<code>true</code> if the authentication flow is required any request is made; otherwise, <code>false</code>.',
              type: 'boolean'
            },
            unauthenticatedClientAction: {
              description: 'The action to take when an unauthenticated client attempts to access the app.',
              enum: [
                'RedirectToLoginPage',
                'AllowAnonymous',
                'Return401',
                'Return403'
              ],
              type: 'string',
              'x-ms-enum': {
                name: 'UnauthenticatedClientActionV2',
                modelAsString: false
              }
            },
            redirectToProvider: {
              description: 'The default authentication provider to use when multiple providers are configured.\n' +
                'This setting is only needed if multiple providers are configured and the unauthenticated client\n' +
                'action is set to "RedirectToLoginPage".',
              type: 'string'
            },
            excludedPaths: {
              description: 'The paths for which unauthenticated flow would not be redirected to the login page.',
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        identityProviders: {
          description: 'The configuration settings of each of the identity providers used to configure App Service Authentication/Authorization.',
          type: 'object',
          properties: {
            azureActiveDirectory: {
              description: 'The configuration settings of the Azure Active directory provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the Azure Active Directory provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the Azure Active Directory app registration.',
                  type: 'object',
                  properties: {
                    openIdIssuer: {
                      description: 'The OpenID Connect Issuer URI that represents the entity which issues access tokens for this application.\n' +
                        'When using Azure Active Directory, this value is the URI of the directory tenant, e.g. https://login.microsoftonline.com/v2.0/{tenant-guid}/.\n' +
                        'This URI is a case-sensitive identifier for the token issuer.\n' +
                        'More information on OpenID Connect Discovery: http://openid.net/specs/openid-connect-discovery-1_0.html',
                      type: 'string'
                    },
                    clientId: {
                      description: 'The Client ID of this relying party application, known as the client_id.\n' +
                        'This setting is required for enabling OpenID Connection authentication with Azure Active Directory or \n' +
                        'other 3rd party OpenID Connect providers.\n' +
                        'More information on OpenID Connect: http://openid.net/specs/openid-connect-core-1_0.html',
                      type: 'string'
                    },
                    clientSecretSettingName: {
                      description: 'The app setting name that contains the client secret of the relying party application.',
                      type: 'string'
                    },
                    clientSecretCertificateThumbprint: {
                      description: 'An alternative to the client secret, that is the thumbprint of a certificate used for signing purposes. This property acts as\n' +
                        'a replacement for the Client Secret. It is also optional.',
                      type: 'string'
                    },
                    clientSecretCertificateSubjectAlternativeName: {
                      description: 'An alternative to the client secret thumbprint, that is the subject alternative name of a certificate used for signing purposes. This property acts as\n' +
                        'a replacement for the Client Secret Certificate Thumbprint. It is also optional.',
                      type: 'string'
                    },
                    clientSecretCertificateIssuer: {
                      description: 'An alternative to the client secret thumbprint, that is the issuer of a certificate used for signing purposes. This property acts as\n' +
                        'a replacement for the Client Secret Certificate Thumbprint. It is also optional.',
                      type: 'string'
                    }
                  }
                },
                login: {
                  description: 'The configuration settings of the Azure Active Directory login flow.',
                  type: 'object',
                  properties: {
                    loginParameters: {
                      description: 'Login parameters to send to the OpenID Connect authorization endpoint when\n' +
                        'a user logs in. Each parameter must be in the form "key=value".',
                      type: 'array',
                      items: { type: 'string' }
                    },
                    disableWWWAuthenticate: {
                      description: '<code>true</code> if the www-authenticate provider should be omitted from the request; otherwise, <code>false</code>.',
                      type: 'boolean'
                    }
                  }
                },
                validation: {
                  description: 'The configuration settings of the Azure Active Directory token validation flow.',
                  type: 'object',
                  properties: {
                    jwtClaimChecks: {
                      description: 'The configuration settings of the checks that should be made while validating the JWT Claims.',
                      type: 'object',
                      properties: {
                        allowedGroups: {
                          description: 'The list of the allowed groups.',
                          type: 'array',
                          items: { type: 'string' }
                        },
                        allowedClientApplications: {
                          description: 'The list of the allowed client applications.',
                          type: 'array',
                          items: { type: 'string' }
                        }
                      }
                    },
                    allowedAudiences: {
                      description: 'The list of audiences that can make successful authentication/authorization requests.',
                      type: 'array',
                      items: { type: 'string' }
                    },
                    defaultAuthorizationPolicy: {
                      description: 'The configuration settings of the default authorization policy.',
                      type: 'object',
                      properties: {
                        allowedPrincipals: {
                          description: 'The configuration settings of the Azure Active Directory allowed principals.',
                          type: 'object',
                          properties: {
                            groups: {
                              description: 'The list of the allowed groups.',
                              type: 'array',
                              items: { type: 'string' }
                            },
                            identities: {
                              description: 'The list of the allowed identities.',
                              type: 'array',
                              items: { type: 'string' }
                            }
                          }
                        },
                        allowedApplications: {
                          description: 'The configuration settings of the Azure Active Directory allowed applications.',
                          type: 'array',
                          items: { type: 'string' }
                        }
                      }
                    }
                  }
                },
                isAutoProvisioned: {
                  description: 'Gets a value indicating whether the Azure AD configuration was auto-provisioned using 1st party tooling.\n' +
                    'This is an internal flag primarily intended to support the Azure Management Portal. Users should not\n' +
                    'read or write to this property.',
                  type: 'boolean'
                }
              }
            },
            facebook: {
              description: 'The configuration settings of the Facebook provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the Facebook provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the app registration for the Facebook provider.',
                  type: 'object',
                  properties: {
                    appId: {
                      description: 'The App ID of the app used for login.',
                      type: 'string'
                    },
                    appSecretSettingName: {
                      description: 'The app setting name that contains the app secret.',
                      type: 'string'
                    }
                  }
                },
                graphApiVersion: {
                  description: 'The version of the Facebook api to be used while logging in.',
                  type: 'string'
                },
                login: {
                  description: 'The configuration settings of the login flow.',
                  type: 'object',
                  properties: {
                    scopes: {
                      description: 'A list of the scopes that should be requested while authenticating.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            gitHub: {
              description: 'The configuration settings of the GitHub provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the GitHub provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the app registration for the GitHub provider.',
                  type: 'object',
                  properties: {
                    clientId: {
                      description: 'The Client ID of the app used for login.',
                      type: 'string'
                    },
                    clientSecretSettingName: {
                      description: 'The app setting name that contains the client secret.',
                      type: 'string'
                    }
                  }
                },
                login: {
                  description: 'The configuration settings of the login flow.',
                  type: 'object',
                  properties: {
                    scopes: {
                      description: 'A list of the scopes that should be requested while authenticating.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            google: {
              description: 'The configuration settings of the Google provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the Google provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the app registration for the Google provider.',
                  type: 'object',
                  properties: {
                    clientId: {
                      description: 'The Client ID of the app used for login.',
                      type: 'string'
                    },
                    clientSecretSettingName: {
                      description: 'The app setting name that contains the client secret.',
                      type: 'string'
                    }
                  }
                },
                login: {
                  description: 'The configuration settings of the login flow.',
                  type: 'object',
                  properties: {
                    scopes: {
                      description: 'A list of the scopes that should be requested while authenticating.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                },
                validation: {
                  description: 'The configuration settings of the Azure Active Directory token validation flow.',
                  type: 'object',
                  properties: {
                    allowedAudiences: {
                      description: 'The configuration settings of the allowed list of audiences from which to validate the JWT token.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            legacyMicrosoftAccount: {
              description: 'The configuration settings of the legacy Microsoft Account provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the legacy Microsoft Account provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the app registration for the legacy Microsoft Account provider.',
                  type: 'object',
                  properties: {
                    clientId: {
                      description: 'The Client ID of the app used for login.',
                      type: 'string'
                    },
                    clientSecretSettingName: {
                      description: 'The app setting name that contains the client secret.',
                      type: 'string'
                    }
                  }
                },
                login: {
                  description: 'The configuration settings of the login flow.',
                  type: 'object',
                  properties: {
                    scopes: {
                      description: 'A list of the scopes that should be requested while authenticating.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                },
                validation: {
                  description: 'The configuration settings of the legacy Microsoft Account provider token validation flow.',
                  type: 'object',
                  properties: {
                    allowedAudiences: {
                      description: 'The configuration settings of the allowed list of audiences from which to validate the JWT token.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            twitter: {
              description: 'The configuration settings of the Twitter provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the Twitter provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the app registration for the Twitter provider.',
                  type: 'object',
                  properties: {
                    consumerKey: {
                      description: 'The OAuth 1.0a consumer key of the Twitter application used for sign-in.\n' +
                        'This setting is required for enabling Twitter Sign-In.\n' +
                        'Twitter Sign-In documentation: https://dev.twitter.com/web/sign-in',
                      type: 'string'
                    },
                    consumerSecretSettingName: {
                      description: 'The app setting name that contains the OAuth 1.0a consumer secret of the Twitter\n' +
                        'application used for sign-in.',
                      type: 'string'
                    }
                  }
                }
              }
            },
            apple: {
              description: 'The configuration settings of the Apple provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the Apple provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the Apple registration.',
                  type: 'object',
                  properties: {
                    clientId: {
                      description: 'The Client ID of the app used for login.',
                      type: 'string'
                    },
                    clientSecretSettingName: {
                      description: 'The app setting name that contains the client secret.',
                      type: 'string'
                    }
                  }
                },
                login: {
                  description: 'The configuration settings of the login flow.',
                  type: 'object',
                  properties: {
                    scopes: {
                      description: 'A list of the scopes that should be requested while authenticating.',
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            azureStaticWebApps: {
              description: 'The configuration settings of the Azure Static Web Apps provider.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>false</code> if the Azure Static Web Apps provider should not be enabled despite the set registration; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                registration: {
                  description: 'The configuration settings of the Azure Static Web Apps registration.',
                  type: 'object',
                  properties: {
                    clientId: {
                      description: 'The Client ID of the app used for login.',
                      type: 'string'
                    }
                  }
                }
              }
            },
            customOpenIdConnectProviders: {
              description: 'The map of the name of the alias of each custom Open ID Connect provider to the\n' +
                'configuration settings of the custom Open ID Connect provider.',
              type: 'object',
              additionalProperties: {
                description: 'The configuration settings of the custom Open ID Connect provider.',
                type: 'object',
                properties: {
                  enabled: {
                    description: '<code>false</code> if the custom Open ID provider provider should not be enabled; otherwise, <code>true</code>.',
                    type: 'boolean'
                  },
                  registration: {
                    description: 'The configuration settings of the app registration for the custom Open ID Connect provider.',
                    type: 'object',
                    properties: {
                      clientId: {
                        description: 'The client id of the custom Open ID Connect provider.',
                        type: 'string'
                      },
                      clientCredential: {
                        description: 'The authentication credentials of the custom Open ID Connect provider.',
                        type: 'object',
                        properties: {
                          method: {
                            description: 'The method that should be used to authenticate the user.',
                            enum: [ 'ClientSecretPost' ],
                            type: 'string',
                            'x-ms-enum': {
                              name: 'ClientCredentialMethod',
                              modelAsString: false
                            }
                          },
                          clientSecretSettingName: {
                            description: 'The app setting that contains the client secret for the custom Open ID Connect provider.',
                            type: 'string'
                          }
                        }
                      },
                      openIdConnectConfiguration: {
                        description: 'The configuration settings of the endpoints used for the custom Open ID Connect provider.',
                        type: 'object',
                        properties: {
                          authorizationEndpoint: {
                            description: 'The endpoint to be used to make an authorization request.',
                            type: 'string'
                          },
                          tokenEndpoint: {
                            description: 'The endpoint to be used to request a token.',
                            type: 'string'
                          },
                          issuer: {
                            description: 'The endpoint that issues the token.',
                            type: 'string'
                          },
                          certificationUri: {
                            description: 'The endpoint that provides the keys necessary to validate the token.',
                            type: 'string'
                          },
                          wellKnownOpenIdConfiguration: {
                            description: 'The endpoint that contains all the configuration endpoints for the provider.',
                            type: 'string'
                          }
                        }
                      }
                    }
                  },
                  login: {
                    description: 'The configuration settings of the login flow of the custom Open ID Connect provider.',
                    type: 'object',
                    properties: {
                      nameClaimType: {
                        description: 'The name of the claim that contains the users name.',
                        type: 'string'
                      },
                      scopes: {
                        description: 'A list of the scopes that should be requested while authenticating.',
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        login: {
          description: 'The configuration settings of the login flow of users using App Service Authentication/Authorization.',
          type: 'object',
          properties: {
            routes: {
              description: 'The routes that specify the endpoints used for login and logout requests.',
              type: 'object',
              properties: {
                logoutEndpoint: {
                  description: 'The endpoint at which a logout request should be made.',
                  type: 'string'
                }
              }
            },
            tokenStore: {
              description: 'The configuration settings of the token store.',
              type: 'object',
              properties: {
                enabled: {
                  description: '<code>true</code> to durably store platform-specific security tokens that are obtained during login flows; otherwise, <code>false</code>.\n' +
                    ' The default is <code>false</code>.',
                  type: 'boolean'
                },
                tokenRefreshExtensionHours: {
                  format: 'double',
                  description: 'The number of hours after session token expiration that a session token can be used to\n' +
                    'call the token refresh API. The default is 72 hours.',
                  type: 'number'
                },
                fileSystem: {
                  description: 'The configuration settings of the storage of the tokens if a file system is used.',
                  type: 'object',
                  properties: {
                    directory: {
                      description: 'The directory in which the tokens will be stored.',
                      type: 'string'
                    }
                  }
                },
                azureBlobStorage: {
                  description: 'The configuration settings of the storage of the tokens if blob storage is used.',
                  type: 'object',
                  properties: {
                    sasUrlSettingName: {
                      description: 'The name of the app setting containing the SAS URL of the blob storage containing the tokens.',
                      type: 'string'
                    }
                  }
                }
              }
            },
            preserveUrlFragmentsForLogins: {
              description: '<code>true</code> if the fragments from the request are preserved after the login request is made; otherwise, <code>false</code>.',
              type: 'boolean'
            },
            allowedExternalRedirectUrls: {
              description: 'External URLs that can be redirected to as part of logging in or logging out of the app. Note that the query string part of the URL is ignored.\n' +
                'This is an advanced setting typically only needed by Windows Store application backends.\n' +
                'Note that URLs within the current domain are always implicitly allowed.',
              type: 'array',
              items: { type: 'string' }
            },
            cookieExpiration: {
              description: "The configuration settings of the session cookie's expiration.",
              type: 'object',
              properties: {
                convention: {
                  description: "The convention used when determining the session cookie's expiration.",
                  enum: [ 'FixedTime', 'IdentityProviderDerived' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'CookieExpirationConvention',
                    modelAsString: false
                  }
                },
                timeToExpiration: {
                  description: 'The time after the request is made when the session cookie should expire.',
                  type: 'string'
                }
              }
            },
            nonce: {
              description: 'The configuration settings of the nonce used in the login flow.',
              type: 'object',
              properties: {
                validateNonce: {
                  description: '<code>false</code> if the nonce should not be validated while completing the login flow; otherwise, <code>true</code>.',
                  type: 'boolean'
                },
                nonceExpirationInterval: {
                  description: 'The time after the request is made when the nonce should expire.',
                  type: 'string'
                }
              }
            }
          }
        },
        httpSettings: {
          description: 'The configuration settings of the HTTP requests for authentication and authorization requests made against App Service Authentication/Authorization.',
          type: 'object',
          properties: {
            requireHttps: {
              description: '<code>false</code> if the authentication/authorization responses not having the HTTPS scheme are permissible; otherwise, <code>true</code>.',
              type: 'boolean'
            },
            routes: {
              description: 'The configuration settings of the paths HTTP requests.',
              type: 'object',
              properties: {
                apiPrefix: {
                  description: 'The prefix that should precede all the authentication/authorization paths.',
                  type: 'string'
                }
              }
            },
            forwardProxy: {
              description: 'The configuration settings of a forward proxy used to make the requests.',
              type: 'object',
              properties: {
                convention: {
                  description: 'The convention used to determine the url of the request made.',
                  enum: [ 'NoProxy', 'Standard', 'Custom' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'ForwardProxyConvention',
                    modelAsString: false
                  }
                },
                customHostHeaderName: {
                  description: 'The name of the header containing the host of the request.',
                  type: 'string'
                },
                customProtoHeaderName: {
                  description: 'The name of the header containing the scheme of the request.',
                  type: 'string'
                }
              }
            }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
