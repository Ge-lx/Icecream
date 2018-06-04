<template lang='pug'>
.middle
  h2(v-html='title')
  .divider
  p Hier werden Kurse aus Moodle aufgelistet, in denen du eingeschrieben bist.
  h3.course_cat Aktuelle Kurse
  div.course(v-for='course in c_courses' @click='openCourse(course)')
    p.title {{course.fullname}}
    .dates
      p Zeitraum: 
      p.starting {{ formatDate(course.startdate) }} -
      p.ending {{ formatDate(course.enddate) }}
  h3.course_button(@click='toggleOldCourses()') alle Kurse anzeigen
  div.course(v-if='showOldCourses' v-for='course in o_courses' @click='openCourse(course)')
    p.title {{course.fullname}}
    .dates
      p Zeitraum: 
      p.starting {{ formatDate(course.startdate) }} -
      p.ending {{ formatDate(course.enddate) }}
</template>

<script>

export default {

  name: 'course-list',
  components: { },
  data () {
    return {
      showOldCourses: false
    }
  },
  props: {
    c_courses: {type: Array}, // Array of current courses
    o_courses: {type: Array} // The old courses
  },
  methods: {
    formatDate (date) {
      return new Date(date * 1000).toLocaleDateString('de-DE')
    },
    toggleOldCourses () {
      this.showOldCourses = !this.showOldCourses
    },
    openCourse (course) {
      axios('/moodle/course/' + course.id).then(resp => {
        this.$emit('openCourse', { course: course, content: resp.data.course })
      })
    }
  }
}
</script>

<style lang="css" scoped>
.sidebar {
  max-width: 1200px;
  min-width: 350px;
  padding: 1em;
  height: 100%;
  box-shadow: 0 1px 10px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-flow: column wrap;
  background-color: white;
  transition: 0.2s all ease-in-out;
}

.divider {
  height: 1px;
  width: 100%;
  margin: 0.5em auto 0.5em auto;
  background-color: rgba(0, 0, 0, 0.12);
}

h3.course_cat {
  font-size: 16px;
  text-align: center;
}

h3.course_cat::after {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.87);
  content: '';
}

h3.course_button {
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.78);
  font-size: 16px;
  padding: 0.5em;
  text-align: center;
  transition: all 0.2s ease-in-out;
}

h3.course_button:hover {
  color: #4A70B0;
  cursor: pointer;
}

div.course {
  margin: 1em;
  border-radius: 3px;
  box-shadow: 0 1px 8px -1px rgba(0, 0, 0, 1);
  overflow: hidden;
  text-align: center;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

div.course:hover {
  box-shadow: 0 4px 16px 0px rgba(0, 0, 0, 0.4);
}

div.course > .title {
  width: 100%;
  background-color: #4A70B0;
  color: white;
  padding: 3px;
  margin: 0;
  font-weight: normal;
}

div.course > .dates {
  display: flex;
  flex-flow: row nowrap;
  align-content: flex-start;
}
</style>