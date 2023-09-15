<script setup>
  import {login,getList} from "./apis";
  import {setAccessToken,setRefreshToken} from "./config/storage";
  const getToken=()=>{
    login().then(res=>{
      setAccessToken(res.data.accessToken)
      setRefreshToken(res.data.refreshToken)
    })
  }
  const getData = ()=>{
    getList()
  }
</script>

<template>
    <button @click="getToken">登录</button>
    <button @click="getData">请求数据</button>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
