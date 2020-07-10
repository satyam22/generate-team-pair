const fs = require('fs');
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

function getRandomCandidate(candidates) {
  const totalCandidates = candidates.length;
  const randomIndex = Math.floor(Math.random() * totalCandidates);
  return candidates[randomIndex];
}

function getCandidatesName(candidates) {
  return candidates.map(({ name }) => name);
}

function getCandidateByName(candidates, candidateName) {
  return candidates.find(({ name }) => name === candidateName);
}

function arrayDifference(oldArray, newArray) {
  return oldArray.filter((item) => !newArray.includes(item));
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

function writeToFile(filePath, jsonContent) {
  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
}

module.exports = {
  initializeCandidatesHistory,
  getRandomCandidate,
  getCandidatesName,
  getCandidateByName,
  arrayDifference,
  getCandidatesUpdatedHistory,
  writeToFile,
};
