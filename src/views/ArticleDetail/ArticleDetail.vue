<template>
    <div class="containner" v-if="article.pBoardId">
        <div class="article-main">
            <div class="catalogue" >
                <div class="catalogue-title">目录</div>
                <div class="catalogue-list" >
                <div v-if="catalogues.length==0" class="catalogue-item"> 未解析到目录 </div>
                <template v-else>
                    <div class="catalogue-item" :class="{'catalogue-item-active':  index === currentCatalogusIndex}"
                v-for="(item,index) in catalogues"
                @click="toCatalogueText(item.top,index)"
                 :style="{paddingLeft:item.pad,}"
                 >{{ item.text }}</div>
                </template>
                   
                </div>
            </div>
            <div class="tab">
                <router-link :to="`/forum/${article.pBoardId}`" class="a-link">{{ article.pBoardName }}</router-link>
                <span class="iconfont icon-right"></span>
                <router-link v-if="article.boardId" :to="`/forum/${article.pBoardId}/${article.boardId}`" class="a-link">{{
                    article.boardName }}</router-link>
                <span v-if="article.boardId" class="iconfont icon-right"></span>
                <span>{{ article.title }}</span>
            </div>
            <div class="article-panel">
                <div class="title">{{ article.title }}</div>
                <div class="articleInfo-panel">
                    <Avatar :width="50" :userId="article.userId"></Avatar>
                    <div class="articleInfo">
                        <div class="nickName">{{ article.nickName }}</div>
                        <div class="postInfo">
                            <span class="postTime">{{ article.postTime }}</span>
                            <span class="postIp">&nbsp;·&nbsp;{{ article.userIpAddress }}</span>
                            <span class="iconfont icon-eye">{{ article.readCount }}</span>
                            <router-link :to="`/editPost/${article.articleId}`" v-if="canEdit" class="a-link iconfont icon-edit" >编辑</router-link>
                        </div>
                    </div>

                </div>
                <div class="content" v-html="article.content"></div>
            </div>
            <!-- 附件 -->
            <div class="attachment" id="attachment" v-if="attachment">
                <div class="attachmentTitle">附件</div>
                <div class="attachmentInfo">
                    <span class="iconfont icon-zip"></span>
                    <span class="attachmentName">{{ attachment.fileName }}</span>
                    <span class="attachmentSize">{{ proxy.sizeChange(attachment.fileSize) }}</span>
                    <span class="attachmentIntegral">需要 <i class="Integral">{{ attachment.integral }}</i> 积分</span>
                    <span class="attachmentDownloaded">已下载{{ attachment.downloadCount }}次</span>
                    <el-button type="primary" size="small" @click="downloadAttachment(attachment.fileId)">下载</el-button>

                </div>
            </div>
        </div>
        <!-- 图片预览 -->
        <ImageViewer ref="ImageViewerRef" :imgList="imgList" />
        <!-- 评论 -->
        <div class="comment-panel" id="comment">
            <CommentList :articleId="article.articleId"/>
        </div>
        <div class="quick-panel" :style="{ left: quickPanelLeft }">
            <!-- 点赞 -->
            <div class="quick-item" @click="doLike">
                <el-badge :value="goodCount" :max="99" :is-dot="false" :hidden="article.goodCount == 0" type="info">
                    <span class="iconfont icon-good" :class="{ isLiked: isLiked }"></span>
                </el-badge>
            </div>
            <!-- 评论 -->
            <div class="quick-item" @click="toPosition('comment')">
                <el-badge :value="commentCount" :max="99" :is-dot="false" :hidden="article.commentCount == 0" type="info">
                    <span class="iconfont icon-comment"></span>
                </el-badge>
            </div>
            <!-- 附件 -->
            <div class="quick-item" v-if="attachment" @click="toPosition('attachment')">
                <span class="iconfont icon-attachment"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import hljs from "highlight.js"
