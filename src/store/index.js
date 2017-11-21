import Vue from 'vue';
import Vuex from 'vuex';
import { SOME_MUTATION } from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 0,
        todos: [
            { id: 1, text: '吃饭', done: true },
            { id: 2, text: '睡觉', done: false }
        ],
        projects: null
    },

    // 更改vuex中的state中状态的唯一方式，就是提交mutation. vuex中的mutation非常类似于事件；每个mutation都有一个字符串的 事件类型 和 一个回调函数。这个函数就是我们实际进行状态变更的地方
    // 并且接受state作为第一个参数

    /**
     * Mutation需要遵循Vue的响应式规则
     * 
     * 既然Vuex的store的状态是响应式的，那么我们变更状态时，监视状态的Vue组件也会自动更新。也意味着Vuex中的mutation也需要与使用Vue一样遵守一些注意事项
     * 
     * 1.最好提前在你的store中初始化好所有属性；
     * 2.当你需要添加属性时，你应该：
     *      1.使用Vue.set(obj, 'newProp', 123),或者
     *      2.以新对象替换老对象，利用对象展开运算符可以处理
     *          state.obj = { ...state.obj, newProp: 123 }
     * 
     * 
     * mutation函数必须是同步函数
     */
    mutations: {

        // 你不能直接调用一个mutation handler，这个选项更像是事件注册
        increment(state) {
            state.count++;
        },

        incrementWithPayload(state, payload) {
            state.count += payload.amount;
        },

        // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
        [SOME_MUTATION](state) {
            // some mutation
        },

        queryProjects(state, payload) {
            state.projects = payload;
        }
    },

    // Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
    getters: {

        // 对当前state中的数据进行通用过滤，可以使用这个
        doneTodos: state => {
            return state.todos.filter(todo => todo.done);
        },

        // 可以在参数的第二个中，获取其他getters，来进行进一步的计算
        doneTodosCount: (state, getters) => {
            return getters.doneTodos.length;
        },

        // 可以返回一个函数，来实现对getter传参，在你对store中的数据进行查询的时候非常有用
        getTodoById: (state, getters) => (id) => {
            return state.todos.find(todo => todo.id === id);
        }
    },

    /**
     * Action类似于mutation,不同在于:
     *  1.Action提交的mutation,而不是直接变更状态;
     *  2.Action可以包含任意异步操作
     */
    actions: {

        /**
         * Action函数接受一个与store实例具有相同方法的属性的context对象,因此你可以调用context.commit提交一个mutation,或者通过
         * context.state和context.getters来获取state和getters.
         * @param {Object} context store上下文
         */
        increment(context) {

            // action不用必须是同步函数
            setTimeout(() => {
                context.commit('increment')
            }, 1000)
        },

        /**
         * 可以使用ES6的参数解构来直接获取commit方法
         */
        incrementWithPayload({ commit }, payload) {
            // action不用必须是同步函数
            setTimeout(() => {
                commit('incrementWithPayload', payload)
            }, 1000)
        },

        testPromiseAction({ commit }) {
            setTimeout(() => {
                commit('increment');
                console.log(1);
            }, 2000);
        },

        queryProjects({ commit }, payload) {
            Vue.http.get(payload.url).then(data => {
                commit('queryProjects', data.body);
            });
        }
    }
});
