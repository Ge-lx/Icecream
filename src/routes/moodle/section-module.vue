<template lang='pug'>
.file()
  img(:src='module.modicon')
  a.link(:href='module.url') {{module.name}}
</template>

<script>

export default {

  name: 'section-module',
  components: { },
  data () {
    return {
    }
  },
  computed: {
  },
  props: {
    module: {type: Object}
  },
  methods: {
  }
}
</script>

<style type='css'>
.file {
  transition: all 0.5s ease-in-out;
  flex-grow: 0;

  align-items: space-between;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;

  background-color: #4A70B0;
  border-radius: 5px;
  color: white;
  padding: 3px;
  margin: 4px;
}

.file > a {
  text-decoration: none;
  color: inherit;
  text-size: 20px;
}

.file > img {
  width: 20px;
  height: 20px;
  margin-right: 3px;
  padding: 0 0 0 4px;
  filter: grayscale(100%);
}
</style>