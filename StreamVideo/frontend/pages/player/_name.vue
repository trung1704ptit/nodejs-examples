<template>
  <div class="player">
      <video controls muted autoplay crossorigin="anonymous">
          <source :src="`http://localhost:5000/videos/video/${vidName}`" type="video/mp4">
          <track label="English" kind="captions" srcLang="en"
            :src="`http://localhost:5000/videos/video/${vidName}/caption`"
            default
          >
      </video>
  </div>
</template>

<script>
export default {
    data() {
        return {
            vidName: ''
        }
    },
    mounted() {
        console.log(this.$route.params.name)
        this.vidName=this.$route.params.name
    }
}
</script>

<style scoped>
.played {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2em;
}
video::-webkit-media-text-track-container {
 overflow: visible !important;
 transform: translateX(30%) !important;
 font-size: 16px !important;
}
</style>