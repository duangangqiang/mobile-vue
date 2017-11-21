<template>
  <div class="hello">
    <div class="count">count: {{count}}</div>
    <div class="countAlias">countAlias: {{countAlias}}</div>
    <div class="countPlusLocalState">countPlusLocalState: {{countPlusLocalState}}</div>
    <div class="localCount">localCount: {{localCount}}</div>
    <div class="localCountReduce">localCountReduce: {{localCountReduce}}</div>

    <ul>
      <li v-for="todo in doneTodos" :key="todo.id">
        {{todo.text}}
      </li>
    </ul>

    <div v-if="projects">
      <div>totalCount: <span v-text="projects.total_count"></span></div>
      <div>incomplete_results: <span v-text="projects.incomplete_results"></span></div>
      
      items:
      <ul>
        <li v-for="item in projects.items" :key="item.id">
          <div v-text="item.full_name"></div>
        </li>
      </ul>
    </div>

    <div>{{theSecondTodo.text}}</div>
    <button @click="testPromiseAction">加一</button>
    <button @click="incrementWithPayloadTwo">加2</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'HelloWorld',

  data () {
    return {
      localCount: 1
    }
  },

  // 可以使用对象展开运算符来将本地的计算属性和从state中映射的属性进行混合
  computed: {

    localCountReduce() {
      return this.localCount - 1;
    },

    // 当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性
    ...mapState({
    
      // 箭头函数可使代码更简练
      count: state => state.count,

      projects: state => state.projects,

      // 传递参数count之后，就直接获取到count的值，但是在页面中引用还是要使用countAlias
      countAlias: 'count',

      // 为了使用this局部变量，根据state中的值，计算出一个新的值的时候，必须使用常规的函数
      countPlusLocalState (state) {
        return state.count + this.localCount
      }
    }),

    ...mapGetters({
      doneTodos:'doneTodos' // 可以给doneTodos起别名，也可以直接同名
    }),
    
    // 如果直接获取，可以直接传递字符串数组
    // ...mapGetters([
    //   'doneTodos'
    // ]),

    // 不适用mapGetters的方式
    // doneTodos() {
    //   return this.$store.getters.doneTodos;
    // }, 

    // getters返回方法的话只能使用这种常规函数
    theSecondTodo() {
      return this.$store.getters.getTodoById(2);
    }
  },
  // computed: mapState([
  //   // 当计算属性的名称与state中的节点的名称相同的时候，我们也可以给mapState传递一个数组
  //   'count'
  // ]),
  methods: {
    // addCount() {
    //   this.$store.commit('increment');
    // },
    
    // addCountWithPayload() {
    //   // 普通的提交
    //   // this.$store.commit('incrementWithPayload', {
    //   //   amount: 2
    //   // });

    //   // 对象形式的提交
    //   this.$store.commit({
    //     type: 'incrementWithPayload',
    //     amount: 3
    //   });
    // },

    ...mapMutations([
      'increment',
      'incrementWithPayload' // 如果含有payload只能在调用的时候传递参数
    ]),

    ...mapMutations({
      add: 'increment' // 可以传递对象进行重命名
    }),

    // 普通调用Action
    incrementOne() {
      this.$store.dispatch('increment');
    },
    incrementWithPayloadTwo() {
      this.$store.dispatch({
        type: 'incrementWithPayload',
        amount: 2
      });
    },

    testPromiseAction() {
      this.$store.dispatch('testPromiseAction').then(() => {
        console.log(2);
      })
    }

    // 使用mapActions映射action
    // ...mapActions([
    //   'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    //   'incrementWithPayload' // 将 `this.incrementWithPayload(amount)` 映射为 `this.$store.dispatch('incrementWithPayload', amount)`
    // ])
  },
  mounted() {
    this.$store.dispatch('queryProjects', {
      url: 'https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
