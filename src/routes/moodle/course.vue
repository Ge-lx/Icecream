<template lang='pug'>
floatMiddle(:title='course.fullname')
  div.course_info
    .dates
      h3 Zeitraum: 
      h3.starting {{ formatDate(course.startdate) }} -
      h3.ending {{ formatDate(course.enddate) }}
  .top
    courseSection(v-for='section in topSections' @click='openSection(section)' :section='section' top)
  .bottom
    courseSection(v-for='section in otherSections' @click='openSection(section)' :section='section')
      
</template>

<script>
import floatMiddle from '../../components/floatMiddle.vue'
import courseSection from './course-section.vue'

export default {
  name: 'course',
  components: { floatMiddle, courseSection },
  data () {
    return {
      currentYear: ' ' + new Date().getFullYear()
    }
  },
  computed: {
    sections () { return this.current.content },
    course () { return this.current.course },
    topSections () {
      let now = Date.now() + 86400000 // 1day
      let output = [this.sections[0]]
      let currentSection
      this.sections.forEach((section, index) => {
        if (index === 0) return
        let dates = section.name.split(' - ')
        if (this.parseDate(dates[0]) <= now && this.parseDate(dates[1]) >= now) {
          if (section.modules.length < 1) {
            currentSection.summary += '\n\n' + section.summary
            output = [this.sections[0], currentSection]
          } else output = [this.sections[0], section]
        } else if (section.modules.length > 1) {
          currentSection = section
        }
      })
      return output
    },
    otherSections () {
      return this.sections.filter(section => !this.topSections.includes(section))
    }
  },
  props: {
    current: {type: Object} // Array of current courses
  },
  methods: {
    formatDate (date) {
      return new Date(date * 1000).toLocaleDateString('de-DE')
    },
    openSection (section) {
      section.open = !section.open
    },
    parseDate (dateStr) {
      let parts = dateStr.split(' ')
      let day = parts[0]
      let chars = {'Januar': 'Jan',
        'Februar': 'Feb',
        'März': 'Mar',
        'April': 'Apr',
        'Mai': 'May',
        'Juni': 'Jun',
        'Juli': 'Jul',
        'August': 'Aug',
        'Septemper': 'Sep',
        'October': 'Oct',
        'November': 'Nov',
        'Dezember': 'Dec'}
      let repl = new RegExp('(' + Object.keys(chars).join('|') + ')', 'g')
      let month = parts[1].replace(repl, m => chars[m])
      return Date.parse('' + day + month + this.currentYear + ' 00:00:00')
    }
  }
}
</script>

<style lang="css" scoped>

div.course_info {
  text-align: center;
}

div.top {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.78);
  font-size: 16px;
  padding: 0.5em;
  text-align: center;
}

div.top > .section:first-child {
  border-right: 1px solid rgba(0, 0, 0, 0.23);
}

div.bottom {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
}

.dates > h3 {
  margin-left: 5px;
}

.dates {
  display: flex;
  flex-flow: row nowrap;
  align-content: center;
  justify-content: center;
  width: 100%;
}

</style>