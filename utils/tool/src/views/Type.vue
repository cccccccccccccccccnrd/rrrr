<template>
  <div
    class="view-type"
    :style="`font-family: ${serif}; font-size: ${size}px`"
  >
    <div class="ui">
      <input
        v-model="edit"
        type="checkbox"
        name="stroke"
      >
      <select
        v-model="serif"
        name="serif"
      >
        <option
          v-for="(type, i) in serifs"
          :key="`serif-${i}`"
          :value="type"
          >{{type}}</option>
      </select>
      <input
        v-model="size"
        type="range"
        min="12"
        max="30"
      >
      <input
        v-model="width"
        type="range"
        min="300"
        max="1000"
      >
    </div>
    <div
      class="editor"
      v-if="edit"
      :style="`width: ${Number(width) + 50}px;`"
    >
      <textarea
        v-model="markdown"
      ></textarea>
    </div>
    <article
      :style="`max-width: ${width}px;`"
    >
      <div class="entry">
        <p class="author">{{ article.author }}</p>
        <h3>{{ article.title }}</h3>
      </div>
      <div 
        v-for="(content, i) in contents"
        :key="`content-${i}`"
      >
        <p
          v-if="content.type === 'text'"
          v-html="content.content.text"
        ></p>
        <h2
          v-if="content.type === 'heading'"
          v-html="content.content.text"
        ></h2>
        <figure
          v-if="content.type === 'image'"
        >
          <img
            :src="content.content.image[0].url"
          />
          <figcaption>{{content.content.caption}}</figcaption>
        </figure>
      </div>
    </article>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const article = ref({})
    const contents = ref([])
    onMounted(async () => {
      const response = await fetch('http://localhost:8000/api/pages/articles+wellness-capitalism-and-the-design-of-the-perfect-user', {
        headers: {
          'Authorization': `Basic ${btoa('hi@auth.com:authauth')}`
        }
      })
      const json = await response.json()
      console.log(json.data.content)
      contents.value = json.data.content.text
      article.value = json.data.content
    })

    const amount = ref(3)
    const serifs = ref(['ABC Arizona Serif Trial', 'Garamond', 'Goudy Old Style', 'Editorial New', 'serif'])
    const serif = ref('ABC Arizona Serif Trial')
    const size = ref('18')
    const width = ref('600')
    const edit = ref(false)
    /* const markdown = ref('Drawing on the notion of biographies of media, the analysis has shown how ELIZA became the subject of competing narratives that contributed, in such a foundational moment for the development of digital media, alternative visions about the impact and implications of computing and AI. Weizenbaum conceived the programme as an artefact illustrating a theory about AI and human-computer interactions, which drew from the behavioural approach in AI to present machine’s intelligence as the result of a deceptive effect. The anecdotal narratives that emerged from his endeavours, however, proved to be only part of the narratives associated with ELIZA. In fact, narratives that presented the programme as an evidence of computer’s intelligence – what Weizenbaum labelled the ‘computer metaphor’ – also characterized the reception of the software. ELIZA became therefore a contested object whose different interpretations reflected and contributed to opposite visions of AI, which were destined to dominate debates about AI in the following decades and up to the present day (Boden, 2016; Dreyfus, 1972; Gunkel, 2012).\n\nIf the narrative of the thinking machine remains one of the dominant way through which AI is discussed and presented to the public (Bory and Bory, 2016), the narrative of deception continues to exercise an important role, too. This is evident, for instance, in the recent controversy about the demonstration in May 2018 of a new project by Google for an AI voice assistant, called Duplex. Similar to home assistants such as Apple’s Siri or Amazon’s Alexa, Google Duplex combines speech recognition, natural language processing and voice synthesizer technologies to engage in conversation with human users. Google CEO Sundar Pichai presented a recording of a conversation in which the programme imitated a human voice to book an appointment with a hair salon. In order to sound more convincing and pass as human, the software included pauses and hesitation, and this strategy appeared to work as the salon representative believed to talk with a real person and accepted the reservation (Google’s AI assistant can now make real phone calls, 2018). \n![O\'Neill cylinder](o-neill-01.jpg)\n Commentaries following the demonstration stressed the importance of Google’s achievements, but also the potential problems of this approach. As critical media scholar Zeynep Tufekci pointed out in a Twitter thread that circulated widely, Duplex operates ‘straight up, deliberate deception’, opening new ethical questions concerning the capacity of users to distinguish between humans and machines. 2 Such questions promise to become more and more relevant, as studies confirm that humans tend to apply social rules and expectations to computers (Nass and Moon, 2000) and as interfaces that talk and listen to users become increasingly available in computers, cars, call centres, domestic environments and toys (Nass and Brave, 2005).\n\n As argued by Zdenek (2003), AI – but the same applies to other types of software depends upon the production of physical as well as discursive artefacts. AI systems are ‘mediated by rhetoric’ (p. 340) because ‘language gives meaning, value and form’ (345) to them. In order to consider the impact and implications of any piece of software, one should trace its history at both a material and a discursive level. A framework based on the notion of the biographies of media provides, in this regard, an exceedingly useful perspective to study software, especially if combined with like-minded approaches that employ the concept of biographies to unveil the changing uses and practices that concern specific pieces of software throughout time (Lesage, 2016). In this regard, the notion of biographies of media has the potential to provide a theoretical framework for exploring through a diachronic perspective both the material and the discursive lives of software artefacts.\n\nIf public conceptions of computing technologies are misguided, he reasoned, then public decisions about the governance of these technologies will likely be misguided as well. As he noted in a conversation with a journalist of The Observer a few years later, experts’ narratives could have practical effects, since ‘language itself becomes merely a tool for manipulating the world, no different in principle from the languages used for manipulating computers’ (Davy, 1982: 22). Weizenbaum’s legacy, in this sense, provides us with a powerful reminder that the use of specific discourses and narratives can have practical effects, much like the instructions coded by a programmer can result in operations that trigger changes in the real world.') */
    /* const html = computed(() => {
      return marked.parse(markdown.value)
    }) */

    return {
      amount,
      serif,
      serifs,
      size,
      width,
      edit,
      contents,
      article
    }
  }
}
</script>

