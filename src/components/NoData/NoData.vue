<template>
    <div class="noData">
        <span class="iconfont icon-empty"></span>
        <div class="msg">{{msg}}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    msg:{
        type:String
    }
})
</script>

<style lang="scss" scoped>
.noData{
    text-align: center;
    color: #bbb;
    padding-bottom: 20px;
    .icon-empty{
        font-size: 4em;
    }
    .msg{
        color: #909399;
        font-size: 14px;
    }
}
</style>