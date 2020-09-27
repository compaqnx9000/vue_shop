<template>
  <el-button type="info" @click="btnLogout">退出</el-button>
</template>
<script>
export default {
  data () {
  },
  methods: {
    btnLogout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style>
</style>
