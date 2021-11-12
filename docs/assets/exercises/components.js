import { createApp } from "https://unpkg.com/petite-vue?module"

function MainPanel() {
  return {
    $template: "#main-panel-template",
    chosenTopic: null,
    chosenTopicData: null,
    questionNumber: 0,
    answerHistory: {
      currentCorrect: false,
      correct: 0,
      total: 0,
    },
    answersRevealed: false,
    selectedAnswer: null,
    selectedArrangement: [],
    topics: {
      present_tense: {
        title: "Present Tense",
      },
      ak_unk: {
        title: "Ak & Unk",
      },
      grammar2: {
        title: "Grammar",
      },
    },
    mounted() {
      const parseQuery = queryString => {
        const query = {}
        const pairs = queryString.replace(/^\?/, "").split("&")
        for(let i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split("=")
          query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "")
        }
        return query
      }

      let topic = parseQuery(window.location.search).topic
      if(topic) {
        this.chooseTopic(topic)
      }
    },
    async chooseTopic(id) {
      this.questionNumber = 0
      this.answerHistory.currentCorrect = false
      this.answerHistory.correct = 0
      this.answerHistory.total = 0

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

      this.initNextQuestion(false) 
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
        if(currentQuestion.type === "arrange") {
          const replacementRegex = /[^a-z0-9 ]/g
          const correctAnswers = currentQuestion.akrats
            .map(e => e
              .toLowerCase()
              .replace(replacementRegex, "")
            )

          const words = this.selectedArrangement.map(e => currentQuestion.blocks[e])
          const answerStr = words.join(" ")
            .toLowerCase()
            .replace(replacementRegex, "")
          
          if(correctAnswers.includes(answerStr)) {
            this.answerHistory.correct++
            this.answerHistory.currentCorrect = true
          }
        }

        this.answerHistory.total++
      } else {
        this.initNextQuestion(true)
      }
    },
    initNextQuestion(incrementQuestionNumber) {
      this.answersRevealed = false
      this.selectedAnswer = null
      this.selectedArrangement = []
      this.answerHistory.currentCorrect = false

      if(incrementQuestionNumber)
        this.questionNumber++

      const currentQuestion = this.chosenTopicData[this.questionNumber]
      if(currentQuestion.type === "multiple_choice") {
        currentQuestion.answers = this.shuffle(currentQuestion.answers)
      }
      if(currentQuestion.type === "arrange") {
        currentQuestion.blocks = this.shuffle(currentQuestion.blocks)
      }
    },
    updateArrangement(index, removing) { // removing means removing from the array of already placed blocks
      if(this.answersRevealed)
        return

      if(removing) {
        this.selectedArrangement.splice(index, 1)
      } else {
        if(!this.selectedArrangement.includes(index))
          this.selectedArrangement.push(index)
      }
    },
    shuffle(arr) {
      let newArr = arr.map(e => e) // duplicate array & prevent mutation
      return newArr.sort(() => Math.random() - 0.5) // return shuffled
    },
  }
}

createApp({ MainPanel }).mount()