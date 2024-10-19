<template>
    <div class="send-comment-panel">
        <div class="avatar">
                <Avatar :userId="userId"></Avatar>
            </div>
            <div class="input">
               <el-form :model="inputCommentForm" :rules="rules">
                <el-form-item label="" prop="inputComment">
                    <el-input type="textarea" v-model="inputCommentForm.inputComment" :placeholder="text" :maxlength="800"
                    :show-word-limit="true" resize="none">
                </el-input>
                </el-form-item>
               </el-form>
               
            </div>
            <div class="send">
                <el-button type="primary" size="small" @click="PostComment">发表</el-button>
            </div>
    </div>
</template>

<script setup>
import {ref, getCurrentInstance, reactive } from 'vue'
const {proxy } = getCurrentInstance();
const api = {
    postComment:"/comment/postComment"
}
//输入的评论内容
const inputCommentForm = reactive({
    inputComment: "",
})
// let inputComment = ref("");
const rules = {
    inputComment:[
        {min: 5,message:"请输入5字以上内容"}
    ]
}
const props = defineProps({
    userId:{
        type:String,
        default:''
    },
    //placeholder
    text:{
        type:String,
        default:"请文明发言，做一个棒棒的程序员"
    },
    //父级评论
    pCommentId:{
        type:Number,
        default:0
    },
    //文章Id
    articleId:{
        type:String,
    },
    //回复用户Id 二级评论
    replyUserId:{
        type:String,
        default:""
    }
    
})
const emits = defineEmits(["PostCommentFinish"])
//发表评论
const PostComment = async ()=>{
    const params = {
        articleId:props.articleId,
        pCommentId:props.pCommentId,
        content:inputCommentForm.inputComment,
        image:"",
    };
    if(props.replyUserId){
        params.replyUserId = props.replyUserId
    };
    const result = await proxy.Request({
        url:api.postComment,
        params:params,
    })
    if(!result){
        return;
    };
    emits("PostCommentFinish",result.data);
    inputCommentForm.inputComment="";
    

}

</script>

<style lang="scss" scoped>
    .send-comment-panel{
        display: flex;
        .input {
            margin: 0 10px;
            flex: 1;

            :deep(.el-textarea__inner) {
                height: 60px;
            }


        }
        .send {
            .el-button {
                width: 60px;
                height: 100%;
                font-size: 16px;
            }
        }
    }
</style>