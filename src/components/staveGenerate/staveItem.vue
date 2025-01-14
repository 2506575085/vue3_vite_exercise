<script setup lang="ts">
import { computed, PropType, ref } from 'vue'

const props = defineProps({
  gapHeight: {
    type: Number,
    required: true
  },
  type: {
    type: String as PropType<'G' | 'F'>,
    required: true
  },
  /** 0-20  0为下加三线 */
  index: {
    type: Number,
    required: true
  }
})

const G_OFFSET = 3
const F_OFFSET = 5

const offsetCount = computed(() => {
  switch (props.type) {
    case 'G':
      return G_OFFSET
    case 'F':
      return F_OFFSET
  }
})

/**
 * G: 0c 1d 2e | 3f  23e3
 * F: 0C1 1D1 2E1 3F1 4G1 | 5A1  25g1
 */
const nameIndex = computed(() => {
  switch (props.type) {
    case 'G':
      return props.index + G_OFFSET
    case 'F':
      return props.index + F_OFFSET
  }
})

const nameMap = ['c', 'd', 'e', 'f', 'g', 'a', 'b']

//0c 1d 2e | 3f  23e3
function getGName(index: number) {
  return `${nameMap[index % 7]}${Math.floor(index / 7) || ''}`
}

// 0C1 1D1 2E1 3F1 4G1 | 5A1  25g1
function getFName(index: number) {
  const groupIndex = Math.floor(index / 7) - 1
  const nameIndex = index % 7
  if (groupIndex <= 0 ) {
    const name = nameMap[nameIndex].toUpperCase()
    return `${name}${Math.abs(groupIndex) || ''}`
  } else {
    const name = nameMap[nameIndex]
    return `${name}${(groupIndex - 1) || ''}`
  }
}

function getLinePosition(nameIndex: number) {
  const harfGap = props.gapHeight / 2
  return (nameIndex - offsetCount.value) * harfGap - harfGap
}

// 相对位置以下边界为0，向上为正，单位px
// 小于startIndex + 6 offset奇数加下，偶数加中  大于startIndex + 14 offset奇数加上，偶数加中
function getExtraLinePositionList(index: number) {
  const startIndex = offsetCount.value
  if (index < startIndex + 6) {
    const offset = startIndex + 6 - index
    const base = offset % 2
    return Array.from({ length: Math.ceil(offset / 2) }).map((_, i) => {
      return (base === 1 ? 0 : (props.gapHeight / 2) ) + i * props.gapHeight
    })
  } else if (index > startIndex + 14) {
    const offset = index - startIndex - 14
    const base = offset % 2
    return Array.from({ length: Math.ceil(offset / 2) }).map((_, i) => {
      return (base === 1 ? props.gapHeight : (props.gapHeight / 2)) - i * props.gapHeight
    })
  } else {
    return []
  }
}

const name = computed(() => {
  switch (props.type) {
    case 'G':
      return getGName(nameIndex.value)
    case 'F':
      return getFName(nameIndex.value)
  }
})

const nameShow = ref(false)
function showName() {
  nameShow.value = !nameShow.value
}
</script>

<template>
  <div
    class="item_container"
    :style="{ height: `${10 * gapHeight}px` }"
    @click="showName"
  >
    <div
      class="item"
      :style="{ height: `${4 * gapHeight}px`}"
    >
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="name" v-show="nameShow">
      {{ name }}
    </div>
    <div
      class="note"
      :style="{
        bottom: `${getLinePosition(nameIndex)}px`,
        width: `${gapHeight + 2}px`,
        height: `${gapHeight - 4}px`
      }"
    >
      <div
        v-for="bottom in getExtraLinePositionList(nameIndex)"
        :style="{
          bottom: `${bottom - 2}px`,
          width: `${gapHeight + 2}px`
        }"
        class="extra_line"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.item_container {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-right: #000 1px solid;
    .line {
      height: 1px;
      width: 100%;
      background-color: #000;
    }
  }
  .note {
    border-radius: 50%;
    border: 2px solid #000;
    position: absolute;
    display: flex;
    justify-content: center;
    .extra_line {
      position: absolute;
      height: 1px;
      background-color: #000;
    }
  }
  .name {
    position: absolute;
    bottom: -40px;
  }
}
</style>