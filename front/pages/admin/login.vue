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
  <div class="flex flex-col rounded-lg gap-4 border p-4">
    <h1 class="text-3xl">Admin Login</h1>
    <div class="space-y-2 max-w-sm">
      <label class="block text-sm">Password</label>
      <div class="flex flex-row items-center gap-2">
        <input
          class="px-3 py-2 border border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-gray-500 rounded"
          type="password" v-model="password" @keyup.enter="login" />
        <button class="py-2 px-4 text-black bg-white border-none text-sm rounded" @click="login">
          Login
        </button>
      </div>
      <p v-if="error" class="text-sm text-red-600">Error: {{ error }}</p>
    </div>
    <p class="text-sm sans-serif leading-none mt-4">
      Enter the admin password to access the admin panel.
    </p>
  </div>
</template>