<template>
  <div class="rhythm-bank">
    <!-- <el-select class="option-block" v-model="type" :style="{ width: '110px' }">
      <el-option v-for="item in types" :key="item" :label="item" :value="item" />
    </el-select> -->
    <div v-if="isRhythm">
      <el-radio-group class="radio-block" v-model="rhythmIsRepeatOrRandom">
        <el-radio-button
          v-for="i in rhythmIsRepeatOrRandomOptions" :key="i.l"
          :label="i.v">{{i.l}}</el-radio-button>
      </el-radio-group>
      <el-select class="option-block" v-model="rhythmTupletCount" :style="{ width: '130px' }">
        <el-option v-for="i in rhythmTupletCountOptions" :key="i.l" :label="i.l" :value="i.v" />
      </el-select>
      <el-checkbox class="option-block" v-model="rhythm16thOnly" label="仅16分" border></el-checkbox>  
      <el-checkbox class="option-block" v-model="rhythmAddRest" label="休止" border></el-checkbox>  
      <el-checkbox class="option-block" v-model="rhythmAddTupletRest" label="休止3" border></el-checkbox>  
      <el-checkbox class="option-block" v-model="rhythmAddTies" label="连线" border></el-checkbox>  
      <!-- <div>{{notes.length}}条</div> -->
    </div>
    <div v-if="isScale">
      <el-select class="option-block" v-model="scaleRoot">
        <el-option v-for="i in scaleRootOptions" :key="i" :label="i" :value="i" />
      </el-select>
      <el-checkbox class="option-block" v-model="scaleReverse" label="反向" border></el-checkbox>
    </div>
  </div>
</template>

<script lang="ts" src="./RhythmBank.ts">

</script>

<style lang="scss" scoped>
.rhythm-bank {
  display: flex;
  div {
    display: flex;
    line-height: 40px;
  }
}
</style>
