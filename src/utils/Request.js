import axios from 'axios'
import { ElLoading } from 'element-plus';
import { getCurrentInstance } from 'vue';
import store from '@/store'
import Message from './Message';
const instance = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000,
})
let loading = null;
const contentTypeForm = "application/x-www-form-urlencoded";
const contentTypeJson = "application/json"
//请求拦截器
instance.interceptors.request.use((config) => {
    //需要Loading
    if (config.showLoading) {
        loading = ElLoading.service({
            background: "rgba(0,0,0,0.7)",
            text: "加载中",
        })
    }
    return config;
}, (error) => {
    if (error.config.showLoading && loading)
        Message.error("请求失败")
    return Promise.reject(error);
});
//响应拦截器
instance.interceptors.response.use((response) => {
    const { config } = response;
    if (config.showLoading && loading) {
        loading.close();
    }
    let responseData = response.data;
    if (responseData.code === 200) { return responseData; }
    else if (responseData.code === 901) {
        store.commit("updateShowLogin",true);
        store.commit("updateLoginUserInfo",null);
        return Promise.reject({ showError: false, msg: "登录超时" })
    } else {
        if (config.errorCallback) {
            config.errorCallback();
        }
        return Promise.reject({ showError: config.showError, msg: responseData.info });
    }
}, (error) => {
    if (error.config.showLoading && loading) {
        loading.close();
    }
    return Promise.reject({ showError: true, msg: "网络错误" })
}
);
const request = (config) => {
    const { url, params, dataType, showLoading = true, errorCallback, showError = true } = config;
    let contentType = contentTypeForm;
    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key] = undefined ? "" : params[key]);
    }
    if (dataType != null && dataType === "json") {
        contentType = contentTypeJson;
    }
    let headers = {
        "Content-Type": contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }
    return instance.post(url, formData, {
        headers,
        showLoading,
        errorCallback,
        showError,
    }).catch(error => {
        if (error.showError) {
           Message.error(error.msg);
        }
        return null;
    })
}
export default request;