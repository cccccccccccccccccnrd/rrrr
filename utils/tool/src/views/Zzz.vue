<template>
  <div class="view-zzz">
    <div class="ui top">
      <div>
        <input
          v-model="lineJoin"
          type="checkbox"
          name="stroke"
        >
        <input
          type="checkbox"
          name="stroke"
        >
      </div>
      <div style="columns: 2;">
        <p>width <strong>{{width}}</strong></p>
        <p>height <strong>{{height}}</strong></p>
        <p>stroke <strong>{{stroke}}</strong></p>
        <p>rotate <strong>{{stroke}}</strong></p>
      </div>
      <div>
        <button @click="save">download</button>
      </div>
    </div>
    <div class="ui bottom">
      <div>
        <input
          v-model="input"
          type="text"
        />
      </div>
    </div>
    <div id="z">
      <svg
        v-for="i in amount"
        :key="`z-${i}`"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0 0 ${width + stroke / 2} ${height + stroke / 2}`"
        :width="`${width + stroke / 2}`"
        :height="`${height + stroke / 2}`"
        :style="style"
      >
        <polyline
          :style="`stroke-width: ${stroke}px; stroke-linejoin: ${lineJoin ? 'round' : 'bevel'};`"
          :points="`0,${stroke / 2} ${width},${stroke / 2} 0,${height} ${width},${height}`"
          class="z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      document.addEventListener('click', (event) => {
        if (
          event.srcElement.nodeName === 'BUTTON' ||
          event.srcElement.nodeName === 'A' ||
          event.srcElement.nodeName === 'INPUT'
        ) return
        go.value = !go.value
      })

      document.addEventListener('mousemove', (event) => {
        if (!go.value) return

        const x = Math.floor(event.clientX)
        const y = Math.floor(event.clientY)
        
        width.value = x
        height.value = y
        stroke.value = Math.floor(x / scale.value)
      })
    })

    const amount = ref(3)
    const go = ref(true)
    const width = ref(random(100, 500))
    const height = ref(random(100, 500))
    const stroke = ref(random(10, 50))
    const scale = ref(5)
    const lineJoin = ref(true)
    const input = ref('transform: rotate(${stroke}deg);')
    const style = computed(() => {
      const property = input.value.match(/\${\D+}/g)[0].replace('${', '').replace('}', '')
      return input.value.replace(/\${\D+}/g, eval(property).value)
    })

    function random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function download(text, type, name) {
      const a = document.createElement('a')
      a.download = name
      a.href = URL.createObjectURL(new Blob([text], { type }))
      a.dataset.downloadurl = [type, a.download, a.href].join(':')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    function save () {
      const z = document.querySelector('#z')
      const html = `
        <html>
          <head>
            <style>
              html, body {
                margin: 0;
                padding: 0;
              }

              html {
                background: rgba(0, 0, 0, 0.15);
              }

              body {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                transform: scale(0.5);
              }

              .z {
                fill: transparent;
                stroke: black;
              }
            </style>
          </head>
          <body>
            ${z.innerHTML}
          </body>
        </html>`
      download(html, 'text/html', `zzz-${Date.now()}`)
    }

    return {
      amount,
      go,
      width,
      height,
      stroke,
      scale,
      save,
      lineJoin,
      input,
      style
    }
  }
}
</script>

<style scoped>
  .view-zzz {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    cursor: crosshair;
    overflow: hidden;
  }

  p {
    margin: 0;
  }

  input[type="text"] {
    min-width: 30vw;
  }

  #z {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 90vw;
  }

  .z {
    fill: transparent;
    stroke: black;
  }

  .ui {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1em;
    align-items: center;
    padding: 1em;
    text-align: right;
  }

  .ui.top {
    top: 0;
    left: 0;
  }

  .ui.bottom {
    bottom: 0;
    left: 0;
  }
</style>
