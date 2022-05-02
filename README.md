# github-actions

A home for github actions used to process BAFS source code.

Github actions require the `node_modules` directory to be checked in as they
don't do an install step, they simply run the code.

## Zenhub

The following actions are for use with Zenhub to manage issues and PRs.

### Workflows

- **on-merge**: This workflow runs when a PR is merged into the master/main
  branch. It uses [action-qa-words](#action-qa-words) to find issues linked in
  the PR and then [action-qa-pipeline](#action-qa-pipeline) to move the related
  issues into the QA pipeline.

### Actions

#### action-qa-words

Finds text like `qa #333` or `qa bafsllc/blast-client#4444` in the description
of a PR and outputs a CSV of those issues.

#### action-qa-pipeline

Given a CSV string of issues all those issues will be moved to the QA pipeline
of the Engineering workspace.
