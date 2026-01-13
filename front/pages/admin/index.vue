<template>
  <button @click="logout">Logout</button>
  <div class="flex flex-col gap-8">
    <Upload />
    <Pdf />
  </div>
</template>

<script setup>


import Upload from '../../components/utils/upload.vue';
import Pdf from '../../components/utils/pdf.vue';

async function logout() {
  await $fetch('/api/admin/auth/logout', { method: 'POST' })
  navigateTo('/admin/login')
}

definePageMeta({
  middleware: 'admin',
})

</script>
