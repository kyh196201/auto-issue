import { ISSUE_TYPES } from './constants.js';

const isValidIssueType = (issueType) => {
  return ISSUE_TYPES.includes(issueType);
};

export { isValidIssueType };
