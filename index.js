const path = require('path');
const CANDIDATES_HISTORY_PATH = path.join(__dirname, 'candidates-history.json');
const CANDIDATES_RESULT_PATH = path.join(__dirname, 'candidates-result.json');
const isResetHistory = process.argv[2] == '--reset';

let candidatesHistory = require(CANDIDATES_HISTORY_PATH);
const candidates = require('./candidates.json');
const { validateCandidatesData, validateCandidatesHistory } = require('./candidate-validations');
const {
  initializeCandidatesHistory,
  getCandidatesUpdatedHistory,
  getCandidatesName,
} = require('./candidate-util');
const { getRandomItemfromArray, arrayDifference, writeToFile } = require('./utils');
const { DUMMY_CANDIDATE_OBJ } = require('./constants');

function generateCandidatesPair(candidates, candidatesHistory) {
  let results = [];
  const allCandidatesName = getCandidatesName(candidates);
  let candidatesName = allCandidatesName;
  let retryCounter = 0
  while (candidatesName.length > 0) {
    const [currentCandidateName, ...otherCandidatesName] = candidatesName;
    const currentCandidateHistory = candidatesHistory[currentCandidateName];
    const availableCandidatesName = arrayDifference(otherCandidatesName, currentCandidateHistory);

    if (
      availableCandidatesName.length === 0 &&
      currentCandidateHistory.length < allCandidatesName.length - 1
      && retryCounter < 10
    ) {
      candidatesName = allCandidatesName;
      results = [];
      retryCounter++;
    }
    else if(availableCandidatesName.length === 0){
      throw new Error('No more pairs possible. Please try "npm run start:reset" to reset the history and create pair')
    }
     else {
      const partnerCandidateName = getRandomItemfromArray(availableCandidatesName);
      const currentCandidate = getCandidateByName(candidates, currentCandidateName);
      const partnerCandidate = getCandidateByName(candidates, partnerCandidateName);
      results.push([currentCandidate, partnerCandidate]);

      candidatesName = arrayDifference(candidatesName, [
        currentCandidateName,
        partnerCandidateName,
      ]);
    }
  }
  return results;
}

function getCandidateByName(candidates, candidateName) {
  return candidates.find(({ name }) => name === candidateName);
}

function main() {
  if (candidates.length % 2 !== 0) {
    candidates.push(DUMMY_CANDIDATE_OBJ);
  }
  if (
    !candidatesHistory ||
    typeof candidatesHistory !== 'object' ||
    Object.keys(candidatesHistory).length === 0 ||
    isResetHistory
  ) {
    console.log('###### Reseting candidates history #######');
    candidatesHistory = initializeCandidatesHistory(candidates);
  }

  validateCandidatesData(candidates);
  validateCandidatesHistory(candidatesHistory, candidates);

  const candidatesPair = generateCandidatesPair(candidates, candidatesHistory);
  const updatedHistory = getCandidatesUpdatedHistory(candidatesHistory, candidatesPair);

  writeToFile(CANDIDATES_RESULT_PATH, candidatesPair);
  writeToFile(CANDIDATES_HISTORY_PATH, updatedHistory);

  console.log('###### Candidates pair generated successfylly! #######');
  console.log(candidatesPair);
}

main();
