<template>
  <el-card class="main box-card" body-style="display: flex; flex-direction: column; min-height: 0; height: 100%;">
    <div slot="header">
      <slot name="title">{{ title }}</slot>
    </div>
    <slot></slot>
  </el-card>
</template>

<script>
export default {
  name: 'MainContainer',
  props: {
    title: String
  }
}
</script>

<style scoped>
  .main {
    margin-left: 20px;
    background-color: white;
    font-size: 14px;
    flex: 1;
    display:flex;
    flex-direction: column;
  }
</style>
