<template lang='pug'>
.sidebar
  slot
</template>

<script>
export default {

  name: 'sidebar',

  data () {
    return {
      // Maybe add collapsing
    }
  }
}
</script>

<style lang="css" scoped>
  .sidebar {
    magin: 0 0 0 20px;
    align-self: stretch;
    height: 100%;
    padding-top: 3em;
  }
</style>