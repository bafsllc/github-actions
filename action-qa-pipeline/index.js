import core from "@actions/core";
import { context } from "@actions/github";
import fetch from "node-fetch";

/**
 * @param {string} issueNumber
 * @returns {string}
 */
function cleanIssueNumber(issueNumber) {
  let output = "";
  for (let i = 0; i < issueNumber.length; i++) {
    if (47 < issueNumber.charCodeAt(i) && issueNumber.charCodeAt(i) < 58) {
      output += issueNumber[i];
    }
  }

  return output;
}

async function main() {
  const pipelineId = core.getInput("pipelineId");
  if (!pipelineId) {
    core.setFailed("Missing 'pipelineId'.");
    return;
  }

  const workspaceId = core.getInput("workspaceId");
  if (!workspaceId) {
    core.setFailed("Missing 'workspaceId'.");
    return;
  }

  const zenhubToken = core.getInput("zenhubToken");
  if (!zenhubToken) {
    core.setFailed("Missing 'zenhubToken'.");
    return;
  }

  try {
    // core.info(`context=\n${JSON.stringify(context, null, 2)}`);

    const issueIds = core.getInput("issueIds");
    core.info(`issueIds='${issueIds}'`);

    const issueNumbers = issueIds.split(",");

    // If this is from a PR was the PR merged>
    const merged = context.payload.pull_request?.merged;
    core.info(`merged='${merged}'`);

    if (!merged) {
      return;
    }

    const repoId = context.payload.repository?.id;

    await Promise.all(
      issueNumbers.map(async issueNumber => {
        const url = new URL("https://api.zenhub.com");
        url.pathname = `/p2/workspaces/${workspaceId}/repositories/${repoId}/issues/${cleanIssueNumber(
          issueNumber
        )}/moves`;

        core.info(`URL[${issueNumber}]: url=${url.toString()}`);

        const init = {
          body: JSON.stringify({
            pipeline_id: pipelineId,
            position: "bottom"
          }),
          headers: {
            "Content-Type": "application/json",
            "X-Authentication-Token": zenhubToken
          },
          method: "POST"
        };

        const response = await fetch(url, init);
        core.info(`response[${issueNumber}]: status=${response.status}`);

        const text = await response.text();
        if (text) {
          core.info(
            `response[${issueNumber}]: text=\n'${
              text ? `\n` + text + `\n` : ""
            }'`
          );
        }
      })
    );
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
