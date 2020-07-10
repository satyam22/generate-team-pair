## JS script to generate team pair

### Description

Purpose of this script is to generate team pairs from list of candidates. It keeps track of previous pairs history so that team members get new partner in every iteration.


### Instructions
 - Paste candidates data in `candidates.json` file. It should be an array of Candidate objects. 
 - Every candidate Object must have field `name`.
 - Every candidate's `name` must be unique.
 - Run `npm start` to generate Candidate pairs.
 - Run `npm run start:reset` to reset candidate pair history and generate pair.
 - Generated result can be find in `candidate-pair-result.json` file.


### Note
If total number of candidates in `candidates.json` file is Odd. dummy candidate would be added to the list while generating team pair.

### TODO
 - [ ] Add test cases