import 'highlight.js/styles/atom-one-light.css';
import CommentList from "@/views/CommentList/CommentList.vue"
import { ref, getCurrentInstance, onMounted, nextTick, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex";
const route = useRoute();
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
    getArticleDetail: "/forum/getArticleDetail",
    doLike: "/forum/doLike",
    getUserDownloadInfo: "/forum/getUserDownloadInfo",
    attachmentDownload: "api/forum/attachmentDownload"
}
//点赞数
const goodCount = ref(0);
//评论数
const commentCount = ref(0);
//是否点赞
const isLiked = ref(false);
//图片数组
const imgList = ref([]);
//预览图组件
const ImageViewerRef = ref();
//附件
const attachment = ref({});
//文章详情
const article = ref({});
//目录
const catalogues = ref([]);
//当前位置对应目录
const currentCatalogusIndex = ref("");
//是否能编辑
const canEdit = ref(false);
const getArticle = async () => {
    let articleId = route.params.articleId;
    let result = await proxy.Request({
        url: api.getArticleDetail,
        params: {
            articleId
        }
    })
    if (!result) {
        return;
    }
    article.value = result.data.forumArticle;
    attachment.value = result.data.attachment;
    isLiked.value = result.data.haveLike
    goodCount.value = article.value.goodCount;
    commentCount.value = article.value.commentCount;
    store.commit("setCurrentBoard", article.value.pBoardId);
    store.commit("setCurrentSubBoard", article.value.boardId);
    showImgView();
    codeHighLight();
    getCatalogue();
    sessionStorage.setItem("author",article.value.userId);
    if(store.getters.getLoginUserInfo.userId == article.value.userId){
        canEdit.value = true;
    }
}
//点赞文章
const doLike = async () => {
    if (!store.getters.getLoginUserInfo) {
        store.commit("updateShowLogin", true);
        return;
    }
    let result = await proxy.Request({
        url: api.doLike,
        params: {
            articleId: article.value.articleId
        }
    })
    if (!result) {
        return;
    }
    isLiked.value = !isLiked.value;
    if (isLiked.value) {
        goodCount.value++;
    } else {
        goodCount.value--;
    }
}
//下载附件
const userDownloadInfo = ref();

const downloadAttachment = async (fileId) => {
    if (!store.getters.getLoginUserInfo) {
        store.commit("updateShowLogin", true);
        return;
    }
    //获取用户下载信息
    let result = await proxy.Request({
        url: api.getUserDownloadInfo,
        params: {
            fileId: fileId
        }
    })
    if (!result) {
        return;
    }
    const download = () => {
        document.location.href = api.attachmentDownload + "?fileId=" + fileId
        // window.open(api.attachmentDownload + "?fileId=" + fileId);
        attachment.value.downloadCount++;
    }
    userDownloadInfo.value = result.data;
    //如果是自己发布的，直接下载
    if (store.getters.getLoginUserInfo.userId == article.value.userId) {
        console.log(1111);
        download();
    }
    //如果不是自己发布
    else {
        //判断是否下载过,若是，消耗0积分下载
        if (userDownloadInfo.value.haveDownload) {
            proxy.Confirm("您已下载过该附件，本次将消耗0积分下载", download);
        }
        else {
            //判断积分是否足够
            if (userDownloadInfo.value.userIntegral > attachment.value.integral) {
                proxy.Confirm(`您当前剩余${userDownloadInfo.value.userIntegral}积分，确认消耗${attachment.value.integral}积分下载此附件吗？`, download);
            }
            else {
                proxy.Message.warning(`积分不足！您当前剩余${userDownloadInfo.value.userIntegral}积分`);
            }
        }
    }
}

//显示预览图
const showImgView = () => {
    nextTick(() => {
        const imgs = document.querySelector(".content").querySelectorAll("img");
        imgs.forEach((item, index) => {
            imgList.value.push(item.getAttribute('src'));
            item.addEventListener("click", () => {
                ImageViewerRef.value.show(index);
            })
        })
    })
}
//代码高亮
const codeHighLight = () => {
    nextTick(() => {
        document.querySelectorAll("pre code").forEach((item) => {
            hljs.configure({
                // 忽略未经转义的 HTML 字符
                ignoreUnescapedHTML: true,
            })
            hljs.highlightElement(item);
        })

    })
}
//获取目录
const getCatalogue = ()=>{
    const need = ["H1","H2","H3","H4","H5","H6"];
    nextTick(()=>{
        const contentDom = document.querySelector(".content");
        contentDom.childNodes.forEach((item)=>{
            let tagName = item.tagName;
            if(!tagName){
                return;
            }
            if(need.indexOf(tagName.toUpperCase())!=-1){
                const catalogue = {
                    text:item.innerText,
                    top:item.offsetTop,
                    pad:tagName.substring(1,2)*15+'px',
                }
                catalogues.value.push(catalogue);
            }
        })
    })
}
//点击目录
const toCatalogueText = (top,index)=>{
    window.scrollTo({
        top:top,
        left:0,
        behavior:'smooth'
    });
    currentCatalogusIndex.value = index;

}
//关于目录的窗口滚动事件函数
const windowScrollEvent4Catalogue = ()=>{
    if(catalogues.value.length ==0 ){
        return;
    }
    if(window.scrollY < catalogues.value[0].top){
        currentCatalogusIndex.value = null;
    }
    catalogues.value.forEach((item,index)=>{
            if(window.scrollY>=item.top-20){
                currentCatalogusIndex.value = index;
            }
        })
}
onMounted(() => {
    getArticle();
    window.addEventListener("scroll", windowScrollEvent4Catalogue);
});
onUnmounted(() => {
    window.removeEventListener("scroll", windowScrollEvent4Catalogue);
})
// 快捷操作
const quickPanelLeft = (window.innerWidth - 1300) / 2 - 100 + 'px';
const toPosition = (domId) => {
    document.querySelector("#" + domId).scrollIntoView();
}
</script>

