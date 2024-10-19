<template>
    <div class="containner">
        <div class="post-edit">
            <el-card shadow="always">
                <template #header>
                    <div class="editor-header">
                        <span>正文</span>
                        <span class="a-link">
                            <span class="iconfont icon-change"></span>
                            <span v-show="editType == 1" @click="changeEdit(0)">切换为富文本编辑器</span>
                            <span v-show="editType == 0" @click="changeEdit(1)">切换为MarkDown编辑器</span>
                        </span>
                    </div>
                </template>
                <EditMarkDown @htmlContent="setMarkDownContent"  height="100vh" v-model="editText" v-show="editType == 1"></EditMarkDown>
                <EditHtml height="100vh" v-model="editText" v-show="editType == 0"></EditHtml>
            </el-card>

        </div>
        <div class="post-setting">
            <el-card shadow="always">
                <template #header>
                    <div>
                        <span>设置</span>
                    </div>
                </template>
                <el-form :model="settingFormData" ref="settingFormDataRef" :rules="rules" :inline="false" label-width="60px">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="settingFormData.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="板块" prop="section">
                        <el-cascader :options="sectionList" :props="sectionProps" v-model="settingFormData.section"
                            placeholder="请选择板块"></el-cascader>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <CoverUpload v-model="settingFormData.cover"></CoverUpload>
                    </el-form-item>
                    <el-form-item label="摘要" prop="summary">
                        <el-input type="textarea" resize="none" :rows="5" v-model="settingFormData.summary"
                            placeholder="请输入摘要" :maxlength="150" :show-word-limit="true">
                        </el-input>

                    </el-form-item>
                    <el-form-item label="附件" prop="attachment">
                        <AttachmentUpload v-model="settingFormData.attachment"></AttachmentUpload>
                    </el-form-item>
                    <el-form-item label="积分" prop="integral" v-if="settingFormData.attachment">
                        <el-input v-model="settingFormData.integral" placeholder="" ></el-input>
                        <span class="tips">附件下载积分,0表示无需积分下载</span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style=" width: 100%;" @click="PostHandler">保存</el-button>
                    </el-form-item>


                </el-form>
            </el-card>


        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, nextTick } from "vue"
import { ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const settingFormData = ref({});
const settingFormDataRef = ref();
const rules = {
    title: [
        { required: "true", message: "标题不能为空" }
    ],
    section: [
        { required: "true", message: "板块不能为空" }
    ],
    integral: [
        { required: "true", message: "请输入下载所需积分" }
    ]
}
const api = {
    loadSection: "/forum/loadBoard4Post",
    articleDetail4Update: "/forum/articleDetail4Update",
    postArticle: "/forum/postArticle",
    updateArticle: "/forum/updateArticle"
}
// 编辑器类型 MarkDown:1  富文本：0
const editType = ref(proxy.VueCookies.get("editType") || 0);
//切换编辑器
const changeEdit = (type) => {
    proxy.Confirm("切换编辑器会清空编辑中的内容，确定要切换吗？", () => {
        editType.value = type;
        proxy.VueCookies.set("editType", editType.value);
        editText.value = "";
    })
}
//板块
const sectionProps = {
    multiple: false,
    checkStrictly: true,
    value: "boardId",
    label: "boardName"
}
const sectionList = ref([]);
const loadSection = async () => {
    let result = await proxy.Request({
        url: api.loadSection,
    });
    if (!result) {
        return;
    }
    sectionList.value = result.data;
}
loadSection();
//编辑器内容
const editText = ref("");
//修改文章Id
let articleId = ref("");
//获取修改文章信息
const getArticleDetail = () => {
    nextTick(async () => {
        settingFormDataRef.value.resetFields();
        //编辑
        if (articleId.value) {
            let result = await proxy.Request({
                url: api.articleDetail4Update,
                params: {
                    articleId: articleId.value,
                },
            })
            if(!result){
                router.back();
                return ;
            }
            let articleInfo = result.data.forumArticle;
            //设置编辑器
            editType.value = articleInfo.editorType||0;
            //板块
            articleInfo.section = [articleInfo.pBoardId];
            if(articleInfo.boardId){
            articleInfo.section.push(articleInfo.boardId);
            }
            //封面
            articleInfo.cover = { imgUrl:articleInfo.cover }
            //附件
            if(articleInfo.attachmentType){
                articleInfo.attachment = result.data.attachment;
                articleInfo.attachment.name = articleInfo.attachment.fileName;
                articleInfo.integral = articleInfo.attachment.integral;
            }
            //文本内容
            editText.value = articleInfo.content;
            //设置
            settingFormData.value = articleInfo;

        } else {          //新增
            settingFormData.value = {};
            editText.value = "";
        }
    })
}
//获取markDown内容（html）
const setMarkDownContent = (htmlContent)=>{
    settingFormData.value.content = htmlContent;
}
//监听route 判断是修改还是新增；
watch(() => route, (nVal, oVal) => {
    if (nVal.path.indexOf("/newPost") != -1 || nVal.path.indexOf("/editPost") != -1) {
        articleId.value = nVal.params.articleId;
        getArticleDetail();
    }
}, {
    immediate: true,
    deep: true
})
//保存
const PostHandler = ()=>{
    settingFormDataRef.value.validate(async (validate)=>{
        if(!validate){
            return;
        }
        let params = {};
        Object.assign(params,settingFormData.value);
        //附件  修改文章时如果没有改变附件，附件类型不为File此时不用携带附件参数
        if(!(params.attachment instanceof File)){
            delete params.attachment;
        }
        if(params.attachment){
            params.attachmentType = 1;
        }else{
            params.attachmentType = 0;
        }
        
        //封面
        if(!(params.cover instanceof File)){
            delete params.cover;
        }
        //板块
        params.pBoardId = params.section[0];
        if(params.section.length == 2){
            params.boardId = params.section[1];
        }
        delete params.section;
        //编辑器类型
        params.editorType = editType.value;
        //markdown原生内容
        params.markdownContent = editText.value;
        const contentText = params.content.replace(/<(?!img).*?>/g,"");
        if(contentText == ""){
            proxy.Message.warning("正文不能为空");
            return;
        }
        if(articleId.value){
            params.articleId = articleId.value;
        }
        let result = await proxy.Request({
            url:articleId.value ? api.updateArticle : api.postArticle,
            params,
        })
        if(!result){
            return ;
        }
        proxy.Message.success("保存成功");
        router.push({name:"articleDetail", params:{ articleId:(params.articleId ? params.articleId : result.data) }})

        
    })
}

</script>

<style lang="scss" scoped>
.containner {
    display: flex;

    :deep(.el-card) {
        min-height: calc(100vh - 200px);
        max-height: calc(100vh - 60px);
    }

    :deep(.el-card__header) {
        padding: 10px;
        font-size: 16px;

    }

    :deep(.el-card__body) {
        padding: 5px;
        height: 100%;
    }

    .post-edit {
        flex: 1;

        .editor-header {
            display: flex;
            justify-content: space-between;
        }
    }

    .post-setting {
        width: 450px;
        margin-left: 10px;
        max-height: 80vh;
        overflow-y: scroll;

        .tips {
            font-size: 13px;
            color: #969696;
        }
    }
}
</style>