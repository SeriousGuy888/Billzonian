const fs = require("fs")
const csv = require("csvtojson")

const dictionaryHeaderFile = "./header.txt"
const vocabFile = "../vocabulary.csv"

const dictionaryHeader = fs.readFileSync(dictionaryHeaderFile, "utf-8").toString()
  .replace(/%date/gi, new Date().toISOString().split("T")[0])

if(!fs.existsSync("./output")) {
  fs.mkdirSync("./output")
}


csv()
  .fromFile(vocabFile)
  .then(async words => {
    let dictionaryText = ""

    for(const entry of words) {
      let entryLines = ["\n"]

      const { word, pos, translation, example, notes } = entry

      const fnl = str => str.replace(/\|/g, "\n") // fix new lines function
      const numberise = (str, useLetters, useAsteriskBullets) => {
        const lines = str.split("\n")
        const numberedLines = []
        for(let i in lines) {
          let number = (parseInt(i) + 1).toString() + "."
          if(useLetters) {
            const letters = "abcdefghijklmnopqrstuvwxyz"
            number = letters.charAt(i % letters.length) + "."
          }
          if(useAsteriskBullets) {
            number = "*"
          }

          numberedLines.push(`${number} ${lines[i]}`)
        }

        return numberedLines.join("\n")
      }


      entryLines.push(`§0§l${word} §0§o${pos}`)
      entryLines.push(`§0${numberise(fnl(translation))}`)
      // example && entryLines.push(`§7${numberise(fnl(example), true)}`)
      // notes   && entryLines.push(`§7§o${numberise(fnl(notes), null, true)}`)

      dictionaryText += entryLines.join("\n")
    }

    const fileName = `./output/${Date.now()}.txt`
    fs.writeFile(fileName, dictionaryHeader + dictionaryText, err => {
      if(err)
        return console.log(err)
      console.log(`Written to ${fileName}!`)
    })
  })