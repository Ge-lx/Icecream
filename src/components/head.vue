<template lang='pug'>
  #head
    #menu
      p.menu_item(v-if='user') {{user.email}}
      a.menu_item(v-if='user' href='/logout') Logout
      a.menu_item(v-else href='/login') Login    
    #secondary
      p 🍦
</template>

<script>
export default {
  name: 'head_component',
  data () {
    return { }
  },
  props: {
    user: { type: Object }
  },
  mounted () { console.log('User: ' + this.user) }
}
</script>

<style lang="css" scoped>
#head {
  top: 0;
  width: 100%;
  min-height: 3em;
  z-index: 2;

  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;

  user-select: none;
  background-color: #4A70B0;
  color: rgba(255, 255, 255, 0.78);
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);
}

#menu {
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  align-self: stretch;
  align-content: center;
}

.menu_item {
  align-self: center;
  text-align: center;
  margin: 0 0.5em;
  padding: 0.4em;
  border-radius: 0.2em;
  transition: all 0.2s ease-in;
}

.menu_item:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

#menu a {
  color: rgba(255, 255, 255, 0.78);
}

#menu p {
  cursor: default;
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