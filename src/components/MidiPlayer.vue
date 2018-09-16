<template>
  <div class="midi-player">
    <el-button @click="changeNote(-1)">-</el-button>
    <el-button @click="playNote">{{noteNumber}}</el-button>
    <el-button @click="changeNote(+1)">+</el-button>
    <el-button @click="showScales">Scales</el-button>
  </div>
</template>

<script lang="ts" src="./MidiPlayer.ts">

</script>