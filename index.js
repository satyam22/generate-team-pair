const fs = require("fs")
const path = require("path")

const CANDIDATE_PAIR_HISTORY_PATH = path.join(__dirname, "candidate-pair-history.json")
const CANDIDATE_PAIR_RESULT_PATH = path.join(__dirname, "candidate-pair-result.json")
const isResetHistory = process.argv[2] == "--reset"

const { validateCandidatesData, validateCandidatePairHistory } = require("./validations")
const { generateInitialHistory, getRandomCandidate } = require("./candidate-utils")

let candidates = require("./candidates.json")
let candidatePairHistory = require(CANDIDATE_PAIR_HISTORY_PATH)

function generateCandidatePairs(candidates, candidatePairHistory) {
  const candidatePairs = []
  const reservedCandidateSet = new Set()
  const totalCandidates = candidates.length
  let itr = 0
  while (itr < totalCandidates) {
    const currentCandidate = candidates[itr]
    const currentCandidateName = candidates[itr].name
    if (reservedCandidateSet.has(currentCandidate)) {
      itr++
      continue
    }
    const notAvailCandidatesArr = [...candidatePairHistory[currentCandidateName], currentCandidate]
    const availableCandidates = candidates.filter(
      (candidate) =>
        !notAvailCandidatesArr.some(
          ({ name: notAvailCandName }) => candidate.name === notAvailCandName
        ) && !reservedCandidateSet.has(candidate)
    )

    if (availableCandidates.length === 0) {
      throw new Error("All pairs exhaused!. please run 'npm run start:reset' to delete candidate pair history")
    }
    const partnerCandidate = getRandomCandidate(availableCandidates)
    const candidatePair = [currentCandidate, partnerCandidate]
    candidatePairs.push(candidatePair)
    reservedCandidateSet.add(currentCandidate)
    reservedCandidateSet.add(partnerCandidate)
    itr++
  }
  return candidatePairs
}

function getNewCandidatePairHistory(candidatePairs, candidatePairHistory, candidates) {
  validateCandidatePairHistory(candidatePairHistory, candidates)

  const newCandidatePairHistory = candidatePairHistory

  for (let candidatePair of candidatePairs) {
    const firstPartner = candidatePair[0]
    const secondPartner = candidatePair[1]
    const firstPartnerName = firstPartner.name
    const secondPartnerName = secondPartner.name
    if (!firstPartnerName || !secondPartnerName) {
      throw new Error(
        "Failed to generate new candidate pair history. candidate name must be non-empty"
      )
    }
    newCandidatePairHistory[firstPartnerName].push(secondPartner)
    newCandidatePairHistory[secondPartnerName].push(firstPartner)
  }

  return newCandidatePairHistory
}

function initiateCandidatePairHistory() {
  const initialHistory = generateInitialHistory(candidates)
  fs.writeFileSync(CANDIDATE_PAIR_HISTORY_PATH, JSON.stringify(initialHistory, null, 2))
  candidatePairHistory = initialHistory
}
const dummyCandidate = {
  name: 'Dummy Candidate'
}

try {
  if(candidates.length % 2 !== 0){
    candidates.push(dummyCandidate)
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
  // console.log("new candidate pair history:: ", newCandidatePairHistory)
} catch (err) {
  //TODO: Error handling
  console.error(err)
}
