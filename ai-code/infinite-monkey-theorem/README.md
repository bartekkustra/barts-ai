<img src="https://cl.ly/0c3c1s3Z1C14/Screen%20Recording%202017-10-18%20at%2005.16%20PM.gif" />

1. Create a generation of `POPULATION` (default 200) nodes
2. generate random string for each node in generation
  ```javascript
  [
    {
      phrase: ['p', 'o', 'p', 'c', 'o', 'r', 'n'],
      fitness: 0,
    },{
      phrase: ['w', 'e', 'b', 'f', 'l', 'o', 'w'],
      fitness: 0,
    }
  ]
  ```
3. calculate fitness score for each node
  ```javascript
  function calculateFitness(whichone) {
    let wordFitness = 0
    for(let i = 0; i < word.length; i++) {
      if(word[i] === generation[whichone].phrase[i]) {
        wordFitness++
      }
    }
    generation[whichone].fitness = wordFitness
  }
  ```
4. Sort generation by fitness score
  ```javascript
  [
    {
      phrase: ['p', 'o', 'p', 'c', 'o', 'r', 'n'],  // the final word is wolfdew
      fitness: 1,
    },{
      phrase: ['w', 'e', 'b', 'f', 'l', 'o', 'w'],  // the final word is wolfdew
      fitness: 3,
    }
  ]
  ```
5. Select parent1:
  1. De-duplicate available fitness scores (eg. `[0, 1, 1, 1, 2, 3, 3] → [0, 1, 2, 3]`)
  2. Create a probability array → `[0, 1, 1, 2, 2, 2, 3, 3, 3]` based on a fitness score + 1 amount (that way higher fitness score has a better chance of being picked)
  3. Pick random fitness score
  4. Generate array of current generation nodes with selected fitness score
  5. Pick random node with selected fitness score
6. Select parent2:
  ... Basically same as parent1
7. Breed parent1 and parent2
  1. Slice parent1 and parent2 into half
  2. Take left part of parent1 and right part of parent2 and put together
  ```javascript
  parent1:  ['w', 'e', 'b', 'f', 'l', 'o', 'w']
  parent2:  ['p', 'o', 'p', 'c', 'o', 'r', 'n']
  slice1:   ['w', 'e', 'b'. 'f']
  slice2:                       ['o', 'r', 'n']
  kid:      ['w', 'e', 'b', 'f', 'o', 'r', 'n']
  ```
  3. For every character in the kid's array there is 1% of mutation - a random character being set
  ```javascript
  kid: ['w', 'e', 'b', 'f', 'o', 'r', 'n']  // no mutation
  kid: ['w', 'X', 'b', 'f', 'o', 'Y', 'n']  // mutation
  ```
8. Breed a new generation of `POPULATION` nodes
9. Repeat calculating fitness scores and breeding until the final word is made by any node in a generation
