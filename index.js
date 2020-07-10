const path = require('path');

const CANDIDATES_HISTORY_PATH = path.join(__dirname, 'candidates-history.json');
const CANDIDATES_RESULT_PATH = path.join(__dirname, 'candidates-result.json');
const isResetHistory = process.argv[2] == "--reset";

const candidatesHistory = require(CANDIDATES_HISTORY_PATH);
const candidates = require('./candidates.json');
const { validateCandidatesData, validateCandidatesHistory } = require('./validations');
const {
  getCandidatesName,
  getRandomCandidate,
  arrayDifference,
  getCandidateByName,
  initializeCandidatesHistory,
  getCandidatesUpdatedHistory,
  writeToFile,
} = require('./utils');
const { DUMMY_CANDIDATE_OBJ } = require('./constants');


function generateCandidatesPair(candidates, candidatesHistory) {
  const results = [];
  let candidatesName = getCandidatesName(candidates);

  while (candidatesName.length) {
    const [currentCandidateName, ...otherCandidatesName] = candidatesName;
    const currentCandidateHistory = candidatesHistory[currentCandidateName];
    const availableCandidatesName = arrayDifference(otherCandidatesName, currentCandidateHistory);
    const partnerCandidateName = getRandomCandidate(availableCandidatesName);

    const currentCandidate = getCandidateByName(candidates, currentCandidateName);
    const partnerCandidate = getCandidateByName(candidates, partnerCandidateName);
    results.push([currentCandidate, partnerCandidate]);

    candidatesName = arrayDifference(candidatesName, [currentCandidateName, partnerCandidateName]);
  }
  return results;
}



function main(candidates, candidatesHistory) {
  if (candidates.length % 2 !== 0) {
    candidates.push(DUMMY_CANDIDATE_OBJ);
  }
  if (
    !candidatesHistory ||
    typeof candidatesHistory !== 'object' ||
    Object.keys(candidatesHistory).length === 0 ||
    isResetHistory
  ) {
    console.log("###### Reseting candidates history #######")
    candidatesHistory = initializeCandidatesHistory(candidates);
  }

  validateCandidatesData(candidates);
  validateCandidatesHistory(candidatesHistory, candidates);

  const candidatesPair = generateCandidatesPair(candidates, candidatesHistory);
  const updatedHistory = getCandidatesUpdatedHistory(candidatesHistory, candidatesPair);

  writeToFile(CANDIDATES_RESULT_PATH, candidatesPair);
  writeToFile(CANDIDATES_HISTORY_PATH, updatedHistory)

  console.log("###### Candidates pair generated successfylly! #######")
}


main(candidates, candidatesHistory)