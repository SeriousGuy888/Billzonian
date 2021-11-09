const parentDiv = document.querySelector("#grammar-exercises")

let exerciseMaterial,
    exerciseNum,
    correctAnswers,
    viewingFinalScore

let currentExercise

const initExercises = material => {
  exerciseMaterial = material ?? exerciseMaterial
  exerciseNum = 0
  correctAnswers = 0
  viewingFinalScore = false

  refreshExercise()
}

const refreshExercise = () => {
  currentExercise = exerciseMaterial[exerciseNum]

  if(viewingFinalScore) {
    parentDiv.innerHTML = `
      <h4>Results</h4>
      <p>
        You answered
        <strong>${correctAnswers}</strong> of
        <strong>${exerciseMaterial.length}</strong>
        questions correctly.
        <br>
        That is ${Math.round((correctAnswers / exerciseMaterial.length) * 10000) / 100}%! 🎉
      </p>
      <p id="try-again-button" onclick="initExercises()">Try Again</p>
    `
  } else {
    parentDiv.innerHTML = `
      <div id="exercise-header">
        <h4>Question ${exerciseNum + 1} of ${exerciseMaterial.length}</h4>
        <p id="next-button" class="hidden" onclick="nextButton()">
          ${exerciseNum + 1 === exerciseMaterial.length ? 'Final Score' : 'Next Question'}
        </p>
        <p id="submit-button" onclick="revealAkrats()">
          ${currentExercise.type === 'multiple_choice' ? 'Skip' : 'Submit'}
        </p>
      </div>

      <p id="exercise-question">${currentExercise.question}</p>
      <p id="correct-answer"></p>
      <!-- thu loke c akrats with inspekt element? thu a master hakkeur bea -->
    `

    if(currentExercise.type === "multiple_choice") {
      let answersHtml = ""
      for(let answer of shuffle(currentExercise.answers)) { // loop through shuffled array of answers
        answersHtml += `
          <p
            class="exercise-answer ${answer.akrat ? 'akrat' : 'unkrat'}"
            onclick="if(revealAkrats(${!!answer.akrat})) this.classList.add('chosen')"
          >
            ${answer.content}
          </p>
        `
      }
    
      parentDiv.innerHTML += `
        <div id="exercise-answers">
          ${answersHtml}
        </div>
      `
    } else if(currentExercise.type === "arrange") {
      const placedDiv = document.createElement("div")
      placedDiv.id = "exercise-arrange-placed"
      parentDiv.appendChild(placedDiv)


      let optionBlocks = []
      for(let block of shuffle(currentExercise.blocks)) {
        let blockElem = document.createElement("p")
        blockElem.classList.add("exercise-arrange-block")
        blockElem.textContent = block
        blockElem.onclick = () => {
          if(placedDiv.classList.contains("revealed"))
            return
          
          const toggleBetween = ["exercise-arrange-placed", "exercise-arrange-options"]
          // some witchcraft to swap the elem between the two divs
          let newParentId = blockElem.parentElement.id === toggleBetween[0] ?
            toggleBetween[1] :
            toggleBetween[0]
            
          document
            .getElementById(newParentId)
            .appendChild(blockElem)
        }
        optionBlocks.push(blockElem)
      }


      const optionsDiv = document.createElement("div")
      optionsDiv.id = "exercise-arrange-options"
      optionBlocks.forEach(block => optionsDiv.appendChild(block))
      parentDiv.appendChild(optionsDiv)
    } else {
      parentDiv.innerHTML += "borken question D:"
    }
  }
}

// returns true if the answer was successfully revealed
// returns false for multiple choice if the answer was already revealed
const revealAkrats = (clickedAkrat) => {
  let akrat = false
  let revealedElems = [] // the elements which should have the revealed class added to it
  let unkratElems = []
  let akratElems = []

  switch(currentExercise.type) {
    case "multiple_choice":
      const answersDiv = document.querySelector("#exercise-answers")
      if(answersDiv.classList.contains("revealed"))
        return false
      revealedElems.push(answersDiv, ...answersDiv.children)
      akrat = clickedAkrat
      break
    case "arrange":
      const placedDiv = document.querySelector("#exercise-arrange-placed")

      const placedBlocks = []
      placedDiv.childNodes.forEach(n => placedBlocks.push(n.textContent))

      const finalText = placedBlocks.join(" ").toLowerCase()
      const finalAkrats = currentExercise.akrats.map(e => e.toLowerCase().replace(/[^a-z0-9 ]/g, ""))
      
      akrat = finalAkrats.includes(finalText)
      akrat ?
        akratElems.push(placedDiv) :
        unkratElems.push(placedDiv)
      revealedElems.push(placedDiv)

      // reveal correct answers
      const condecension = document.querySelector("#correct-answer")
      condecension.innerHTML = `<strong>Correct Answers:</strong> ${currentExercise.akrats.join(" <small>or</small> ")}`
      break
  }
  
  document.querySelector("#next-button").classList.remove("hidden")
  document.querySelector("#submit-button").classList.add("hidden")
  
  revealedElems.forEach(elem => elem.classList.add("revealed"))
  akratElems.forEach(elem => elem.classList.add("akrat"))
  unkratElems.forEach(elem => elem.classList.add("unkrat"))
  if(akrat)
    correctAnswers++
  return true
}

const nextButton = () => {
  if(exerciseNum + 1 === exerciseMaterial.length) { // end of exercises- see results
    viewingFinalScore = true
  } else {
    exerciseNum++
  }

  refreshExercise()
}

const shuffle = arr => {
  let newArr = arr.map(e => e) // duplicate array so no mutation
  return newArr.sort(() => Math.random() - 0.5) // return shuffled
}