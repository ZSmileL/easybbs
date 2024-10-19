<template>
    <div>
        <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :btns="dialogConfig.btns"
            @close="close">

            <el-form class="login-register" :model="formData" ref="loginAndRegisterRef" :rules="rules">
                <!-- 邮箱 公共 -->
                <el-form-item prop="email">
                    <el-input size="large" maxLength="150" placeholder="请输入邮箱" v-model="formData.email">
                        <template #prefix><span class="iconfont icon-email"></span></template>
                    </el-input>
                </el-form-item>
                <!-- 邮箱验证码 注册/重置密码 -->
                <el-form-item prop="emailCode" v-if="opType === 0 || opType === 2">
                    <div class="get-emailCode-panel">
                        <el-input size="large" placeholder="请输入邮箱验证码" v-model="formData.emailCode">
                            <template #prefix><span class="iconfont icon-checkcode"></span></template>
                        </el-input>
                        <el-button type="primary" size="large" @click="showEmailCode"
                            class="get-emailCode-button">获取验证码</el-button>
                    </div>
                    <el-popover placement="left" width="450" trigger="click">
                        <template #reference>
                            <span href="javascript:;" class="a-link"
                                style="font-size: 12px; line-height: normal;">未收到验证码？</span>
                        </template>
                        <div>
                            <p class="item">1、在垃圾箱中查找邮箱验证码</p>
                            <p class="item">2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                            <p class="item">3、将邮箱【laoluo@wuhancoder.com】添加到白名单</p>
                            <p class="item"><a class="a-link" target="_blank"
                                    href="http://easybbs.wuhancoder.com/post/46lrsLUQjQhpZyP">不知道怎么设置？</a></p>
                        </div>
                    </el-popover>
                </el-form-item>
                <!-- 昵称 注册 -->
                <el-form-item prop="nickName" v-if="opType === 0">
                    <el-input size="large" placeholder="请输入昵称" v-model="formData.nickName">
                        <template #prefix><span class="iconfont icon-account"></span></template>
                    </el-input>
                </el-form-item>
                <!-- 密码 注册/重置密码(明文传输) -->
                <el-form-item prop="registerPassword" v-if="opType === 0 || opType === 2">
                    <el-input size="large" show-password placeholder="请输入密码" v-model="formData.registerPassword">
                        <template #prefix><span class="iconfont icon-password"></span></template>
                    </el-input>
                </el-form-item>
                <!-- 密码 登录(加密传输) -->
                <el-form-item prop="loginPassword" v-if="opType === 1">
                    <el-input size="large" show-password placeholder="请输入密码" v-model="formData.loginPassword">
                        <template #prefix><span class="iconfont icon-password"></span></template>
                    </el-input>
                </el-form-item>
                <!-- 确认密码 注册/重置密码 -->
                <el-form-item prop="passwordCheck" v-if="opType === 0 || opType === 2">
                    <el-input size="large" type="password" show-password placeholder="请再次输入密码"
                        v-model="formData.passwordCheck">
                        <template #prefix><span class="iconfont icon-password"></span></template>
                    </el-input>
                </el-form-item>
                <!-- 验证码 公共-->
                <el-form-item prop="checkCode">
                    <div class="checkCode-panel">
                        <el-input size="large" placeholder="请输入验证码" class="checkCode-input" v-model="formData.checkCode">
                            <template #prefix><span class="iconfont icon-checkcode"></span></template>
                        </el-input>
                        <img class="checkCode-image" :src="checkCodeUrl" @click="changeCheckCode(0)" alt="">
                    </div>
                </el-form-item>
                <!-- 去登陆？ 重置密码 -->
                <el-form-item v-if="opType === 0 || opType === 2">
                    <a href="javascript:;" class="a-link" @click="showPanel(1)" v-if="opType === 2">去登陆？</a>
                    <!-- 已有帐号？ 注册-->
                    <a href="javascript:;" class="a-link" @click="showPanel(1)" v-if="opType === 0">已有帐号？</a>
                </el-form-item>
                <!-- 帮助 登录 -->
                <el-form-item v-if="opType === 1" prop="rememberMe">
                    <div class="rememberMe">
                        <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                    </div>
                    <div class="login-question">
                        <a href="javascript:;" class="a-link" @click="showPanel(2)">忘记密码？</a>
                        <a href="javascript:;" class="a-link" @click="showPanel(0)">没有账号？</a>
                    </div>
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item @click="doSubmit">
                    <el-button type="primary" size="large" class="button" v-if="opType === 0">注册</el-button>
                    <el-button type="primary" size="large" class="button" v-if="opType === 1">登录</el-button>
                    <el-button type="primary" size="large" class="button" v-if="opType === 2">重置密码</el-button>
                </el-form-item>
            </el-form>


        </Dialog>
        <Dialog :show="dialogConfig_emialCode.show" :title="dialogConfig_emialCode.title"
            :btns="dialogConfig_emialCode.btns" @close="dialogConfig_emialCode.show = false">
            <el-form :model="emailCodeFormData" ref="emailCodeRef" :rules="rules" style="align-items:center;">
                <el-form-item label="邮箱" prop="email">
                    {{ formData.email }}
                </el-form-item>
                <el-form-item>
                    <el-form-item label="验证码" prop="checkCode">
                        <div class="checkCode-panel">
                            <el-input size="large" placeholder="请输入验证码" class="checkCode-input"
                                v-model="emailCodeFormData.checkCode">
                                <template #prefix><span class="iconfont icon-checkcode"></span></template>
                            </el-input>
                            <img class="checkCode-image" :src="sendEmailCode_checkCodeUrl" @click="changeCheckCode(1)"
                                alt="">
                        </div>
                    </el-form-item>
                </el-form-item>
            </el-form>

        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, nextTick, getCurrentInstance } from "vue"
