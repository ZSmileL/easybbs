<template>
   <div class="containner">
    <div class="comment">
        <div class="avatar">
            <Avatar :userId="comment.userId" ></Avatar>
        </div>
        <div class="Info">
            <div class="nickName">{{ comment.nickName }} <span class="author-symbol" v-if="authorId==comment.userId">作者</span></div>
            <div class="content">{{ comment.content }}</div>
            <div class="postInfo">
                <span class="postTime">{{ comment.postTime }}</span>
                <span class="postIp">&nbsp;·&nbsp;{{ comment.userIpAddress }}</span>
                <span class="iconfont icon-good" :class="{ liked: comment.likeType }" @click="doLike(comment)">{{ comment.goodCount
                }}</span>
                <span class="iconfont icon-comment" @click="Reply(comment.commentId,comment.nickName,comment.userId)">回复</span>
                <span>...</span>
            </div>
        </div>
    </div>
    <div class="sub-comment-list" v-if="comment.children">
        <div class="sub-comment-list-item" v-for="sub in comment.children">
            <div class="avatar">
            <Avatar :userId="sub.userId" :width="30"></Avatar>
        </div>
        <div class="Info">
            <span class="nickName">{{ sub.nickName }} <span class="author-symbol" v-if="authorId==sub.userId">作者</span>
            <span class="reply">回复</span>
            <span class="a-link">
                @{{ sub.replyNickName  }}
            </span>
            <span>：</span>
            </span>
            <span class="content">{{ sub.content }}</span>
            <div class="postInfo">
                <span class="postTime">{{ sub.postTime }}</span>
                <span class="postIp">&nbsp;·&nbsp;{{ sub.userIpAddress }}</span>
                <span class="iconfont icon-good" :class="{ liked: sub.likeType }" @click="doLike(sub)">{{ sub.goodCount
                }}</span>
                <span class="iconfont icon-comment" @click="Reply(sub.commentId,sub.nickName,sub.userId)">回复</span>
            </div>
        </div>
        </div>
    </div>
    <div class="sendComment">
    <SendComment :articleId="props.articleId" @PostCommentFinish="postCommentFinish" v-show="showReplyId==comment.commentId" :userId="userId" :text="`回复@${nickName}`" :pCommentId="pCommentId" :replyUserId="replyUserId"></SendComment>
    </div>
   </div>

</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import { useStore } from "vuex";
import SendComment from '../SendComment/SendComment.vue';
import { useRoute } from 'vue-router';
const store = useStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const props = defineProps({
    comment: {
        type: Object
    },
    showReplyId:{
        type:Number,
        default:0
    },
    articleId:{
        type:String,
    },
});
const emits = defineEmits(["showReply"]);
const api = {
    doLike: "/comment/doLike"
}
//登录用户Id
const userId = ref("");
//作者Id
const authorId = ref("");
//父级评论Id
const pCommentId = ref(0);
//父级评论昵称
const pNickName = ref("");
//回复用户Id
const replyUserId = ref("");
//回复用户昵称
const nickName = ref("");
//点赞
const doLike = async (data) => {
    let result = await proxy.Request({
        url:api.doLike,
        params:{
            commentId:data.commentId,
        }
    })
    if(!result){
        return;
    }
    data.likeType = result.data.likeType;
    data.goodCount = result.data.goodCount;
    
}
//回复
const Reply = (commentId,pNickName,userId)=>{ 
    if (!store.getters.getLoginUserInfo) {
        store.commit("updateShowLogin", true);
        return;
    }
    pCommentId.value = commentId;
    nickName.value = pNickName;
    replyUserId.value = userId;
    emits("showReply",props.comment.commentId);
}
//回复结束
const postCommentFinish = (resultData) => {
    if(!props.comment.children){
        props.comment.children = [];
    }
    const children = props.comment.children;
    children.unshift(resultData[resultData.length-1]);
}
onMounted(() => {
  
   authorId.value = sessionStorage.getItem("author");
   userId.value = store.getters.getLoginUserInfo ? store.getters.getLoginUserInfo.userId : "";
})
</script>

<style lang="scss" scoped>
.containner{
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    .comment {
    display: flex;
    margin-top: 20px;
    

    .avatar {
        margin-right: 10px;
    }

    
}
.Info {
        .nickName {
            font-size: 14px;
            color: var(--text2);
            margin-top: 5px;
            cursor: pointer;
            .author-symbol{
                color: #fff;
                background-color: var(--pink);
                padding: 0 3px;
                font-size: 12px;
                border-radius: 2px;
            }
        }

        .content {
            font-size: 16px;
            color: #000;
            line-height: 22px;
            margin-top: 10px;
        }

        .postInfo {
            margin-top: 5px;
            font-size: 13px;
            color: var(--text1);

            .postIp {
                margin-right: 20px;
            }

            .iconfont {
                font-size: 13px;
                margin-right: 15px;
                cursor: pointer;
                &.liked {
                    color: red;
                }
                
            }

            .iconfont::before {
                margin-right: 4px;
                
            }
        }
    }
    .sub-comment-list{
        margin-left: 70px;
        .sub-comment-list-item{
            display: flex;
            margin-top: 10px;
            font-size: 10px;
        }

    }
    .sendComment {
        width: 90%;
        margin-top: 10px;
        margin-left: 60px;
    }
}
</style>