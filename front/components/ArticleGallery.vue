<template>
  <div class="gallery">
    <swiper
      :slides-per-view="'auto'"
      :space-between="0"
      :grab-cursor="true"
      :modules="modules"
      class="swiper"
    >
      <swiper-slide v-for="(image, i) in images" :key="`image-${i}`">
        <figure>
          <img class="gallery-img" :src="image.url" />
          <figcaption>
            <span class="sans-serif-uppercase">FIG {{ getFigNo(image) }}</span>
            {{ image.content.caption }}
          </figcaption>
        </figure>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css/bundle'

export default {
  name: 'ArticleGallery',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    images: Array,
    type: String
  },
  data () {
    return {
      files: [],
      modules: [Pagination]
    }
  },
  computed: {
    slidesAmount () {
      if (this.images.length < 3) {
        return this.images.length
      } else {
        return 3
      }
    }
  },
  mounted () {},
  methods: {
    getFigNo (image) {
      return image.filename.split('-')[0]
    }
  }
}
</script>

<style scoped>
.swiper {
}

img {
  max-width: initial;
  width: auto;
  height: 40vw;
}

.gallery {
  --width: 80vw;
  width: var(--width);
  max-width: 100vw;
  margin-left: calc(50% - calc(var(--width) / 2));
}

.swiper-slide {
  width: auto;
}

figure {
  display: table-caption;
}

figcaption {
  padding: 0 1em 0 0;
}

@media (max-width: 768px) {
  .gallery {
    width: 100%;
    margin: 0;
  }
}
</style>