import md5 from "js-md5"
import {useStore} from 'vuex'
const store = useStore();
const { proxy } = getCurrentInstance();
const opType = ref();
const loginAndRegisterRef = ref();
const emailCodeRef = ref();
const emailCodeFormData = reactive({});
let formData = reactive({});
const rules = {
    email: [
        { required: "true", message: "请输入邮箱" },
        { max: "150", message: "邮箱过长" },
        { validator: proxy.Verify.email, message: "请输入正确的邮箱" }
    ],
    emailCode: [
        { required: "true", message: "请输入邮箱验证码" }
    ],
    nickName: [
        { required: "true", message: "请输入昵称" }
    ],
    loginPassword: [
        { required: "true", message: "请输入密码" }
    ],
    registerPassword: [
        { required: "true", message: "请输入密码" },
        { validator: proxy.Verify.password, message: "请输入正确的密码" }
    ],
    passwordCheck: [
        { required: "true", message: "请输入密码" }
    ],
    checkCode: [
        { required: "true", message: "请输入验证码" }
    ],

}
const api = {
    checkCode: "/api/checkCode",//验证码
    sendEmailCode: "/sendEmailCode",//获取邮箱验证码
    register: "/register",//注册
    login: "/login",//登录
    resetPassword: "/resetPwd",//重置密码
    getUserInfo: "/getUserInfo" //获取用户信息
}
//0注册,1登录,2找回密码
const showPanel = (type) => {
    opType.value = type;
    resetForm();
}
defineExpose({ showPanel });
const dialogConfig = reactive(
    {
        show: false,
        title: "标题"
    }
);
const dialogConfig_emialCode = reactive({
    show: false,
    title: "发送邮箱验证码",
    btns: [
        {
            type: "primary",
            text: "发送验证码",
            click: () => {
                sendEmailCode();
            }
        }
    ]
});
const showEmailCode = () => {
    loginAndRegisterRef.value.validateField("email", (res) => {
        if (!res) {
            return;
        } else {
            dialogConfig_emialCode.show = true;
            nextTick(() => {
                changeCheckCode(1);
                emailCodeRef.value.resetFields();
                emailCodeFormData.email = formData.email

            })
        }
    });
}

