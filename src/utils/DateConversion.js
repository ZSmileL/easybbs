// 日期转字符串
const dateConversion ={
    StrToDate:(str)=>{
        return new Date(str);
    },
    DateToStr:(date)=>{
        let str;
        str = date.getFullYear()+"-"+(date.getMonth()+1)+'-'+date.getDate();
        return str;
} 
}
export default dateConversion;