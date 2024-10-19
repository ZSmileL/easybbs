<template>
    <div class="containner">
        <div class="editor-panel">
      <Toolbar style="border: 1px solid #ccc;"
        :editor="editorRef"
        mode="default"
      />
      <Editor

      :style="{height , fontSize:'14px'}"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
        @onChange="changeText"
      />
    </div>
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const editorRef = shallowRef();
let valueHtml = ref(props.modelValue);
// 编辑器配置
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
    scroll: false                  
 }

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const props = defineProps({
    height:{
        type:String,
        default:""
    },
    modelValue:{
        type:String
    }
})
watch(()=>props.modelValue,(nVal)=>{
    valueHtml.value = nVal;
})
const emits = defineEmits();
const changeText = (editor)=>{
    emits("update:modelValue",editor.getText());
}
</script>

<style lang="scss" scoped>

</style>