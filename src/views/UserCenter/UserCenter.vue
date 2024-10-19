<template>
    <div class="containner">
        <div class="tab">
            <router-link class="a-link" :to="'/'">首页</router-link>
            <span class="iconfont icon-right"></span>
            <span style="color: #9ba7b9;">个人中心</span>
        </div>
        <div class="user-panel">
            <div class="user-info-card">
                <div class="avatar-panel">
                    <div class="a-link edit-userInfo"
                        v-if="store.getters.getLoginUserInfo && userInfo.userId == store.getters.getLoginUserInfo.userId"
                        @click="editDialogConfig.show = true">修改资料</div>
                    <div class="avatar">
                        <Avatar :userId="userInfo.userId" :width="120"></Avatar>
                    </div>
                    <div class="nickName">
                        <div class="name">
                            {{ userInfo.nickName }}
                        </div>
                        <span v-if="userInfo.sex == 1" style="color: skyblue;" class="iconfont icon-man"></span>
                        <span v-if="userInfo.sex == 0" style="color: pink;" class="iconfont icon-woman"></span>
                    </div>
                    <div class="profile">{{ userInfo.personDescription }}</div>
                </div>
                <div class="info-panel">
                    <div class="info-item integral">
                        <span class="iconfont icon-integral">积分</span>
                        <span class="a-link" @click="interalShow">{{ userInfo.currentIntegral }}</span>
                    </div>
                    <div class="info-item good-count">
                        <span class="iconfont icon-like">获赞</span>
                        <span>{{ userInfo.likeCount }}</span>
                    </div>
                    <div class="info-item post-count">
                        <span class="iconfont icon-post">发帖</span>
                        <span>{{ userInfo.postCount }}</span>
                    </div>
                    <div class="info-item register-date">
                        <span class="iconfont icon-register">加入</span>
                        <span>{{ userInfo.joinTime }}</span>
                    </div>
                    <div class="info-item last-login-date">
                        <span class="iconfont icon-login">最后登录</span>
                        <span>{{ userInfo.lastLoginTime }}</span>
                    </div>
                </div>
            </div>
            <div class="user-info-post">
                <el-tabs v-model="activeName" class="post-info-tabs" @tab-click="handle">
                    <el-tab-pane label="发帖" :name="0"></el-tab-pane>
                    <el-tab-pane label="评论" :name="1"></el-tab-pane>
                    <el-tab-pane label="点赞" :name="2"></el-tab-pane>
                    <div class="tab-content">
                        <template v-if="articleList.list">
                            <DataList :dataSource="articleList" @loadData=getArticleList :loading="loading">
                                <template #default=data>
                                    <Article :article="data.data" :key="data.data.articleId"></Article>
                                </template>
                            </DataList>
                        </template>
                    </div>

                </el-tabs>
            </div>
        </div>
        <Dialog :show="editDialogConfig.show" :title="editDialogConfig.title" :btns="editDialogConfig.btns"
            @close="editClose">
            <el-form :model="editUserForm" ref="editUserFormRef">
                <el-form-item label="昵称">
                    <span>{{ editUserForm.nickName }}</span>
                </el-form-item>
                <el-form-item label="头像">
                    <CoverUpload v-model="editUserForm.img" :imgUrlPrefix="proxy.globalInfo.avatarUrl"></CoverUpload>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editUserForm.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" :rows="5" v-model="editUserForm.personDescription" placeholder="请输入简介"
                        :maxlength="100" :show-word-limit="true" resize="none">
                    </el-input>
                </el-form-item>

            </el-form>

        </Dialog>
        <Dialog width="600" :show="integraleditDialogConfig.show" :title="integraleditDialogConfig.title"
            :btns="integraleditDialogConfig.btns" @close="integralClose">
            <el-form :model="integralForm" ref="integralFormRef">
                <el-form-item label="日期" prop="time">
                    <el-date-picker value-format="YYYY-MM-DD" @change="getInteralList" v-model="integralForm.time"
                        type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
                        size="default" />
                </el-form-item>
            </el-form>
            <div class="interal-list">
                <div class="interal-list-item">
                    <div class="interal-type">类型</div>
                    <div class="interal">积分</div>
                    <div class="creat-time">时间</div>
                </div>

                <template v-if="interalList.list">
                    <DataList :dataSource="interalList" @loadData="getInteralList">
                        <template #default="{ data }">
                            <div class="interal-list-item">
                                <div class="interal-type">{{ data.operTypeName }}</div>
                                <div class="interal" :style="{ color: data.integral > 0 ? 'green' : 'red' }"><span
                                        v-if="data.integral > 0">+</span>{{ data.integral }}</div>
                                <div class="creat-time">{{ data.createTime }}</div>
                            </div>
                        </template>
                    </DataList>
                </template>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Article from "../../components/Article/article.vue";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();
