(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.smRedux = factory());
}(this, function () {
    'use strict';
    function createStore(reducer,defaultState) {
        let state = defaultState;
        let currentState = state;
        let listener = [];
        let reducer = reducer;

        if(Array.isArray(reducer)){
            for(let fn of reducer) {
                if (!isFunction(fn)) {
                    throw new Error('The reducer must be a function');
                    break;
                }
            }
        }else{
            if (!isFunction(reducer)) {
                throw new Error('The reducer must be a function');
            }
        }

        let getState = function () {
            return currentState;
        }

        let subscribe = function (fn) {
            let index;
            listener.push(fn);
            index = listener.length - 1;
            return function () {
                listener.splice(index,1);
            }
        }

        let dispatch = function (action) {
            if(Array.isArray(reducer)){
                for(let fn of reducer){
                    currentState = fn(state,action);
                    if(currentState === state){
                        continue;
                    }else{
                        break;
                    }
                }
            }else{
                currentState = reducer(state,action);
            }

            listener.map((fn)=>{
                fn(currentState)
            })
        }

        return {
            getState,
            subscribe,
            dispatch
        }
    }

    function combineReducers (reducerObj) {
        let reducers = []
        for(let prop in reducerObj){
            let fn = reducerObj[prop];
            if(!isFunction(fn)){
                throw new Error('The reducer ' + prop + ' is not a function');
                break;
            }
            reducers.push(fn);
        }
        return reducers;
    }

    function isFunction(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }

    return {
        createStore,
        combineReducers
    }
}))