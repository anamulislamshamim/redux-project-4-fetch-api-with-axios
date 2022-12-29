// async action -api calling
// api url - https://jsonplaceholder.typicode.com/todos
// middleware - redux-thunk
// axios api

const { default: axios } = require("axios");
const { createStore, applyMiddleware } = require("redux");
const { default: logger } = require("redux-logger");
const { default: thunk } = require("redux-thunk");

// constants
const GET_TODOS_REQUEST = "GET_TODOS_REQUEST";
const GET_TODOS_SUCCESS = "GET_TODOS_SUCCESS";
const GET_TODOS_FAILED = "GET_TODOS_FAILED";
const API_URL = "https://jsonplaceholder.typicode.com/todo";

// states
const initialTodosState = {
    isLoading:false,
    error:null,
    todos:[],
};

// actions
const getTodosRequest = () => {
    return {
        type:GET_TODOS_REQUEST,
    };
};
const getTodosFailed = (error) => {
    return {
        type:GET_TODOS_FAILED,
        payload: error,
    };
};
const getTodosSuccess = (data) => {
    return {
        type:GET_TODOS_SUCCESS,
        payload: data,
    }
};

// reducer 
const reducer = (state= initialTodosState, action) => {
    switch(action.type){
        case GET_TODOS_REQUEST:
            return {
                ...state,
                isLoading:true,
            };
        case GET_TODOS_FAILED:
            return {
                ...state,
                isLoading:false,
                error:action.payload,
            };
        case GET_TODOS_SUCCESS:
            return {
                ...state,
                isLoading:false,
                error:null,
                todos:action.payload
            };
        default:
            return state;
    }
};

// async action creator : fetchData();
const fetchData = () => {
    return (dispatch) => {
        dispatch(getTodosRequest());
        axios.get(API_URL)
        .then(res => {
            const titles = res.data.map(todo => todo.title);
            dispatch(getTodosSuccess(titles));
        })
        .catch(error => {
            const errorMessage = (error.message);
            dispatch(getTodosFailed(errorMessage));
        });
    }
}
// store
const store = createStore(reducer, applyMiddleware(logger, thunk));

// store.subscribe()
store.subscribe(() => {
    console.log(store.getState());
});

// dispatch()
store.dispatch(fetchData());