<script setup>
const password = ref('')
const error = ref('')

async function login() {
  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: { password: password.value },
    })

    navigateTo('/admin')
  } catch {
    error.value = 'Wrong password'
  }
}
</script>

<template>
  <input class="text-black" type="password" v-model="password" />
  <button @click="login">Login</button>
  <p v-if="error">{{ error }}</p>
</template>