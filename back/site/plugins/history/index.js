// Kirby concatenates all plugin index.js files into one classic script, hence the IIFE
;(() => {
panel.plugin('rrrr/history', {
  sections: {
    history: {
      data() {
        return { entries: [], open: null }
      },
      created() {
        this.reload()
        this.$panel.events.on('model.update', this.reload)
      },
      destroyed() {
        this.$panel.events.off('model.update', this.reload)
      },
      methods: {
        async reload() {
          this.entries = (await this.load()).entries
        },
        date: (time) => new Date(time).toLocaleString()
      },
      template: `
        <k-section label="Edit history (last 50 saves)">
          <k-empty v-if="!entries.length" icon="history" text="No changes saved yet" />
          <div v-for="(e, i) in entries" :key="e.time + i" class="k-history-entry">
            <button type="button" @click="open = open === i ? null : i">
              <span>{{ date(e.time) }}</span>
              <span>{{ e.by }}</span>
              <span class="k-history-fields">{{ Object.keys(e.changes).join(', ') }}</span>
            </button>
            <div v-if="open === i">
              <div v-for="(lines, field) in e.changes" :key="field">
                <p class="k-history-field">{{ field }}</p>
                <pre><span v-for="(l, li) in lines" :key="li" :class="'k-history-' + ({ '+': 'add', '-': 'del' }[l[0]] || 'ctx')">{{ l }}
</span></pre>
              </div>
            </div>
          </div>
        </k-section>
      `
    }
  }
})
})()
