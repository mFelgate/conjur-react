# Conjur React Development Environment

This directory contains the Docker development environment for the Conjur React UI.

The React application is designed to run **alongside the Conjur development environment**. It does not create or manage its own Conjur instance. Instead, it connects to an existing Conjur dev stack and uses the services already provided by that environment.

For information about setting up the Conjur development environment itself, see:

https://github.com/cyberark/conjur/blob/master/CONTRIBUTING.md

---

## Architecture

The development setup consists of:

- Conjur server (managed by the Conjur repository)
- Supporting services (Postgres, Keycloak, etc.)
- React UI (this repository)

The React container joins the existing Conjur Docker network and communicates with Conjur through the Vite development proxy.


## Connecting to Conjur

By default, the UI is configured to work with the Conjur OSS development environment.

To connect the UI to another Conjur instance:

1. Update the Conjur API URL in the environment configuration.
2. If running with Docker Compose, ensure the UI container is attached to the same Docker network as the Conjur instance.

Example:

```yaml
environment:
  VITE_API_BASE_URL: http://conjur:3000
networks:
  - conjur_default