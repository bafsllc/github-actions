# github-actions

A home for github actions used to process BAFS source code.

Github actions require the `node_modules` directory to be checked in as they
don't do an install step, they simply run the code.

## Zenhub

The following actions are for use with Zenhub to manage issues and PRs.

### Workflows

#### on-merge

This workflow runs when a PR is merged into the master/main branch. It uses
[action-qa-words](#action-qa-words) to find issues linked in the PR and then
[action-qa-pipeline](#action-qa-pipeline) to move the related issues into the QA
pipeline.

##### Usage

To use the on-merge workflow in a repository do the following.

1. Add an entry to the repository's secrets with the name `ZENHUB_TOKEN` and the
value of the Zenhub API token (see Rich for the current token).
1. Add a file to the repository with the following path
   `/.github/workflows/on-merge.yml` with the contents below:

```yml
on:
  pull_request:
    branches:
      - master
      - main
    types: ["closed"]
jobs:
  call-workflow:
    uses: bafsllc/github-actions/.github/workflows/on-merge.yml@v1
    with:
      pipelineId: Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzI2ODAzMTE # The ID of the QA pipeline in the Engineering workspace.
      workspaceId: 60997aff441f2f0011219bc1 # The ID of the Engineering workspace.
    secrets:
      zenhubToken: ${{ secrets.ZENHUB_TOKEN }} # The repository secret named ZENHUB_TOKEN
```

### Actions

#### action-qa-words

Finds text like `qa #333` or `qa bafsllc/blast-client#4444` in the description
of a PR and outputs a CSV of those issues.

#### action-qa-pipeline

Given a CSV string of issues all those issues will be moved to the QA pipeline
of the Engineering workspace.
