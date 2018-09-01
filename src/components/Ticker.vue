<template>
  <div class="hello">
    <button class="control-btn" v-if="!ticking" @click="onStart">Start</button>
    <button class="control-btn" v-else @click="onStop">Stop</button>
    <div class="beat-bar">
      <div v-for="dot in beatDots" :key="dot.key">
        <div class="beat-dot" :class="{'beat-dot-da': dot.v === 1, 'beat-dot-ding': dot.v === 2}" ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Ticker.ts">

</script>

<style>
.control-btn {
  width: 100px;
  height: 100px;
  margin: 20px;
}
.beat-bar {
  margin: auto;
  width: 200px;
  display: flex;
  justify-content: space-between;
}
.beat-dot {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
}
.beat-dot-da {
  background-color: rgb(255, 234, 0);
}
.beat-dot-ding {
  background-color: rgb(39, 196, 8);
}
</style>


