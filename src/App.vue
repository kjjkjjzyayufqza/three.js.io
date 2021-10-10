<template>
  <div id="app">
    <div id="conect">
    <img alt="Vue logo" src="./assets/logo.png" />
    <br />
    
    <router-link to="/">首页</router-link>
    <router-link to="/list">列表</router-link>
    <router-link to="/about">关于</router-link>
    
    <button v-on:click="fullscreen">
      <router-link to="/3dwater">3Dwater</router-link>
    </button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
  components: {},
  methods: {
    fullscreen: function () {
     //$("#conect").remove();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
