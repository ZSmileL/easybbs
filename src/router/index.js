import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path:'/',
        name:'layout',
        component:()=> import ('@/views/Layout/Layout.vue'),
        children:[{
            path:"/",
            name:"articleList",
            component:()=>import('@/views/ArticleList/ArticleList.vue')
        },
        {
            path:'/forum/:pBoard',
            name:'board',
            component:()=>import ('@/views/ArticleList/ArticleList.vue'),
        },
        {
            path:'/forum/:pBoard/:board',
            name:'subBoard',
            component:()=>import ('@/views/ArticleList/ArticleList.vue')
        },
        {
            path:'/post/:articleId',
            name:'articleDetail',
            component:()=>import ('@/views/ArticleDetail/ArticleDetail.vue')
        },
        {
            path:'/newPost',
            name:"newPost",
            component:()=>import('@/views/EditPost/EditPost.vue')
        },
        {
            path:'editPost/:articleId',
            name:"editPost",
            component:()=>import('@/views/EditPost/EditPost.vue'),
        },
        {
            path:'user/:userId',
            name:"User",
            component:()=>import('@/views/UserCenter/UserCenter.vue')
        },
        {
            path:'user/message/:msgType',
            name:'Message',
            
        }
    
    ]        
    },
    
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router