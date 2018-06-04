<template lang='pug'>
div
  headComponent(:user='user')
  .flex
    sidebar()
      courseList(:c_courses='c_courses' :o_courses='o_courses' v-on:openCourse='openCourse')
    transition-group.components(name='components' tag='div')
      component(
        v-for='component in main_components'
        :key='component' v-bind:is='component'
        :current='currentCourse')
</template>

<script>
import headComponent from '../../components/head.vue'
import sidebar from '../../components/sidebar.vue'
import courseList from './course-list.vue'
import course from './course.vue'

export default {

  name: 'dashboard',
  components: {headComponent, courseList, course, sidebar},
  data () {
    return {
      user: null, // The current user
      currentCourse: null, // if != null, the current course object to show
      main_components: []
    }
  },
  methods: {
    openCourse (course) {
      this.currentCourse = course
      if (course !== null) {
        this.main_components = ['course']
      } else {
        this.main_components = []
      }
    }
  }
}
</script>

<style lang="css" scoped>

.components-move {
  transition: transform 0.5s;
}

.components {
   display: flex;
   flex-flow: row nowrap;
   align-items: space-around;
}

.flex {
  display: flex;
  flex-flow: row nowrap;
}

</style>
