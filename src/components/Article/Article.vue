<template>
    <div class="container">
       <div class="article-item">
        <div class="article-item-inner">
            <div class="article-item-body">
                <div class="userInfo">
                    <Avatar :userId="article.userId" :width="30"></Avatar>
                    <a href="javascript:;" class="alink nickName">{{ article.nickName }}</a>
                    <el-divider direction="vertical"></el-divider>
                    <span class="postTime">{{ article.postTime }}</span>
                    <span class="postIp">&nbsp;·&nbsp;{{ article.userIpAddress }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="boreder">
                        <router-link :to="`/forum/${article.pBoardId}`" class="alink">{{ article.pBoardName }}</router-link>
                        <span class="boardDivider" v-if="article.boardName">/</span>
                        <router-link :to="`/forum/${article.pBoardId}/${article.boardId}`" class="alink">{{ article.boardName }}</router-link>
                    </span>
                </div>
                <router-link :to="`/post/${article.articleId}`" class="alink title">{{ article.title }}</router-link>
                <div class="summary">{{ article.summary }}</div>
                <div class="articleInfo">
                    <span class="iconfont icon-eye-solid">{{article.readCount}}</span>
                    <span class="iconfont icon-good">{{article.goodCount}}</span>
                    <span class="iconfont icon-comment">{{article.commentCount}}</span>
                </div>
            </div>
            <router-link to="/" v-if="article.cover">
                <div class="cover">
                    <el-image :src="imgSrc" fit="cover" :lazy="true"></el-image>
                </div>
            </router-link>
        </div>
       </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const {proxy} = getCurrentInstance();
const imgSrc=proxy.globalInfo.imgUrl+props.article.cover;
const props=defineProps({
    article:{
        type:Object
    }
})
</script>

<style lang="scss" scoped>
.container{
    .article-item{
        margin-top: 15px;
        border-bottom: 1px solid #ddd;
        .article-item-inner{
            display: flex;
            justify-content: space-between;
            color:#86909c;
            padding-left: 20px;
            .article-item-body{
                .userInfo{
                    display: flex;
                    margin-bottom: 10px;
                    align-items: center;
                    font-size: 14px;
                    .nickName{
                        margin-left: 5px;
                    }
                    .postTime{
                        font-size: 13px;
                    }
                    .postIp{
                        font-size: 13px;
                    }
                    .boardDivider{
                        margin: 0 5px;
                    }
                }
                .title{
                font-weight: 700;
                color: #4a4a4a;
                font-size: 16px;
                }
                .title:hover{
                    color: var(--link);
                }
                .summary{
                    margin-top: 10px;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .articleInfo{
                    margin-bottom: 10px;
                    .iconfont{
                    font-size: 14px;
                        margin-right: 25px;
                        padding-right: 5px;
                    }
                    .iconfont::before{
                        margin-right: 4px;
                    }
                }
            }
            .cover{
                margin-right: 20px;
                width: 100px;
                height: 100px;
                .el-image{
                    width: 100%;
                    height: 100%;
                }
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
.alink:hover{
    color: var(--link);
}
</style>