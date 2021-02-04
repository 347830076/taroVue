<template>
    <view>
        首页
        <tool />
    </view>
</template>

<script>


export default {
  data(){
    return {

    }
  },
  mounted(){
      wx.chooseContact()
  },
  methods:{
   
  }
}
</script>

<style>

</style>
