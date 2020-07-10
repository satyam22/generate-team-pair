function generateInitialHistory(candidates){
  const initialHistory = {}
  const candidateNames = candidates.map(({ fullName }) => fullName)

  for(candidateName of candidateNames) {
    initialHistory[candidateName] = []
  }

  if(candidates.length % 2 !== 0){
    initialHistory["dummyPerson"] = []
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