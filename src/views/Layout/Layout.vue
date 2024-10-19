<template>
    <div>
        <div class="header" v-if="isShow">
            <div class="header-content">
                <!-- logo -->
                <router-link to="/" class="logo">
                    <span v-for="(item, index) in logoInfo" :style="{ color: item.color }" :key="index">{{ item.text
                    }}</span>
                </router-link>
                <!-- 板块信息 -->
                <div class="menu-panel">
                    <router-link class="board" to="/" @click="showAllBoard" :class="{active:currentBoard==0}">首页</router-link>
                    <template v-for="board in boardList" :key="board.boardId">
                        <el-popover placement="bottom" :width="200" trigger="hover" v-if="board.children.length > 0">
                            <template v-if="board.children" #reference>
                                <span class="board" :class="{active:currentBoard==board.boardId}" @click="BoardClickHandler(board)">{{ board.boardName }}</span>
                            </template>
                            <div class="sub-board-list">
                                <a href="javascript:;" v-for="sub_board in board.children" class="sub-board" :class="{active:currentSubBoard==sub_board.boardId}" @click="SubBoardClickHandler(sub_board)">{{
                                    sub_board.boardName }}</a>
                            </div>
                        </el-popover>
                        <span v-else class="board" @click="BoardClickHandler(board)" :class="{active:currentBoard==board.boardId}">{{ board.boardName }}</span>
                    </template>

                </div>
                <!-- 登陆注册... -->
                <div class="user-panel">
                    <el-button type="primary" class="btn" @click="newPost">发帖<span class="iconfont icon-add"></span></el-button>
                    <el-button type="primary" class="btn">搜索<span class="iconfont icon-search"></span></el-button>

                    <template v-if="loginUserInfo.userId">
                        <el-dropdown trigger="hover">
                            <!-- 使用el-dropdown时出现黑框，在el-dropdown的下一层标签上应用outline:none;
                             此处在style.css中应用
                        -->
                            <el-badge :value="12" class="item">
                                <span class="el-dropdown-link">
                                    <div class="Message iconfont icon-message"></div>
                                </span>
                            </el-badge>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>回复我的</el-dropdown-item>
                                    <el-dropdown-item>赞了我的文章</el-dropdown-item>
                                    <el-dropdown-item>下载了我的附件</el-dropdown-item>
                                    <el-dropdown-item>赞了我的评论</el-dropdown-item>
                                    <el-dropdown-item>系统消息</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <div class="avatar">
                            <el-dropdown>
                                <Avatar :userId="loginUserInfo.userId"></Avatar>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="router.push(`/user/${loginUserInfo.userId}`)">我的主页</el-dropdown-item>
                                        <el-dropdown-item>退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                        </div>
                    </template>
                    <template v-else>
                        <el-button-group class="btns">
                            <el-button type="primary" plain @click="loginandregister(1)">登录</el-button>
                            <el-button type="primary" plain @click="loginandregister(0)">注册</el-button>
                        </el-button-group>
                    </template>


                </div>
            </div>
           
        </div>
        <LoginAndRegister ref="LoginAndRegisterRef" />
        <div class="body">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue'
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import LoginAndRegister from '../LoginAndRegister/loginandregister.vue';
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
    getUserInfo: '/getUserInfo',
    getBoard: '/board/loadBoard',
    getMsgCount: '/ucenter/getMessageCount'
}
const logoInfo = ref([
    {
        text: 'E',
        color: 'red'
    },
    {
        text: 'a',
        color: 'red'
    },
    {
        text: 's',
        color: 'red'
    },
    {
        text: 'y',
        color: 'red'
    },
]);
//模块：首页0/前端1/后端2/摸鱼3/社区管理4
const currentBoard = ref(store.state.currentBoard);
const currentSubBoard = ref(store.state.currentSubBoard)
const isShow = ref(true);
let loginUserInfo = ref({});
//消息数
const msgCount = ref({});
//获取scrollTop值
const getScrollTop = () => {
    return document.documentElement.scrollTop;
};
const initScrollTop = () => {
    window.addEventListener('scroll', () => {
        let currentSrollTop = getScrollTop();
        if (currentSrollTop > 120) {
            isShow.value = false;
        } else {
            isShow.value = true;
        }
    })
};
//点击首页修改vuex中数据
const showAllBoard = ()=>{
    store.commit("setCurrentBoard",0);
    store.commit("setCurrentSubBoard",0);
}
//一级板块
const BoardClickHandler = (board)=>{
    store.commit("setCurrentBoard",board.boardId);
    router.push({name:"board",params:{'pBoard':board.boardId}});
}
//二级板块
const SubBoardClickHandler = (board)=>{
    store.commit("setCurrentBoard",board.pBoardId);
    store.commit("setCurrentSubBoard",board.boardId);
    router.push({name:"subBoard",params:{'pBoard':board.pBoardId,'board':board.boardId}});
}
//登陆注册
const LoginAndRegisterRef = ref();
const loginandregister = (type) => {
    LoginAndRegisterRef.value.showPanel(type);
}
//获取用户信息
const getUserInfo = async () => {
    let result = await proxy.Request({
        url: api.getUserInfo,
    })
    if (!result) {
        return;
    };
    store.commit("updateLoginUserInfo", result.data)
}
//监控登录状态
watch(() => store.state.loginUserInfo, (newValue, oldValue) => {
    if (newValue !== undefined && newValue != null) {
        loginUserInfo.value = newValue;
    } else {
        loginUserInfo.value = {};
    }
},
    {
        immediate: false,
        deep: true
    })
