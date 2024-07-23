const isValidIssueType = (issueType) => {
  return ISSUE_TYPES.includes(issueType);
};

export { isValidIssueType };
