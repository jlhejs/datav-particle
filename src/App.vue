<script setup>
import { ref, onMounted } from 'vue'
import * as DatavParticle from '../package/index'
const rise = ref()
onMounted(() => {
  console.log(rise.value)
  new DatavParticle.textLine({
    el:rise.value,
    textColor:"#adcf12",
    textSize:200,
    speed: 0.2
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
