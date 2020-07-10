const { getCandidatesName } = require('./utils');

function isDuplicateValsInArray(arr) {
  const duplicateVals = arr.filter((item, index) => arr.indexOf(item) !== index);
  return duplicateVals.length > 0;
}

function validateCandidatesData(candidates) {
  if (!Array.isArray(candidates)) {
    throw new Error('Invalid data. candidates must be an array of objects');
  }

  if (candidates.length < 2) {
    throw new Error('Insufficient data. Candidates array must have atleast two object');
  }

  const candidatesName = getCandidatesName(candidates);
  const isCandidatesNameInvalid = candidatesName.some(
    (name) => typeof name !== 'string' || name === ''
  );

  if (isCandidatesNameInvalid) {
    throw new Error('Invalid data. Each candidate must have a non-empty name in candidates array');
  }

  if (isDuplicateValsInArray(candidatesName)) {
    throw new Error('Invalid data. Each candidate must have a unique name in candidate array');
  }
}

function validateCandidatesHistory(candidatesHistory, candidates) {
  const candidatesName = getCandidatesName(candidates);

  for (let candidateName of candidatesName) {
    if (!Array.isArray(candidatesHistory[candidateName])) {
      throw new Error(
        `Invalid Candidate pair history. candidate ${candidateName} not found in history`
      );
    }
  }
}

module.exports = {
  validateCandidatesData,
  validateCandidatesHistory,
};