<style lang="scss" scoped>
.containner {
    width: 1300px;
    margin: 10px auto;
    
    .article-main {
        width: 1000px;
        .catalogue{
            padding: 5px;
            width: 280px;
            position: fixed;
            top: 110px;
            right: 100px;
            overflow: auto;
            background: #fff;
            max-height: 500px;
            font-size: 16px;
            .catalogue-title{
                padding: 10px;
                border-bottom: 1px solid #ccc;
                margin-bottom: 5px;
            }
            .catalogue-list{
                padding: 5px;
                font-size: 14px;
                .catalogue-item{
                padding-top: 5px;
                padding-bottom: 5px;
                cursor: pointer;
            }
            .catalogue-item-active{
                background-color: rgba(#ccc,0.4);
                border-left: 2px solid #90b9f6;
            }
            .catalogue-item:hover{
                background-color: rgba(#ccc,0.4);
            }
            }
            
        }
        .tab {
            line-height: 40px;
            font-size: 16px;

            .iconfont {
                margin: 0 10px;
            }
        }

        .article-panel {
            background: #fff;
            padding: 20px;

            .title {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 10px;

            }

            .articleInfo-panel {
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;

                .articleInfo {
                    margin-left: 5px;

                    .nickName {
                        font-size: 14px;
                        color: #4e5969;
                    }

                    .postInfo {

                        margin-top: 5px;
                        color: var(--text2);

                        .iconfont {
                            margin-left: 5px;
                            font-size: 13px;
                            color: #9f9f9f;

                        }

                        .iconfont::before {
                            margin-right: 4px;
                        }
                        .icon-edit{
                            color:var(--link)
                        }
                    }

                }

            }

            .content {
                line-height: 25px;
                font-size: 16px;

                /*在单文件组件，scoped 样式将不会作用于 v-html 里的内容，
            因为 HTML 内容不会被 Vue 的模板编译器解析。
            解决：不使用scoped 或者 使用深度选择器:deep(<inner-selector>)
            */
                :deep(p) {
                    margin: 16px 0;
                }

                :deep(img) {
                cursor: pointer;
                    max-width: 90%;
                    display: block;
                    margin: 0 auto;
                }
            }
        }

        .attachment {
            margin-top: 20px;
            padding: 20px;
            background-color: #fff;

            .attachmentTitle {
                font-size: 18px;
                color: #000;
                margin-bottom: 10px;
            }

            .attachmentInfo {
                display: flex;
                align-items: center;

                span {
                    margin-right: 10px;
                    font-size: 16px;
                    color: #9f9f9f;

                    &.iconfont {
                        color: var(--link);
                    }

                    &.attachmentName {
                        color: var(--link);
                    }

                    &.attachmentIntegral {
                        .Integral {
                            color: red;
                        }
                    }
                }
            }

        }
    }

    .comment-panel {
        margin-top: 20px;
        padding: 20px;
        background-color: #fff;
        width: 1000px;
        
    }

    .quick-panel {
        position: fixed;
        top: 150px;
        left: 50px;

        .quick-item {
            margin-bottom: 40px;
            width: 50px;
            height: 50px;
            text-align: center;
            background-color: #fff;
            border-radius: 50%;
            line-height: 50px;
            cursor: pointer;

            .el-badge {
                :deep(.el-badge__content.is-fixed) {
                    top: 5px;
                    right: 5px;

                }
            }

            .iconfont {
                font-size: 23px;
                color: var(--text2);
            }

            .isLiked {
                color: red;
            }

        }
    }
}
</style>