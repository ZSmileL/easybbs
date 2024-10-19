<template>
    <v-md-editor
    v-model="text"
    mode="editable"
    :height="height"
    :include-level="[1,2,3,4,5,6]"
    @blur="setText"
    @change="changeText"
    ></v-md-editor>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';


VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
const props = defineProps({
    height:{
        type:String,
        default:""
    },
    modelValue:{
        type:String,
    }
})
let text = ref(props.modelValue);
watch(()=>props.modelValue,
(nVal,oVal)=>{
    text.value = nVal;
},
{
    immediate:true
})
const emits = defineEmits();
const changeText = (mdText,htmlText)=>{
    // emits("update:modelValue",mdText);
    emits("htmlContent",htmlText);
}
const setText = ()=>{
    emits("update:modelValue",text.value);
}
</script>

<style lang="scss" scoped>

</style>