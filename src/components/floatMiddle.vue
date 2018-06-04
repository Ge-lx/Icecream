<template lang='pug'>
div#main
  .mid
    h2(v-html='title')
    .divider
    slot
</template>

<script>
export default {

  name: 'floatMiddle',
  data () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="css" scoped>
.mid {
  display: flex;
  flex-flow: column nowrap;
  border-radius: 4px;
  background-color: white;
  margin: 5px;
  box-shadow: 0 1px 8px -1px rgba(0, 0, 0, 0.75);
}

#main {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-flow: row nowrap;
  padding: 2em;
  align-items: flex-start;
  flex-grow: 1;
}
</style>