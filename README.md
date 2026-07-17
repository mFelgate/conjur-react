# Conjur React UI

A lightweight web interface for exploring and managing a local Conjur OSS environment.

This project provides a modern React-based UI for Conjur OSS, focused on making it easier to explore Conjur concepts such as resources, secrets, authenticators, groups, and policies without needing to interact directly with the API.

The goal is to provide a simple developer-friendly interface for learning, testing, and working with Conjur OSS.

## Features for V1

### Authentication
- ✅ Password authentication
- ⬜ OIDC authentication

### Resources
- ✅ View resources
- ✅ View resource details
- ✅ View resource annotations
- ✅ View resource permissions

### Secrets
- ✅ Browse secrets
- ✅ View secret details
- ✅ Add/Update Secret 
- ⬜ Secret history

### Groups
- ✅ Browse groups
- ✅ View group details
- ✅ Add/Remove members from group

### Authenticators
- ✅ Browse authenticators
- ✅ View authenticator details
- ✅ Enable Authenticators
- ✅ Create Authenticators with V2 API
- ⬜ Authenticator validation/testing

### Policy Management
- ✅ YAML policy editor
- ✅ YAML policy validations through editor
- ✅ View Effective policy
- ✅ View policy history
- ✅ Load policies
- ✅ Policy dry-run validation
- ✅ View created, deleted, and updated resources during dry-run


## Development Environment

This project is designed to run alongside the Conjur OSS development environment.

The Conjur backend should be started using the Conjur development instructions:

https://github.com/cyberark/conjur/blob/master/CONTRIBUTING.md

Start the Conjur development environment:

```bash
cd conjur/dev
./start.sh
```

## Screenshots

### Groups
![Groups](screenshots/Groups.png)

### Group Membership Management
![Add or Remove Membership](screenshots/AddOrRemoveMembership.png)

### Policy Management
![View Policies](screenshots/ViewPolcies.png)

![Effective Policy](screenshots/EffectivePolicy.png)

### Policy Validation and Dry Run
![In Editor Validation](screenshots/InEditorValidation.png)
![Policy Dry Run Updates](screenshots/PolicyDryRunUpdates.png)

### Secret Management
![View Secret](screenshots/ViewSecret.png)
![View Secret](screenshots/ViewOrEditSecret.png)

### Authenticator Management
![View or Update Authenticator](screenshots/ViewOrUpdateAuthenticator.png)