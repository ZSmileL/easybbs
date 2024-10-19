<template>
    <div>
        <el-image-viewer 
        v-if="previewIndex!=null"
        :url-list="imgList"
        :hide-on-click-modal="true"
        @close="close"
        :initial-index="previewIndex"
        :z-index="1000"
        />
    </div>
</template>

<script setup>
    import { ref } from "vue"
    const poros = defineProps({
        imgList:{
            type:Array,
            default:null,
        },
    });
    const previewIndex = ref(null)
    const show = (index)=>{
        //获取"html"标签：document.documentElement
        document.documentElement.style.overflow = "hidden"
        previewIndex.value = index;
    };
    const close = ()=>{
        document.documentElement.style.overflow = "auto"
        previewIndex.value = null;
    }
     defineExpose({
        show
    })

</script>

<style lang="scss" scoped>

</style>