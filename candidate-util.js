const { DUMMY_CANDIDATE_OBJ } = require('./constants');

function initializeCandidatesHistory(candidates) {
  const candidatesHistory = {};
  const candidatesName = getCandidatesName(candidates);

  for (candidateName of candidatesName) {
    candidatesHistory[candidateName] = [];
  }
  if (candidates.length % 2 !== 0) {
    candidatesHistory[DUMMY_CANDIDATE_OBJ.name] = [];
  }

  return candidatesHistory;
}

function getCandidatesUpdatedHistory(candidatesHistory, candidatesPair) {
  const candidatesUpdatedHistory = candidatesHistory;

  for (let [firstCandidate, secondCandidate] of candidatesPair) {
    const firstCandidateName = firstCandidate.name;
    const secondCandidateName = secondCandidate.name;
    candidatesUpdatedHistory[firstCandidateName].push(secondCandidateName);
    candidatesUpdatedHistory[secondCandidateName].push(firstCandidateName);
  }

  return candidatesUpdatedHistory;
}

function getCandidatesName(candidates) {
  return candidates.map(({ name }) => name);
}

module.exports = {
  initializeCandidatesHistory,
  getCandidatesUpdatedHistory,
  getCandidatesName
}