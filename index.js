const fs = require("fs")
const path = require("path")

const CANDIDATE_PAIR_HISTORY_PATH = path.join(__dirname, "candidate-pair-history.json")
const CANDIDATE_PAIR_RESULT_PATH = path.join(__dirname, "candidate-pair-result.json")
const isResetHistory = process.argv[2] == "--reset"

const { validateCandidatesData, validateCandidatePairHistory } = require("./validations")
const { generateCandidatePairInitialHistory, getRandomCandidate } = require("./candidate-utils")
const { DUMMY_CANDIDATE_OBJ } = require('./constants')
let candidates = require("./candidates.json")
let candidatePairHistory = require(CANDIDATE_PAIR_HISTORY_PATH)


function generateCandidatePairs(candidates, candidatePairHistory) {
  const candidatePairs = []
  const reservedCandidatesSet = new Set()
  const totalCandidates = candidates.length
  let index = 0

  while (index < totalCandidates) {
    const currentCandidate = candidates[index]
    const currentCandidateName = candidates[index].name
    
    if (reservedCandidatesSet.has(currentCandidate)) {
      index++
      continue
    }
    const notAvailCandidatesArr = [...candidatePairHistory[currentCandidateName], currentCandidate]
    const availableCandidates = candidates.filter(
      (candidate) =>
        !notAvailCandidatesArr.some(
          ({ name: notAvailCandidateName }) => candidate.name === notAvailCandidateName
        ) && !reservedCandidatesSet.has(candidate)
    )

    if (availableCandidates.length === 0) {
      throw new Error("All pairs exhaused!. please run 'npm run start:reset' to delete candidate pair history")
    }

    const partnerCandidate = getRandomCandidate(availableCandidates)
    const candidatePair = [currentCandidate, partnerCandidate]
    candidatePairs.push(candidatePair)
    reservedCandidatesSet.add(currentCandidate)
    reservedCandidatesSet.add(partnerCandidate)
    index++
  }
  return candidatePairs
}

function getNewCandidatePairHistory(candidatePairs, candidatePairHistory, candidates) {
  validateCandidatePairHistory(candidatePairHistory, candidates)
  const newCandidatePairHistory = candidatePairHistory

  for (let candidatePair of candidatePairs) {
    const [ firstCandidate, secondCandidate ] = candidatePair
    const firstCandidateName = firstCandidate.name
    const secondCandidateName = secondCandidate.name
    if (!firstCandidateName || !secondCandidateName) {
      throw new Error(
        "Failed to generate new candidate pair history. candidate name must be non-empty"
      )
    }
    newCandidatePairHistory[firstCandidateName].push(secondCandidate)
    newCandidatePairHistory[secondCandidateName].push(firstCandidate)
  }

  return newCandidatePairHistory
}

function initiateCandidatePairHistory() {
  const initialHistory = generateCandidatePairInitialHistory(candidates)
  fs.writeFileSync(CANDIDATE_PAIR_HISTORY_PATH, JSON.stringify(initialHistory, null, 2))
  candidatePairHistory = initialHistory
}


try {
  if(candidates.length % 2 !== 0){
    candidates.push(DUMMY_CANDIDATE_OBJ)
  }

  validateCandidatesData(candidates)
  if (
    !candidatePairHistory ||
    typeof candidatePairHistory !== "object" ||
    Object.keys(candidatePairHistory).length === 0 ||
    isResetHistory
  ) {
    console.log("###### Reseting candidates pair history #######")
    initiateCandidatePairHistory()
  }

  const candidatePairs = generateCandidatePairs(candidates, candidatePairHistory)
  const newCandidatePairHistory = getNewCandidatePairHistory(
    candidatePairs,
    candidatePairHistory,
    candidates
  )
  fs.writeFileSync(CANDIDATE_PAIR_HISTORY_PATH, JSON.stringify(newCandidatePairHistory, null, 2))
  fs.writeFileSync(CANDIDATE_PAIR_RESULT_PATH, JSON.stringify(candidatePairs, null, 2))
  console.log("######## Candidate pairs generated successfully ########")
  console.log("candidate pairs:: ", candidatePairs)
} catch (err) {
  //TODO: Error handling
  console.error(err)
}
