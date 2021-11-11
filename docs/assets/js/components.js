import { createApp } from "https://unpkg.com/petite-vue?module"

function Counter(props) {
  return {
    $template: "#vue-template",
    count: props.initialCount,
    inc() {
      this.count++
    }
  }
}

createApp({
  Counter,
  $delimiters: ["${", "}"]
}).mount()