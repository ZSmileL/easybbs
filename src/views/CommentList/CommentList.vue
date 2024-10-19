<template>
    <div class="commentList-containner">
        <div class="comment-Info">
            <div class="title">
                <span style="font-size: 23px; margin-right: 5px;">评论</span>
                <span style="font-size: 14px;">{{ commentCount }}</span>
            </div>
            <div class="tab">
                <span :class="{ active: orderType == 0 }" @click="changeOrderType(0)">热榜</span>
                <el-divider direction="vertical" content-position="left"></el-divider>
                <span :class="{ active: orderType == 1 }" @click="changeOrderType(1)">最新</span>
            </div>
        </div>
        <div class="comment-Input">
            <SendComment :articleId="articleId" :userId="userId" @PostCommentFinish="PostCommentFinish"></SendComment>

        </div>
        <div class="comment-list">
            <DataList :dataSource="commentList" :loading="loading" @loadData="getComment">
                <template #default="{data}">
                    <Comment :articleId="articleId" :comment="data" :showReplyId="showReplyId" @showReply="showReply">
                    </Comment>
                </template>
            </DataList>
        </div>

    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch } from "vue"
import { useStore } from "vuex";
import Comment from "../../components/Comment/Comment.vue";
import SendComment from "../../components/SendComment/SendComment.vue";
const store = useStore();
const { proxy } = getCurrentInstance();
const props = defineProps({
    articleId: {
        type: String
    },
});
const api = {
    loadComment: "/comment/loadComment",
}
const loading = ref(false);
//用户Id
let userId = ref("");
//当前页数
let pageNo = ref(0);
//总页数
const totalPage = ref(0);
//排序方式  0:根据火热程度排序 1:根据时间倒序排
let orderType = ref(0);
//总评论数
let commentCount = ref(0);
//评论列表
const commentList = ref({});
//显示回复评论的一级评论Id
const showReplyId = ref(0);
//获取评论
const getComment = async () => {
    loading.value = true;
    let result = await proxy.Request({
        url: api.loadComment,
        params: {
            articleId: props.articleId,
            pageNo: pageNo.value,
            orderType: orderType.value
        }
    });
    if (!result) {
        return;
    }
    loading.value = false;
    totalPage.value = result.data.pageTotal;
    commentCount.value = result.data.totalCount;
    commentList.value = result.data;
    userId.value = store.getters.getLoginUserInfo ? store.getters.getLoginUserInfo.userId : "";
}
getComment();
//更改排序方式
const changeOrderType = (type) => {
    orderType.value = type;
    getComment();
}
//更改显示回复回复框的一级评论Id
const showReply = (commentId) => {
    showReplyId.value = commentId;
}
//发表评论
onMounted(() => {
});
//评论发布完成
const PostCommentFinish = (resultData) => {
    commentList.value.list.unshift(resultData);
}
watch(() => store.getters.getLoginUserInfo,
    (nVal, oVal) => {
        if (nVal) {
            userId.value = nVal.userId;

        }
    }
)
</script>

<style lang="scss" scoped>
.commentList-containner {
    .comment-Info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .tab {
            margin-left: 25px;
            font-size: 16px;
            cursor: pointer;

            .active {
                color: var(--link);
            }
        }
    }

    .comment-Input {
        width: 100%;
        height: 60px;
    }
}</style>