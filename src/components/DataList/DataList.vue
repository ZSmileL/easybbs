<template>
    <div>
        <el-skeleton :rows="2" v-if="loading" />
    </div>
    <div class="noData" v-if="!loading&&(dataSource==null||dataSource.list.length==0)">
        <NoData msg="空空如也"></NoData>
    </div>
    <template v-else>
        <div v-for="data in dataSource.list" :key="data.postTime" >
        <slot :data="data"></slot>
    </div>
    <div class="pagination">
        <el-pagination
            @current-change="currentChange"
            v-model:currentPage="dataSource.pageNo"
            layout=" prev, pager, next"
            :total="dataSource.totalCount" background
            :hide-on-single-page="true"
            v-model:page-size="dataSource.pageSize"
            >
        </el-pagination>
        
        
    </div>
    </template>
    
</template>

<script setup>
 const props = defineProps({
    dataSource:{
        type:Object,
    },
    loading:{
        type:Boolean,
    }
 })
 const emits = defineEmits(["loadData"])
 const currentChange=()=>{
    // console.log(props.dataSource.pageNo);
    emits("loadData");
 }
</script>

<style lang="scss" scoped>

</style>