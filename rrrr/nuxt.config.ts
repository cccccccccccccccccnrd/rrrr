// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
        { property: 'og:title', content: 'Emotional Futures' },
        {
          property: 'og:description',
          content: 'Emotional Futures is a web-based game which delves into the gamification and commodification of human emotions produced by IRL, a gaming collective under the distributed artistic direction of Marcel Darienzo, Carina Erdmann, Steph Holl-Trieu, Andrew Pasquier, Xiaoji Song, Moritz Tontsch, and Ingeborg Wie Henriksen.'
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
})