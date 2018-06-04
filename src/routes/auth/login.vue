<template lang='pug'>
div
  headComponent(:user='user')
  floatMiddle(title='Login')
    p(v-if='user') You are already logged in, {{user.email}}
    form.holder(v-else @submit.prevent='submit')
      p.error(v-if='error') Error: {{error.failed}}
      label(for='email') E-Mail
      input.s#email(type='email' v-model='email')
      label(for='password') Password
      input.s#password(type='password' v-model='pw')
      input.submit(type='submit' value='Submit')
</template>

<script>
import headComponent from '../../components/head.vue'
import floatMiddle from '../../components/floatMiddle.vue'

export default {
  name: 'login',
  components: {headComponent, floatMiddle},
  data () {
    return {
      email: '',
      pw: '',
      error: false
    }
  },
  methods: {
    submit () {
      axios({
        method: 'post',
        url: '/login',
        data: {
          email: this.email,
          pw: this.pw
        }
      }).then(resp => {
        if (resp.data.success) {
          window.location = this.next
        } else {
          this.error = resp.data.failed
        }
      }).catch(err => {
        this.error = err
      })
    }
  }
}
</script>

<style lang="css" scoped>
  p.error {
    color: #E33D3D;
  }


  .holder input.s {
    color: #4c5b5c;
    /*position: relative;
    z-index: 4;*/
    font-size: 16px;
    line-height: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 20px;
    border: 1px solid rgba(76, 91, 92, 0.2);
    padding: 3px 6px 3px 6px;
    transition: all 0.3s ease-in;
    box-shadow: inset 3px 3px 8px -5px rgba(0, 0, 0, 0.2), inset -3px -3px 8px -5px rgba(0, 0, 0, 0.2);
  }

  .holder input.s:focus {
    color: #4c5b5c;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid #4A70B0;;
    box-shadow: inset 3px 3px 8px -5px rgba(0, 0, 0, 0.8), inset -3px -3px 8px -5px rgba(0, 0, 0, 0.8);
    outline: none;
  }
</style>
