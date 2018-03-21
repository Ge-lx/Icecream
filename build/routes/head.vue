<template lang='pug'>
  #head
    #menu
      .item
        p Item1
      .item
        p Item2
    #secondary
      p 🍦
</template>

<script>
export default {

  name: 'head_component',

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
#head {
  top: 0;
  width: 100%;
  min-height: 3em;

  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;

  background-color: #4A70B0;
  color: rgba(255, 255, 255, 0.78);
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);
}

#menu {
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  align-self: center;
}

#menu p {
  margin: 0.4em;
}

#secondary {
  align-self: center;
  flex-grow: 0;

}
/*
@media screen and (max-width: 900px) {
  #head {
    min-height: 3em;
  }
}
*/
</style>