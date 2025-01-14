<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import StaveItem from './staveItem.vue'
import { randomNum } from '@/utils/index'
const randomInt = randomNum.intFullClose

const GENERATE_COUNT = 20
const GAP_HEIGHT = 20

onBeforeMount(() => {
  generateGList()
  generateFList()
})

const gList = ref<number[]>()
function generateGList() {
  gList.value = Array.from({ length: GENERATE_COUNT })
    .map((_, index) => {
      const nameIndex = randomInt(0, 20)
      // const nameIndex = index - 3
      return nameIndex
    })
}

const fList = ref<number[]>()
function generateFList() {
  fList.value = Array.from({ length: GENERATE_COUNT })
    .map(() => {
      const nameIndex = randomInt(0, 20)
      return nameIndex
    })
}

</script>

<template>
  <div class="container">
    <StaveItem
      v-for="value in gList"
      :index="value"
      :gap-height="GAP_HEIGHT"
      type="G"
    />
  </div>
  <div class="container">
    <StaveItem
      v-for="value in fList"
      :index="value"
      :gap-height="GAP_HEIGHT"
      type="F"
    />
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 50px 0;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  row-gap: 100px;
}
</style>