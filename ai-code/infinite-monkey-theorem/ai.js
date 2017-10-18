console.clear()

let flagAI = false
let additionalCondition = i => i === null ? true : i < 100
let intervalInfo;

const _bestPhrase = document.getElementById('bestphrase')
const _totalGenerations = document.getElementById('totalgenerations')
const _averageFitness = document.getElementById('averagefitness')
const _totalPopulation = document.getElementById('totalpopulation')
const _mutationRate = document.getElementById('mutationrate')
const _output = document.getElementById('output')
const ASCII = {
  min: 32,
  max: 125,
}
const randomChar = () => {
  const rc = Math.floor((Math.random() * (ASCII.max-ASCII.min)) + ASCII.min)
  return rc !== 32 ? String.fromCharCode(rc) : " "
}
const MAX_INPUT = 26
const POPULATION = 200
const MUTATION = 0.01

let fitness = 0
let generationNumber = 0
let generation = []
let bestPhrase = ""
let newGeneration = []
let averageFitness = 0

let word

$('#phrasevalue').attr('maxLength', MAX_INPUT)
$('#phrasevalue').keyup(function() {
  let input = document.getElementById('phrasevalue').value
  const pattern = /^([a-zA-Z]*)$/
  if(!pattern.test(input)) {
    document.getElementById('phrasevalue').value = input.replace(/[^a-zA-Z ]/g, '')
  }
})

// unicorn
// webflow
// uniclow → 1% → uniclpw


// Button Handlers
$('#startai').click(function() {
  word = document.getElementById('phrasevalue').value
  startAI()
})
$('#stopai').click(function() {
  stopAI()
})
$('#clearai').click(function() {
  clearAI()
})

function startAI() {
  flagAI = true
  intervalInfo = setInterval(function() {
    _totalGenerations.textContent = generationNumber
    _averageFitness.textContent = averageFitness
    _totalPopulation.textContent = POPULATION
    _mutationRate.textContent = MUTATION
    _bestPhrase.textContent = bestPhrase
    showOutput(generation)
    console.log('bestPhrase: ', bestPhrase, '| generation: ', generationNumber)
  }, 50)
  clearAI()
  setup()
  runAI()
}
function stopAI() {
  flagAI = false
  clearInterval(intervalInfo)
}
function clearAI() {
  console.clear()
  _bestPhrase.textContent = "..."
  _totalGenerations.textContent = ""
  _averageFitness.textContent = ""
  _totalPopulation.textContent = POPULATION
  _mutationRate.textContent = MUTATION
  _output.textContent = ""
  fitness = 0
  generationNumber = 0
  generation = []
  bestPhrase = ""
  newGeneration = []
  averageFitness = 0
}

function setup() {
  let t0 = performance.now()
  // first generation is random
  for (let i = 0; i < POPULATION; i++) {
    let a = []
    for(let j = 0; j < word.length; j++) {
      const rc = randomChar()
      a.push(rc)
    }
    generation.push({
      phrase: a,
      fitness: 0,
    })
  }
  generationNumber++

  showOutput(generation)
  updateInfo()
}

function perfData(what, t0, t1) {
  console.log(what + " took: ", (t1-t0).toFixed(2), 'ms')
}

function showOutput(generationData) {
  let output = ""
  generationData.map(generationItem => { output += generationItem.phrase.join('') + "\n" })
  $('#output').text(output)
}

function updateInfo() {
  _totalGenerations.textContent = generationNumber
  _averageFitness.textContent = averageFitness
  _totalPopulation.textContent = POPULATION
  _mutationRate.textContent = MUTATION
  _bestPhrase.textContent = bestPhrase
  showOutput(generation)
  console.log('bestPhrase: ', bestPhrase, '| generation: ', generationNumber)
}

function calculateFitness(whichone) {
  let wordFitness = 0
  for(let i = 0; i < word.length; i++) {
    if(word[i] === generation[whichone].phrase[i]) {
      wordFitness++
    }
  }
  generation[whichone].fitness = wordFitness
}

function runAI() {
  let i = 0
  do {
    checkIfMatch()
    for(let j = 0; j < generation.length; j++) {
      calculateFitness(j)
    }

    generation = _.sortBy(generation, 'fitness')
    const uniqueGenerationByFitness = _.uniqBy(generation, 'fitness')
    let fitnesses = []
    uniqueGenerationByFitness.map(item => {
      fitnesses.push(item.fitness)
    })
    let fitnessSum = fitnesses.reduce((a,b) => a + b, 0)
    
    function randomFitnessArrFunc() {
      let randomFitnessArr = []
      for(let i = 0; i < fitnesses.length; i++) {
        for(let j = 0; j < fitnesses[i]+1; j++) {
          randomFitnessArr.push(fitnesses[i])
        }
      }
      const randomFitness = randomFitnessArr[Math.floor((Math.random() * randomFitnessArr.length))]
      const generationWithFitness = _.filter(generation, function(o) {return o.fitness === randomFitness})

      return generationWithFitness[Math.floor((Math.random() * generationWithFitness.length))].phrase
    }

    let newGeneration = []
    for(let i = 0; i < POPULATION; i++) {
      const parent1 = randomFitnessArrFunc()
      const parent2 = randomFitnessArrFunc()
      let kid = breed(parent1, parent2)
    
      function mutationOnKid() {
        for(let i = 0; i < kid.length; i++) {
          let randomNumber = Math.floor((Math.random() * 100))/100
          if(randomNumber <= MUTATION) {
            kid[i] = randomChar()
          }
        }
        return kid
      }
      kid = mutationOnKid()
      newGeneration.push({
        phrase: kid,
        fitness: 0
      })
    }
    
    const generationWithBestFitness = _.filter(generation, function(o) {return o.fitness === fitnesses[fitnesses.length-1]})
    averageFitness = (((fitnesses.reduce((a, b) => a + b) / fitnesses.length) / word.length) * 100).toFixed(2) + "%"
    bestPhrase = generationWithBestFitness[Math.floor((Math.random() * generationWithBestFitness.length))].phrase.join('')
    generationNumber++
    
    generation = newGeneration
    updateInfo()
    i++
  } while (!checkIfMatch().successFlag && flagAI && additionalCondition(null))
  stopAI()
}

function checkIfMatch() {
  let successFlag = false
  let whichNode = 0
  for(let i = 0; i < POPULATION; i++) {
    if(generation[i].phrase.join('') === word) {
      successFlag = true
      whichNode = i
      bestPhrase = generation[i].phrase.join('')
      updateInfo()
      stopAI()
    }
  }
  return {successFlag, whichNode}
}

function breed(parent1, parent2) {
  let newGenerationKid
  let wordSize = parent1.length
  let p1slice = parent1.slice(0, wordSize/2)
  let p2slice = parent2.slice(wordSize/2)
  newGenerationKid = p1slice.concat(p2slice)
  return newGenerationKid
}