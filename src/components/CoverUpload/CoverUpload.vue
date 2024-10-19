<template>
    <div class="containner">
        <el-upload
            ref="upload"
            :auto-upload="true"
            :show-file-list="false"
            accept=".bm,.jpg,.png,.tif,.gif,.pcx,.tga,.jpeg"
            :http-request="uploadCover"
            :onChange="changeUploadCover"
            >
             <div class="upload-cover-btn">
                <el-image :src="localSrc" fit="fill" :lazy="true" v-if="localSrc"></el-image>
                <div v-else>
                    <img  v-if="modelValue&&modelValue.imgUrl" :src="(imgUrlPrefix?imgUrlPrefix:proxy.globalInfo.imgUrl)+modelValue.imgUrl"/>
                    <span v-else class="iconfont icon-add"></span>               

                </div>
             </div>
        </el-upload>
        
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue"
const { proxy } =getCurrentInstance();
let localSrc = ref(null);
const props = defineProps({
    modelValue:{
        type:Object,
        default:null
    },
    imgUrlPrefix:{
        type:String
    }, 
});
const emits = defineEmits();
const uploadCover = async (file)=>{
    file=file.file;
    let img = new FileReader();
    img.readAsDataURL(file);
    img.onload = ({target})=>{
        let imgData = target.result;
        localSrc.value = imgData;
    }
    emits("update:modelValue",file);
    
}
const changeUploadCover = (file,fileList) => {
    if (fileList.length > 1) {
         fileList.splice(0, 1);
     };
     
}
</script>

<style lang="scss" scoped>
.containner{
    .upload-cover-btn{
        display: flex;
        width: 150px;
        height: 150px;
        justify-content: center;
        align-items: center;
        background: #ebebeb;
        img{
            width: 100%;
        }
        .iconfont{
            font-size: 50px;
            color:#a4a4a4
        }
    }
}
</style>