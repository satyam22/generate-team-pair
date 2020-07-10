const { DUMMY_CANDIDATE_OBJ } = require('./constants')

function generateCandidatePairInitialHistory(candidates){
  const candidatePairInitialHistory = {}
  const candidateNames = candidates.map(({ name }) => name)

  for(candidateName of candidateNames) {
    candidatePairInitialHistory[candidateName] = []
  }

  if(candidates.length % 2 !== 0){
    candidatePairInitialHistory[DUMMY_CANDIDATE_OBJ.name] = []
  }

  return candidatePairInitialHistory
}

// function getRandomCandidate(candidates){
//   // const totalCandidates = candidates.length
//   // const randomIndex= Math.floor(Math.random()*totalCandidates)
//   return candidates[0]
// }

module.exports = {
  generateCandidatePairInitialHistory,
  // getRandomCandidate
}