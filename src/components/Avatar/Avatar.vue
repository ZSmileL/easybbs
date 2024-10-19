<template>
    <div @click="toUserCenter" class="avatar" :style="{width:width+'px',height:width+'px',borderRadius:'50%' }">
        <el-image 
        :src="avatarUrl" 
        v-if="userId" 
        loading="lazy"
        :style="{width:width+'px',height:width+'px',borderRadius:'50%' }"></el-image>
        <div v-else class="tip" style="text-align: center; width: 100%;">
            未登录
        </div>
    </div>
</template>

<script setup>
import {getCurrentInstance, ref, onMounted, watch} from "vue";
import { useRouter } from 'vue-router'
const {proxy}=getCurrentInstance();
const router = useRouter();
let avatarUrl = proxy.globalInfo.avatarUrl+props.userId;
const props = defineProps({
    userId:{
        type:String
    },
    width:{
        type:Number,
        default:50,
    },
    addLink:{
        type:Boolean,
        default:true,
    }
})
watch(()=>props.userId,
(nVal,oVal)=>{
    avatarUrl = proxy.globalInfo.avatarUrl+nVal;
},
{
    immediate:true,
    deep:true
});
const toUserCenter = ()=>{
    console.log(props.userId);
    router.push(`/user/${props.userId}`);
}
</script>

<style lang="scss" scoped>
.avatar{
    border:"1px solid #ddd";
    background-color: #eee;
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>