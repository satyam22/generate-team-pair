function generateInitialHistory(candidates){
  const initialHistory = {}
  const candidateNames = candidates.map(({ name }) => name)

  for(candidateName of candidateNames) {
    initialHistory[candidateName] = []
  }

  if(candidates.length % 2 !== 0){
    initialHistory["dummyCandidate"] = []
  }

  return initialHistory
}

function getRandomCandidate(candidates){
  const totalCandidates = candidates.length
  const randCandidateIndex = Math.floor(Math.random()*totalCandidates)
  return candidates[randCandidateIndex]
}

module.exports = {
  generateInitialHistory,
  getRandomCandidate
}