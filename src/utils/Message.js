import { ElMessage } from "element-plus";
const showMessage = (message,callback,type)=>{
    ElMessage({
        message,
        type,
        onClose:()=>{
            if(callback){
                callback();
            }
        }
    })
}
const Message = {
    error:(message,callback)=>{
        showMessage(message,callback,"error");
    },
    success:(message,callback)=>{
        showMessage(message,callback,"success");
    },
    warning:(message,callback)=>{
        showMessage(message,callback,"warning");
    }
}
export default Message;