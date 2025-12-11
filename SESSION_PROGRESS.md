# Session Progress Report

## Summary
We are working on `goodfriend-keycloak`.
Previous attempts with conflicting Java versions were addressed by switching to a Java 8 specific setup.
We are now setting up the project using **Java 8** on branch `feature/java8-setup`.

## Current State
- **Repo**: `goodfriend-keycloak`
- **Branch**: `feature/java8-setup`
- **Java Version**: 1.8.0_421
- **Maven Version**: 3.9.6

## Ongoing Fixes
- **Core**: Patched `KerberosSerializationUtils.java` to support newer Java 8 internal `sun.security.krb5.Credentials` constructor.
- **JS Adapter**: Added `plexus-utils` dependency to `minify-maven-plugin` to resolve `NoClassDefFoundError`.
- **Dependencies**: Added HTTPS repository definitions to `pom.xml` to bypass Maven 3.8+ HTTP blocker for JBoss repositories.

## Next Steps
1. Finish the build (`mvn install`).
2. Start Keycloak.
3. Verify Keycloak Admin UI.
