<template>
  <div>
    <router-view />
   </div>
</template>

<script setup>
</script>

<style>
/* .el-button--primary:focus {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #FFF;
}
 
.el-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #FFF;
}
 
.el-button--primary.is-active, .el-button--primary:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #FFF;
} */
.el-button--primary.is-plain:focus {
  background-color: #ecf5ff;
  border-color: #a0cfff;
  color: #409EFF;
} 
.el-button--primary.is-plain:hover{
 background-color: #409EFF;
  border-color: #409EFF;
  color: #FFF;
}
</style>