const api = {
    getUserInfo: "/ucenter/getUserInfo",
    loadUserArticle: "/ucenter/loadUserArticle",
    editUserInfo: "/ucenter/updateUserInfo",
    getInteralList: "/ucenter/loadUserIntegralRecord",
}
const activeName = ref(0)
//用户信息
const userInfo = ref({});
//文章列表
const articleList = ref({});
//用户Id
const userId = ref(route.params.userId);
//请求等待交互
const loading = ref(true);
//积分记录
const interalList = ref({});
//修改资料对话框配置
const editDialogConfig = ref({
    show: false,
    title: "编辑个人信息",
    btns: [
        {
            type: "primary",
            click: () => {
                editUserInfo();
            },
            text: "确定"
        }
    ]
})
//积分信息对话框
const integraleditDialogConfig = ref({
    show: false,
    title: "查看积分记录",
    btns: [
        {
            type: "primary",
            click: () => {
                integralClose()
            },
            text: "确定"
        }
    ]
})
sessionStorage.setItem("curBoard", -1);
//个人信息
const editUserForm = ref({
    nickName: userInfo.value.nickName,
    img: {
        imgUrl: userId.value,
    },
    sex: userInfo.value.sex,
    personDescription: userInfo.value.personDescription,
})
const editUserFormRef = ref();
//积分信息
const integralForm = ref({});
const integralFormRef = ref();
//获取用户信息
const getUserInfo = async () => {
    store.commit("setCurrentBoard", -1);
    const result = await proxy.Request({
        url: api.getUserInfo,
        params: {
            userId: userId.value,
        }
    });
    if (!result) {
        return;
    }
    userInfo.value = result.data;
    Object.assign(editUserForm.value, userInfo.value)
}
const handle = (tab) => {
    getArticleList(tab.index);
}
//获取文章列表
const getArticleList = async (type = 0) => {
    const result = await proxy.Request({
        url: api.loadUserArticle,
        params: {
            userId: userId.value,
            type,
        }
    })
    if (!result) {
        return;
    }
    articleList.value = result.data;
    loading.value = false;
}
//获取积分记录
const getInteralList = async () => {
    const result = await proxy.Request({
        url: api.getInteralList,
        params: {
            pageNo: interalList.value.pageNo||1,
            createTimeStart: integralForm.value.time ? integralForm.value.time[0] : '',
            createTimeEnd: integralForm.value.time ? integralForm.value.time[1] : '',
        }
    })
    if (!result) {
        return;
    }
    interalList.value = result.data;
}
//修改个人信息
const editUserInfo = async () => {
    const result = await proxy.Request({
        url: api.editUserInfo,
        params: {
            sex: editUserForm.value.sex,
            personDescription: editUserForm.value.personDescription,
            avatar: editUserForm.value.img
        },
    })
    if (!result) {
        return;
    }
    proxy.Message.success("修改成功");
    editClose();
    getUserInfo();
    if (editUserForm.value.img instanceof File) {
        router.go(0);
    }
}
//关闭修改资料对话框
const editClose = () => {
    nextTick(() => {
        editDialogConfig.value.show = false;
        // editUserFormRef.value.resetFields();
        editUserForm.value.nickName = userInfo.value.nickName;
        editUserForm.value.img.imgUrl = userId.value;
        editUserForm.value.sex = userInfo.value.sex;
        editUserForm.value.personDescription = userInfo.value.personDescription;
    })

}
//打开查看积分对话框
const interalShow = () => {
    integraleditDialogConfig.value.show = true;
    getInteralList();
}
//关闭查看积分对话框
const integralClose = () => {
    nextTick(() => {
        integraleditDialogConfig.value.show = false;
        integralFormRef.value.resetFields();
    })
}
onMounted(() => {
    getUserInfo();
    getArticleList();

});
onUnmounted(() => {
    sessionStorage.removeItem('curBoard')

})
//解决路由跳转不刷新页面（原因：路径一样仅参数不同）
watch(() => route.params,
    (nVal, oVal) => {
        router.go(0);
    }
)
watch(()=>interalList.value.pageNo,
(nVal,oVal)=>{
    console.log(nVal,oVal);
})
</script>

<style lang="scss" scoped>
.containner {
    width: 1300px;
    margin: 10px auto;

    .tab {
        font-size: 16px;
        margin: 10px 0;

        .iconfont {
            padding: 0 10px;
            color: #9ba7b9;
        }
    }

    .user-panel {
        display: flex;

        .user-info-card {
            width: 300px;
            margin-right: 10px;

            .edit-userInfo {
                text-align: right;
                font-size: 13px;
            }

            .avatar-panel {
                padding: 10px 0;
                background-color: #fff;

                .avatar {
                    margin: auto;
                }

                .nickName {
                    display: flex;
                    justify-content: center;

                    .name {
                        text-align: center;
                    }

                    font-size: 16px;
                }
            }

            .profile {
                padding: 10px;
                font-size: 14px;
            }

            .info-panel {
                margin-top: 10px;
                background-color: #fff;
                padding: 10px;
                font-size: 13px;

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }

                .iconfont {
                    font-size: 13px;
                }

                .iconfont:before {
                    color: #9ba7b9;
                    font-size: 22px;
                    margin-right: 5px;

                }


            }
        }

        .user-info-post {
            padding: 10px;
            flex: 1;
            background-color: #fff;
        }
    }

    .interal-list {
        margin-top: 20px;

        .interal-list-item {
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
            display: flex;

            .interal-type {
                width: 120px;
            }

            .interal {
                width: 120px;
            }

            .creat-time {
                flex: 1;
                text-align: center;
            }
        }

    }
}</style>