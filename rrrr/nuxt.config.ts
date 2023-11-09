// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  runtimeConfig: {
    baseURL: process.env.BASE_URL,
    auth: process.env.AUTH
  },
  ssr: false,
  app: {
    head: {
      title: 'rrrreflect Journal of Integrated Design Research',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent'
        },
        { property: 'og:title', content: 'rrrreflect' },
        {
          property: 'og:description',
          content: 'rrrreflect is a digital open-access journal that publishes outstanding works of student design research at KISD under the Creative Commons licence CC-BY. With this design-scientific journal, we open up an experimental field for textual and non-textual forms of knowledge such as image, video and sound. In doing so, we enter into a dialogue with the current discourse on the scientificity of design research and at the same time refer to the sensual dimensions of perception as epistemically constituting.'
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:image',
          content: 'https://emotionalfutures.com/imgs/app/share.png'
        },
        { property: 'og:image:width', content: '1000' },
        { property: 'og:image:height', content: '562' },
        { property: 'og:site_name', content: 'Emotional Futures' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: 'imgs/app/app-192.png' }]
    }
  },
  devServer: {
    port: 4444
  }
})