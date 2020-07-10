function isDuplicateValsInArray(arr){
  const duplicateVals = arr.filter((item, index) => arr.indexOf(item) !== index)
  return duplicateVals.length > 0
} 

function validateCandidatesData(candidates) {
  if(!Array.isArray(candidates)) {
    throw new Error('Invalid data. candidates must be an array of objects')
  }

  if(candidates.length < 2) {
    throw new Error('Insufficient data. Candidates array must have atleast two object')
  }

  const candidateNames = candidates.map(({ name }) => name)
  const  isCandidateNameInvalid = candidateNames.some(name => (typeof(name) !== "string" || name === ""))

  if(isCandidateNameInvalid) {
    throw new Error('Invalid data. Each candidate must have a non-empty name in candidates array')
  } 

  if(isDuplicateValsInArray(candidateNames)) {
    throw new Error('Invalid data. Each candidate must have a unique name in candidate array')
  }
  
}

function validateCandidatePairHistory(candidatePairHistory, candidates){
  const candidateNames = candidates.map(({ name }) => name)
  
  for(let candidateName of candidateNames){
    if(!Array.isArray(candidatePairHistory[candidateName])) {
      throw new Error(`Invalid Candidate pair history. candidate ${candidateName} not found in history`)
    }
  }
}

module.exports = {
  validateCandidatesData,
  validateCandidatePairHistory
}