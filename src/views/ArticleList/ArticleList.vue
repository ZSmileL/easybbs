<template>
    <div class="container">
        <div class="subBoard" v-if="subBoards.length!=0">
            <router-link :to="`/forum/${pBoardId}`" class="subBoardItem" :class="{active:!boardId}" >全部</router-link>
            <span class="subBoardItem" v-for="subBoardItem in subBoards" >
                <router-link :to="`/forum/${subBoardItem.pBoardId}/${subBoardItem.boardId}`" :class="{active:boardId==subBoardItem.boardId}">{{ subBoardItem.boardName }}</router-link>
            </span>
        </div>
        <div class="top-tab">
            <div class="tab" :class="{active:orderType==0}" @click="changeorderType(0)">热搜</div>
            <el-divider direction="vertical"></el-divider>
            <div class="tab" :class="{active:orderType==1}" @click="changeorderType(1)">发布时间</div>
            <el-divider direction="vertical"></el-divider>
            <div class="tab" :class="{active:orderType==2}" @click="changeorderType(2)">最新</div>
        </div>
        <div class="article-list">
            <DataList :dataSource="articleList" @loadData="getArticle" :loading="loading">
                <template #default="{data}">
                <Article :article="data" :key="data.articleId"></Article>
                </template>
            </DataList>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch } from "vue"
import { useStore } from "vuex";
import { useRoute } from "vue-router"
import Article from "../../components/Article/Article.vue";
const store = useStore();
const route = useRoute();
const { proxy }=getCurrentInstance();
const api = {
    getArticle: '/forum/loadArticle'
}
const loading = ref(false)
const orderType = ref(0);
const pBoardId = ref(0);
const boardId = ref(0);
const subBoards = ref([]);
const setSubBoards = ()=>{
    subBoards.value = store.getters.getSubBoards(pBoardId.value);
}
watch(
    ()=>store.state.boards,
    (newValue,oldValue)=>{
        setSubBoards();
    }
)
//热搜 0/发布时间 1/最新 2
const changeorderType = (type)=>{
    orderType.value = type;
    getArticle();
}
//获取文章
const articleList = ref([]);
const getArticle = async()=>{
    loading.value = true;
    const params={
        pageNo:articleList.value.pageNo||1,
        orderType:orderType.value,
        pBoardId:pBoardId.value||"",
        boardId:boardId.value||""
    }
    let result =await proxy.Request({
    url:api.getArticle,
    params
    })
    loading.value = false;
    if(!result){
        return;
    }
    articleList.value=result.data;
}
//监控路径
watch(
    ()=>route.params,
    (newValue,oldValue) => {
        pBoardId.value = newValue.pBoard;
        boardId.value = newValue.board;
        store.commit("setCurrentBoard",pBoardId.value||0);
        store.commit("setCurrentSubBoard",boardId.value||0);
        setSubBoards();
        getArticle();
    },
    {immediate:true,deep:true}
)
</script>

<style lang="scss" scoped>
.container {
    width: 1300px;
    margin: 10px auto;
    background: #fff;
    

    .subBoard{
        padding: 10px 0;
        background-color: #f3f3f3;
        .subBoardItem{
        padding: 0 10px;
        margin-left: 10px;
        border-radius: 10px;
        background: #fff;
        border: 1px solid #ddd;
        color: #909090;
        font-size: 14px;
        cursor: pointer;
        }
        .active{
            color: var(--link);
        }
    }
    .top-tab {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border-bottom: 1px solid #ddd;

        .tab {
            font-size: 15px;
            cursor: pointer;
        }
        .active{
            color: var(--link);
        }
    }
}
</style>