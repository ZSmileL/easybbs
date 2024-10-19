import { createApp } from 'vue'
import './style.css'
//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//国际化，element plus 默认英文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//图标 图标在附件中
import '/src/assets/icon/iconfont.css'
import store from './store'
import router from './router'
import App from './App.vue'
import Dialog from "./components/Dialog/Dialog.vue"
import Verify from '@/utils/Verify.js'
import Request from './utils/Request'
import sizeChange from './utils/SizeChange'
import Message from './utils/Message'
import Confirm from './utils/Confirm'
import DateConversion from './utils/DateConversion'
import Avatar from "./components/Avatar/Avatar.vue"
import DataList from "@/components/DataList/DataList.vue"
import NoData from "@/components/NoData/NoData.vue"
import ImageViewer from "@/components/ImageViewer/ImageViewer.vue"
import EditHtml from "@/components/EditTool/EditHtml.vue"
import EditMarkDown from "@/components/EditTool/EditMarkDown.vue"
import CoverUpload from "@/components/CoverUpload/CoverUpload.vue"
import AttachmentUpload from "@/components/AttachmentUpload/AttachmentUpload.vue"
const app=createApp(App);
app.use(router);
app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(store);
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Request = Request;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.sizeChange = sizeChange;
app.config.globalProperties.DateConversion = DateConversion;
app.config.globalProperties.globalInfo={
    avatarUrl:'api/file/getAvatar/',
    imgUrl:'/api/file/getImage/',
}
app.component('Dialog',Dialog);
app.component('Avatar',Avatar);
app.component("DataList",DataList);
app.component("NoData",NoData);
app.component("ImageViewer",ImageViewer);
app.component("EditHtml",EditHtml);
app.component("EditMarkDown",EditMarkDown);
app.component("CoverUpload",CoverUpload);
app.component("AttachmentUpload",AttachmentUpload);
app.mount('#app')