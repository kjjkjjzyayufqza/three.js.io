import Vue from "vue";
import Router from "vue-router";

//组件模块
import HelloWorld from "@/components/HelloWorld";
import List from "@/components/list";
import About from "@/components/about";
import water from "@/components/3dwater";
import Animejs from "@/components/animejs";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", name: "HelloWorld", component: HelloWorld },
    { path: "/list", name: "List", component: List },
    { path: "/about", name: "Aabout", component: About },
    { path: "/3dwater", name: "3dwater", component: water },
    { path: "/animejs", name: "animejs", component: Animejs },
  ],
});
