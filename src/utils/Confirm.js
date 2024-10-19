import { ElMessageBox } from "element-plus";
const confirm = (message, okFn) => {
    ElMessageBox.confirm(
        message,//内容
        "提示",  //标题
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(async()=>{
        okFn();
    }).catch(()=>{
        return ;
    })
}
export default confirm;