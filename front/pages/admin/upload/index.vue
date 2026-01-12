<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col rounded-lg gap-4 border border-current p-4">
      <h1 class="text-4xl leading-none">Upload Articles</h1>
      <label class="flex flex-row gap-4 text-3xl font-serif">
        <input type="file" @change="handleFiles" webkitdirectory directory multiple class="hidden" />
        <p class="border-b border-dotted w-fit hover:bg-white hover:text-black cursor-pointer">Upload folder</p>
        <p v-if="!uploads.length">-</p>
        <p v-if="!uploads.length">no folder selected</p>
      </label>
      <p>
      <p class="mt-1 sans-serif text-base leading-none">
        Select a folder containing .docx files and their associated assets (images, etc.). Each .docx file will be
        processed and uploaded as an article.
      </p>
      </p>
    </div>

    <div v-if="uploads.length" class="flex flex-col rounded-lg gap-4 border border-current p-4">
      <div class="space-y-4">
        <div v-for="upload in uploads" :key="upload.filename">
          <div class="flex items-center justify-between mb-2">
            <span>{{ upload.filename }}</span>
            <span :class="[
              'px-2 py-1 rounded text-sm',
              statusColor(upload.status)
            ]">
             {{ upload.status }}
            </span>
          </div>
          <div v-if="upload.article" class="text-sm  sans-serif leading-none">
            Article: {{ upload.article.title }}
          </div>
          <div v-if="upload.error" class="text-sm sans-serif leading-none">
            Error: {{ upload.error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const uploads = ref([])

async function handleFiles(event) {
  const allFiles = Array.from(event.target.files)

  const filesByFolder = {}
  allFiles.forEach(file => {
    const pathParts = file.webkitRelativePath.split('/')
    const folderName = pathParts[0]

    if (!filesByFolder[folderName]) {
      filesByFolder[folderName] = []
    }
    filesByFolder[folderName].push(file)
  })

  for (const [folderName, files] of Object.entries(filesByFolder)) {
    const docxFiles = files.filter(f => f.name.endsWith('.docx') && !f.name.includes('~$'))

    for (const docxFile of docxFiles) {
      const uploadItem = {
        filename: docxFile.name,
        status: 'uploading',
        article: null,
        error: null
      }
      uploads.value.push(uploadItem)

      try {
        const formData = new FormData()
        formData.append('docx', docxFile)

        files.forEach(file => {
          if (file !== docxFile) {
            formData.append('files', file, file.name)
          }
        })

        // const response = await $fetch('/api/admin/upload', {
        //   method: 'POST',
        //   body: formData,
        //   onUploadProgress: (progress) => {
        //     uploadItem.progress = Math.round((progress.loaded / progress.total) * 100)
        //   }
        // })

        uploadItem.status = 'completed'
        uploadItem.progress = 100
        uploadItem.article = response.article
      } catch (error) {
        uploadItem.status = 'failed'
        uploadItem.error = error.data?.message || error.message
      }
    }
  }
}

function statusColor(status) {
  return {
    'uploading': 'bg-blue-600',
    'completed': 'bg-green-600',
    'failed': 'bg-red-600'
  }[status]
}
</script>
