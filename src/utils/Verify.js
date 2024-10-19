const regs = {
    email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/,
}
const verify = (rule,value,reg,callback)=>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            callback(new Error(rule.message))
        }
    }else{
        callback();
    }
}
export default{
    email: (rule,value,callback)=>{ return verify(rule,value,regs.email,callback)},
    password: (rule,value,callback)=>{ return verify(rule,value,regs.password,callback)},
}