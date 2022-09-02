<script setup>
import { ref, onMounted } from 'vue'
import * as DatavParticle from '../package/index'
const rise = ref()
onMounted(() => {
  console.log(rise.value)
  new DatavParticle.textLine({
    el:rise.value,
    size:900,
    textSize:200,
    speed: 0.8,
    min:1,
    max:10
  })
  rise.value // <div>
})
</script>

<template>
  <div id="rise" ref="rise"></div>
</template>

<style scoped>
#rise{
  width: 1920px;
  height: 1080px;
}
</style>
