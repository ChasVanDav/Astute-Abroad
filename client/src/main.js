import "./style.css"
import astuteAbroadLogo from "/favicon.png"
import { setupCounter } from "./counter.js"

document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://github.com/ChasVanDav/AstuteAbroad" target="_blank">
      <img src="${astuteAbroadLogo}" class="logo" alt="Vite logo" />
    </a>
    <h1>Welcome to Astute Abroad</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector("#counter"))
