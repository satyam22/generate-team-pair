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

  const candidateNames = candidates.map(({ fullName }) => fullName)
  const  isCandidateNameInvalid = candidateNames.some(cName => (typeof(cName) !== "string" || cName === ""))

  if(isCandidateNameInvalid) {
    throw new Error('Invalid data. Each candidate must have a non-empty fullName in candidates array')
  } 

  if(isDuplicateValsInArray(candidateNames)) {
    throw new Error('Invalid data. Each candidate must have a unique name in candidate array')
  }
  
}

function validateCandidatePairHistory(candidatePairHistory, candidates){
  const candidateNames = candidates.map(({ fullName }) => fullName)
  
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