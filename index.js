const fs = require("fs")
const path = require("path")
const { validateCandidatesData, validateCandidatePairHistory } = require("./validations")
const { generateInitialHistory, getRandomCandidate } = require("./candidate-utils")

const CANDIDATE_PAIR_HISTORY_PATH = path.join(__dirname, "candidate-pair-history.json")
const CANDIDATE_PAIR_RESULT_PATH = path.join(__dirname, "candidate-pair-result.json")
const candidates = require("./candidates.json")
let candidatePairHistory = require(CANDIDATE_PAIR_HISTORY_PATH)

function generateCandidatePairs(candidates, candidatePairHistory) {
  const candidatePairs = []
  const reservedCandidateSet = new Set()
  const totalCandidates = candidates.length
  let itr = 0
  while (itr < totalCandidates) {
    const currentCandidate = candidates[itr]
    const currentCandidateName = candidates[itr].fullName
    if (reservedCandidateSet.has(currentCandidate)) {
      itr++
      continue
    }
    const notAvailCandidatesArr = [...candidatePairHistory[currentCandidateName], currentCandidate]
    const availableCandidates = candidates.filter(
      ({ fullName }) =>
        !notAvailCandidatesArr.some(
          ({ fullName: notAvailCandFullName }) => fullName === notAvailCandFullName
        )
    )

    if (availableCandidates.length === 0) {
      throw new Error("All pairs exhaused!. please delete candidate pair history")
    }
    console.log(availableCandidates)
    const partnerCandidate = getRandomCandidate(availableCandidates)
    const candidatePair = [currentCandidate, partnerCandidate]
    // console.log("candidate pair:: ", candidatePair);
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
    const firstPartnerName = firstPartner.fullName
    const secondPartnerName = secondPartner.fullName
    if (!firstPartnerName || !secondPartnerName) {
      throw new Error(
        "Failed to generate new candidate pair history. candidate fullName must be non-empty"
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

try {
  validateCandidatesData(candidates)
  if (
    !candidatePairHistory ||
    typeof candidatePairHistory !== "object" ||
    Object.keys(candidatePairHistory).length === 0
  ) {
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
  // console.log("candidate pairs:: ", candidatePairs)
  // console.log("new candidate pair history:: ", newCandidatePairHistory)
} catch (err) {
  //TODO: Error handling
  console.error(err)
}