//监控是否弹出登录框
watch(() => store.state.showLogin, (newValue, oldValue) => {
    if (newValue) {
        loginandregister(1);
    }
})
//监控模块变化
//一级
watch(
    ()=>store.state.currentBoard,
    (newValue,oldValue)=>{
        if(sessionStorage.getItem("curBoard")){
            currentBoard.value=sessionStorage.getItem("curBoard");
        }else{
        currentBoard.value=newValue;

        }
    },
    {
        deep:true,
    }
)
//二级
watch(
    ()=>store.state.currentSubBoard,
    (newValue,oldValue)=>{
        currentSubBoard.value=newValue;
    }
)
//获取板块信息
const boardList = ref([]);
const loadBoard = async () => {
    let result = await proxy.Request({
        url: api.getBoard,
    })
    if (!result) {
        return;
    }
    boardList.value = result.data;
    store.commit("updateBoards",result.data);
}
onMounted(() => {
    initScrollTop();
    getUserInfo();
    loadBoard();
    getMessageCount();
    store.commit("setCurrentBoard",route.params.pBoard||0);
    store.commit("setCurrentSubBoard",route.params.board||0);

});
//发帖
const newPost = ()=>{
    if(!store.getters.getLoginUserInfo){
        loginandregister(1);
        return;
    }
    router.push({name:"newPost"});
}
//获取消息数
const getMessageCount = async()=>{
    const result = await proxy.Request({
        url:api.getMsgCount
    })
    if(!result){
        return;
    }
    msgCount.value = result.data;
}
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 2px 6px #ddd;
    .header-content {
        display: flex;
        justify-content: space-between;
        margin: auto;
        width: 1300px;
        height: 60px;

        .logo {
            display: block;
            margin: 0 10px 0 5px;
            width: 50px;
            text-decoration: none;
            font-size: 35px;
            line-height: 50px;
        }

        .menu-panel {
            width: 800px;
            height: 60px;
            display: flex;
            align-items: center;

            .board {
                margin-left: 10px;
                font-size: 16px;
                color: #61666d;
                cursor: pointer;
            }

            .board:hover {
                color: var(--link);
            }

            .active{
                color: var(--link);
            }

        }

        .user-panel {
            display: flex;
            align-items: center;
            margin-left: 20px;
            width: 300px;
            height: 60px;
            line-height: 50px;

            .btn {
                margin-left: 10px;
                // width: 50px;
            }

            .btns {
                margin-left: 10px;
            }

            .Message {
                margin-left: 5px;
                font-size: 25px;
                cursor: pointer;
                color: #8a919f;
            }

            .Message:hover {
                color: rgba(0, 0, 0, 0.7);
            }

            .avatar {
                margin-left: 20px;
                cursor: pointer;
            }
        }
    }
}

.sub-board-list {
    display: flex;
    flex-wrap: wrap;

    .sub-board {
        padding: 0 10px;
        margin-top: 10px;
        margin-left: 5px;
        border-radius: 10px;
        background: rgb(231, 230, 230);
        border: 1px solid #ddd;
        color: #909090;
    }
    .active{
                color: var(--link);
            }

    .sub-board:hover {
        color: var(--link);
    }
}

.body{
    margin-top: 60px;
    min-height: calc(100vh - 210px);
    overflow: hidden;
}
</style>