//发送邮箱验证码
const sendEmailCode = () => {
    emailCodeRef.value.validateField("checkCode", async (validate) => {
        if (!validate) {
            return;
        }
        let params = { type: opType.value === 0 ? 0 : 1 }
        let result = await proxy.Request({
            url: api.sendEmailCode,
            params: Object.assign(params, emailCodeFormData),
            errorCallback: () => {
                changeCheckCode(1);
            }
        })
        if (!result) {
            return;
        }
        proxy.Message.success("验证码已发送，请前往邮箱查看")
        dialogConfig_emialCode.show = false;
    })
}
//验证码
//登陆注册 type=0
const checkCodeUrl = ref(api.checkCode);
//发送邮箱验证码 type=1
const sendEmailCode_checkCodeUrl = ref(api.checkCode);
const changeCheckCode = (type) => {
    if (type === 0) {
        checkCodeUrl.value = api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
    }
    else if (type === 1) {
        sendEmailCode_checkCodeUrl.value = api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
    }
}
//重置表单
const resetForm = () => {
    dialogConfig.show = true;
    if (opType.value === 0) {
        dialogConfig.title = "注册"
    } else if (opType.value === 1) {
        dialogConfig.title = "登录"
    } else if (opType.value === 2) {
        dialogConfig.title = "重置密码"
    };
    nextTick(() => {
        changeCheckCode(0);
        loginAndRegisterRef.value.resetFields();
        for (let k in formData) {
            formData[k] = '';
        }
       if(opType.value===1){
        let cookieLoginInfo=proxy.VueCookies.get("loginInfo");
        if(cookieLoginInfo){
            if(cookieLoginInfo.rememberMe){
                Object.assign(formData,cookieLoginInfo);
                formData.loginPassword=formData.password
            }
        }
       }
    })

}
//登陆、注册、重置密码
const doSubmit = () => {
    loginAndRegisterRef.value.validate(async (validate) => {
        if (!validate) {
            return;
        }
        let urls = [api.register, api.login, api.resetPassword];
        let params = {};
        Object.assign(params, formData);
        //注册 重置密码
        if (opType.value === 0 || opType.value === 2) {
            params.password = params.registerPassword;
            delete params.registerPassword;
            delete params.passwordCheck;
        };
        //登录
        if (opType.value === 1) {
            /*
            判断登录密码是否和cookie保存的登录密码相等，
            如果相等，则都为md5加密的格式
            如果不相等，将登录密码通过md5加密
            */
            let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
            let cookieLoginPwd = cookieLoginInfo===null?null:cookieLoginInfo.password;
            if (params.loginPassword != cookieLoginPwd) {
                params.password = md5(params.loginPassword);
            }else{
                params.password = params.loginPassword;
            }
            delete params.loginPassword;
        }
        let result = await proxy.Request({
            url: urls[opType.value],
            params: params,
            errorCallback: () => {
                changeCheckCode(0);
            }
        })
        //返回值
        if (!result) {
            return;
        }
        if (opType.value === 0) {
            proxy.Message.success("注册成功，请登录");
            showPanel(1);
        }
        if (opType.value === 1) {
            proxy.Message.success("登录成功");
            let loginInfo = {
                email: params.email,
                password: params.password,
                rememberMe: params.rememberMe
            };
            //选择记住我则将登录信息存入cookie,否则删除cookie中的登录信息
            if (formData.rememberMe) {
                //set(name,value,timer) timer:过期时间 
                proxy.VueCookies.set("loginInfo", loginInfo, "7d");
            } else {
                proxy.VueCookies.remove("loginInfo");
            }
            dialogConfig.show = false;
            store.commit("updateLoginUserInfo",result.data)
        }
        if (opType.value === 2) {
            proxy.Message.success("重置密码成功，请登录");
            showPanel(1)
        }
    })
}
//关闭登录对话框
const close = ()=>{
    dialogConfig.show = false;
    store.commit("updateShowLogin",false);
}

    
</script>

<style lang="scss" scoped>
.login-register {
    .get-emailCode-panel {
        width: 100%;
        display: flex;

        .get-emailCode-button {
            margin-left: 5px;
        }
    }




    .rememberMe {
        width: 100%;
    }

    .login-question {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .button {
        width: 100%;
    }
}

.checkCode-panel {
    width: 100%;
    display: flex;

    .checkCode-image {
        margin-left: 5px;
    }
}

.item {
    line-height: 25px;
}
</style>