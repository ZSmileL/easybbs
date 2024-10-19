import { createStore } from "vuex";

export default createStore({
    state:{
        loginUserInfo:{},
        showLogin:null,
        boards:[],
        currentBoard:0,
        currentSubBoard:0
    },
    mutations:{
        updateLoginUserInfo(state,data){
            state.loginUserInfo=data;
        },
        updateShowLogin(state,data){
            state.showLogin=data;
        },
        updateBoards(state,data){
            state.boards=data;
        },
        setCurrentBoard(state,data){
            state.currentBoard=data;
        },
        setCurrentSubBoard(state,data){
            state.currentSubBoard=data;
        }
    },
    actions:{

    },
    getters:{
        getLoginUserInfo(state){
            return state.loginUserInfo;
        },
        getSubBoards(state){
            return (boardId)=>{
                let board = state.boards.find(item=>{
                   return  item.boardId==boardId;
                })
                return board?board.children:[];
            }
            
            
        }
    }
})