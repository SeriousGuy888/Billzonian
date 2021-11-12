import { createApp } from "https://unpkg.com/petite-vue?module"

function MainPanel() {
  return {
    $template: "#main-panel-template",
    chosenTopic: null,
    chosenTopicData: null,
    questionNumber: 0,
    answerHistory: {
      correct: 0,
      total: 0,
    },
    answersRevealed: false,
    selectedAnswer: null,
    topics: {
      present_tense: {
        title: "Present Tense",
      },
      grammar: {
        title: "Grammar",
      },
      grammar2: {
        title: "Grammar",
      },
    },
    async chooseTopic(id) {
      if(!id) {
        this.chosenTopic = null
        this.chosenTopicData = null
        return
      }
      const res = await fetch(`./assets/exercises/material/${id}.json`)
        .catch(err => alert(err))
      if(!res.ok || !res.json)
        return alert(`Failed to retrieve exercise materials for exercise ID \`${id}\`.`)
      
      this.chosenTopic = id
      this.chosenTopicData = await res.json()
      this.questionNum = 0
      this.answerHistory.correct = 0
      this.answerHistory.total = 0
    },
    revealAnswers() {
      if(!this.answersRevealed) {
        this.answersRevealed = true

        const currentQuestion = this.chosenTopicData[this.questionNumber]
        if(currentQuestion.type === "multiple_choice") {
          if(currentQuestion.answers[this.selectedAnswer]?.akrat) {
            this.answerHistory.correct++
          }
        }

        this.answerHistory.total++
      } else {
        this.answersRevealed = false
        this.questionNumber++
        this.selectedAnswer = null

        const currentQuestion = this.chosenTopicData[this.questionNumber]
        if(currentQuestion.type === "multiple_choice") {
          currentQuestion.answers = this.shuffle(currentQuestion.answers)
        }
      }
    },
    shuffle(arr) {
      let newArr = []
      for(let i = 0; i < arr.length; i++) {
        let elem = arr[i]
        elem.originalIndex = i
        newArr.push(elem)
      }

      return newArr.sort(() => Math.random() - 0.5) // return shuffled
    },
  }
}

createApp({ MainPanel }).mount()