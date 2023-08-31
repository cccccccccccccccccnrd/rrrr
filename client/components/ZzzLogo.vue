<template>
  <div
    class="zzz-logo"
    ref="container"
    :style="`max-width: ${containerWidth}px; max-height: ${containerHeight}px;`"
  >
    <div class="zzz-container">
      <svg
        v-for="i in 3"
        :key="`z-${i}`"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0 0 ${width + stroke} ${height + stroke}`"
        :width="width"
        :height="height"
        :style="`transform: rotate(${stroke * 10}deg);`"
      >
        <polyline
          :style="`stroke-width: ${stroke}px; stroke-linejoin: round;`"
          :points="`0,${stroke / 2} ${width + stroke / 2},${stroke / 2} ${stroke / 2},${height} ${width + stroke / 2},${height}`"
          class="z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 150,
      height: 75,
      stroke: 5,
      containerWidth: null,
      containerHeight: null
    }
  },
  mounted () {
    this.containerWidth = this.$refs.container.offsetWidth
    this.containerHeight = this.$refs.container.offsetHeight

    window.addEventListener('resize', (event) => {
      this.containerWidth = null
      this.containerHeight = null
      this.containerWidth = this.$refs.container.offsetWidth
      this.containerHeight = this.$refs.container.offsetHeight
      console.log(this.containerWidth, this.containerHeight)
    })

    document.addEventListener('mousemove', (event) => {
      const x = Math.floor(event.clientX)
      const y = Math.floor(event.clientY)

      this.stroke = Math.floor(this.map(x, 0, window.innerWidth, 2, this.containerWidth / 10))
      this.width = this.map(x, 0, window.innerWidth, this.containerWidth / 3 - 100, this.containerWidth / 3 - 50)
      this.height = this.map(y, 0, window.innerHeight, 20, this.containerHeight / 2 - this.stroke)
    })
  },
  methods: {
    map (n, start1, stop1, start2, stop2) {
      return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
    }
  }
}
</script>

<style scoped>
  .zzz-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .zzz-container {
    /* gap: 0.666em; */
  }

  .z {
    fill: transparent;
    stroke: white;
  }
</style>
