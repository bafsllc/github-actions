import core from "@actions/core";
import { context } from "@actions/github";

function main() {
  try {
    // core.info(`context=\n${JSON.stringify(context, null, 2)}`);

    const {
      payload: {
        pull_request: { body }
      }
    } = context;
    core.info(`body='${body}'`);

    // Is there a QA word related to the issue #?
    // example: "qa #1234"
    // example "QA bafsllc/clearwater#1234"
    // example "qa #1234, QA bafsllc/clearwater#1234"

    // eslint-disable-next-line no-useless-escape
    const regex = /qa[^\S\r\n]+([\w\/]*#[1-9]+)/gi;
    const allMatches = [];
    let matches;
    do {
      matches = regex.exec(body);
      if (matches) {
        allMatches.push(matches);
      }
    } while (matches);

    core.info(`allMatches=${JSON.stringify(allMatches)}`);

    if (!allMatches.length) {
      core.setOutput("issueId", "");
      return;
    }

    const issueIds = [];
    while (allMatches.length) {
      const match = allMatches.shift();
      issueIds.push(match[1]);
    }

    core.setOutput("issueIds", issueIds.join(","));
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
