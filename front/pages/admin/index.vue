<template>
  <div class="mb-4 flex flex-row justify-end w-full"> <button
      class="break-keep cursor-pointer hover:bg-white hover:text-black whitespace-nowrap p-2 font-[m] text-[12px] uppercase"
      @click="logout">Logout</button>
  </div>
  <div class="flex flex-col gap-8 mb-8">
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
