<script setup>
const route = useRoute()
const { cmsURL } = useRuntimeConfig().public
const email = ref('')
const password = ref('')
const error = ref(route.query.expired ? 'That link has expired, please open the PDF editor again from the Panel.' : '')

const target = computed(() => {
  const to = String(route.query.to || '')
  return to.startsWith('/') && !to.startsWith('//') ? to : '/admin'
})
// The Panel route hands over the Kirby session; it needs an article, otherwise just open the Panel
const kirbyLink = computed(() => {
  const slug = target.value.match(/^\/pdf\/([^/?#]+)/)?.[1]
  return slug ? `${cmsURL}/pdf-editor/${slug}` : `${cmsURL}/panel`
})

async function login() {
  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    navigateTo(target.value)
  } catch {
    error.value = 'Wrong email or password.'
  }
}
</script>

<template>
  <div class="flex flex-col rounded-lg border border-current mx-2 sm:mx-0">
    <h1 class="text-3xl p-4 border-b border-current">PDF editor</h1>
    <div class="p-4 border-b border-current flex flex-col gap-3">
      <p class="font-serif text-xl leading-tight">Already logged into the Kirby Panel? Continue without logging in again.</p>
      <a :href="kirbyLink"
        class="w-fit px-3 py-2 bg-white text-black font-[m] text-[12px] uppercase hover:bg-black hover:text-white border border-white">
        Continue with Kirby →
      </a>
    </div>
    <form class="p-4 flex flex-col gap-3 max-w-sm" @submit.prevent="login">
      <p class="font-serif text-xl leading-tight">Or log in with your Kirby email and password.</p>
      <label class="font-[m] text-[12px] uppercase">Email
        <input v-model="email" type="email" autocomplete="username" required
          class="mt-1 block w-full px-3 py-2 bg-black border border-white rounded normal-case text-base font-sans focus:outline-none">
      </label>
      <label class="font-[m] text-[12px] uppercase">Password
        <input v-model="password" type="password" autocomplete="current-password" required
          class="mt-1 block w-full px-3 py-2 bg-black border border-white rounded normal-case text-base font-sans focus:outline-none">
      </label>
      <button type="submit"
        class="w-fit px-3 py-2 border border-white font-[m] text-[12px] uppercase hover:bg-white hover:text-black">
        Log in
      </button>
      <p v-if="error" class="font-serif text-lg text-red-400">{{ error }}</p>
    </form>
  </div>
</template>