<style scoped>
  .view-type {
    display: flex;
    justify-content: center;
    font-weight: 300;
    padding: 1em;
  }

  article {
    display: flex;
    flex-flow: column nowrap;
    margin: 5em 0 0 0;
  }

  ::v-deep img {
    --width: 60vw;
    width: var(--width);
    max-width: 100vw;
    margin-left: calc(50% - calc(var(--width) / 2));
  }

  ::v-deep sup {
    line-height: 0;
    font-family: sans-serif;
  }

  .entry p {
    margin: 0;
  }

  h2 {
    margin: 0;
    font-size: 1.5em;
    font-weight: 300;
    line-height: 1;
  }

  h3 {
    margin: 0;
    font-size: 2em;
    font-weight: 300;
    line-height: 1;
  }

  select {
    max-width: 6vw;
    text-align: center;
  }

  input[type="range"] {
    max-width: 5vw;
    margin: 0;
    padding: 0;
    filter: grayscale(100);
  }

  select {
    color: black;
    font-size: 12px;
    appearance: none;
  }

  select:focus {
    outline: 0;
  }

  .ui {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 1em;
    font-size: 12px;
  }

  .editor {
    position: fixed;
    top: 50%;
    left: 50%;
    height: 60vh;
    transform: translate(-50%, -50%);
    box-shadow: 0 1em 1em rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border-radius: 15px;
    transition: all 600ms;
  }

  textarea {
    width: 100%;
    height: 100%;
    padding: 2em;
    font-family: 'JetBrains Mono', monospace;
    color: white;
    background: black;
    border: 0;
    resize: none;
  }

  textarea:focus {
    outline: 0;
  }

  .entry {
    margin: 0 0 1em 0;
  }

  .author {
    font-family: sans-serif;
    font-weight: 400;
    text-transform: uppercase;
  }
</style>
