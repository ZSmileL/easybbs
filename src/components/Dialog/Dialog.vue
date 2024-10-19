<template>
    <div>
        <el-dialog :model-value="show" :title="title" :width="width" :top="top" :modal="true" :close-on-click-modal="false" :lock-scroll="false"
            :draggable="true" :show-close="showCancel" class="dialog" @close="close">
            <div class="dialog-body">
                <slot></slot>
            </div>
            <template #footer v-if="btns.length > 0 || showCancel">
                <div class="dialog-footer">
                    <!-- <el-button type="info" plain v-if="showCancel" @click="close">取消</el-button> -->
                    <el-button v-for="item in btns" :type="item.type" @click="item.click">{{ item.text }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: '标题'
    },
    width: {
        type: String,
        default: '400px'
    },
    top: {
        type: String,
        default: '50px'
    },
    showCancel: {
        type: Boolean,
        default: true
    },
    btns: {
        type: Array,
        default: [],
    }
});
const emit = defineEmits();
const close = () => {
    emit("close");
    
}
</script>
<style lang="scss">
.dialog {
    .el-dialog__body {
        padding: 0;
    }
    .dialog-body {
        padding: 15px;
        // min-height: 30vh;
        max-height: calc(100vh - 250px);
        overflow: auto;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
}
</style> 