# IoT-pot

## Description

Course project repository for `TIES4571 IoT-projekti`.

## Development

Use Visual Studio Code and the [Platform IO extension](https://docs.platformio.org/en/stable/integration/ide/vscode.html).

## Branches

No direct pushes to the `main` branch.
Let´s use feature branches: create a new branch for each new feature.

### When you start to develop a new feature:

1. Make sure your `main`is up to date, then create a new branch based on `main`
2. Name the branch for example: `feature/my-new-feature`
3. When you are done, make sure everything works and compiles, then push the branch to Gitlab
4. Log into the Gitlab web app and create a Merge Request to merge your branch `feature/my-new-feature` into the `main` branch

## Secrets

Do not commit secrets, passwords, API keys etc into Git. Create a file called secrets.h in /include, this file should contain all secrets and the file is ignored by git. See the file [secrets.h.template](./include/secrets.h.template) for a template.

## Monitoring-app

See [/monitoring-app](./monitoring-app)

## Authors

Okko Ojala  
Susan Paloranta  
Bella Lerch  
Antti Leppänen  
Katja Hellsten
