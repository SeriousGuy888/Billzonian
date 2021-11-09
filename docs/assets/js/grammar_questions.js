const parentDiv = document.querySelector("#grammar-exercises")

console.log("this page supports grammar questions")

let exerciseMaterial,
    exerciseNum,
    correctAnswers,
    seeingResults

const initExercises = material => {
  exerciseMaterial = material ?? exerciseMaterial
  exerciseNum = 0
  correctAnswers = 0
  seeingResults = false

  refreshExercise();
}

const refreshExercise = () => {
  if(seeingResults) {
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
    const currentExercise = exerciseMaterial[exerciseNum]
    
    let answersHtml = ""
    for(let answer of currentExercise.answers.sort(() => Math.random() - 0.5)) { // loop through shuffled array of answers
      answersHtml += `
        <p class="exercise-answer ${answer.akrat ? 'akrat' : 'unkrat'}" onclick="if(revealAkrats(${!!answer.akrat})) this.classList.add('chosen')">
          ${answer.content}
        </p>
      `
    }
  
    parentDiv.innerHTML = `
      <div id="exercise-header">
        <h4>Question ${exerciseNum + 1} of ${exerciseMaterial.length}</h4>
        <p id="next-button" class="hidden" onclick="nextButton()">
          ${exerciseNum + 1 === exerciseMaterial.length ? 'Final Score' : 'Next Question'}
        </p>
      </div>
      <strong><p>${currentExercise.question}</p></strong>
      
      <!-- thu loke c akrats with inspekt element? thu a master hakkeur bea -->
      <div id="exercise-answers">
        ${answersHtml}
      </div>
    `
  }
}

// returns true if the answer was successfully revealed
// returns false if the answer was already revealed
const revealAkrats = (clickedAkrat) => {
  const answersDiv = document.querySelector("#exercise-answers")
  if(answersDiv.classList.contains("revealed"))
    return false

  answersDiv.classList.add("revealed")
  document.querySelector("#next-button").classList.remove("hidden")
  if(clickedAkrat) {
    correctAnswers++
  }

  return true
}

const nextButton = () => {
  if(exerciseNum + 1 === exerciseMaterial.length) // end of exercises- see results
    seeingResults = true
  else
    exerciseNum++
  refreshExercise()
}