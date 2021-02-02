<template>
  <view>
    <text class="title">{{ getNumbers }}</text>
  </view>
</template>

<script>
export default {
  name: 'NumberDisplay',
  computed: {
    getNumbers() {
      return this.$store.getters.getNumbers.toString();
    }
  }
}
</script>

<style>
.title {
  font-size: 40px;
}
</style>
