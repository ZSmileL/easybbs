<template>
    <div class="containner">
        <div v-if="modelValue" class="file-name">{{ modelValue.name }}</div>
        <template v-else>
            <el-upload
            ref="upload"
            :auto-upload="true"
            :show-file-list="false"
            accept=".zip, .rar"
            :http-request="uploadAttachment"
            >
            <div class="upload-attachment-btn">
                选择文件
            </div>
        </el-upload>
        </template>
       <span v-if="modelValue" class="iconfont icon-del" @click="delAttachment"></span>
        
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue"
const { proxy } =getCurrentInstance();
const props = defineProps({
    modelValue:{
        type:Object,
        default:null
    },
});
const emits = defineEmits();
const uploadAttachment = async (file)=>{
    emits("update:modelValue",file.file);
}
const delAttachment = ()=>{
    emits("update:modelValue",null);
}
</script>

<style lang="scss" scoped>
.containner{
display: flex;
justify-content: space-between;
    width: 100%;
    height: 100%;
    .file-name{
        color: var(--link);
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
    }
        .upload-attachment-btn{
            width: 80px;
            text-align: center;
            border-radius: 5px;
            border: 1px solid #ccc;
            background: var(--link);
            color: #fff;
    }
    .iconfont{
    color: var(--link);
    cursor: pointer;
    }
}
</style>