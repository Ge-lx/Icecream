<template lang='pug'>
div
  headComponent(:user=user)
  floatMiddle(title='Link your moodle')
    p. 
      Ich will keine Zugansdaten verarbeiten müssen, es ist schließlich der UNI-Account. Deswegen werden sogenannte 'login-tokens' 
      verwerndet. Somit werden die Zugansdaten nur an den Moodle-Server gesendet, an meinen nur der generische token. Den Quellcode 
      zum Beweis gibts in den Entwickler-Tools (F12) 
    form.holder(@submit.prevent='submit')
      p.error(v-if='error') Error: {{error}}
      label(for='email') E-Mail
      input.s#email(type='name' v-model='username')
      label(for='password') Password
      input.s#password(type='password' v-model='password')
      input.submit(type='submit' value='Submit')

</template>

<script>
import floatMiddle from '../../components/floatMiddle.vue'
import headComponent from '../../components/head.vue'

export default {
  name: 'moodle_link',
  components: {floatMiddle, headComponent},
  data () {
    return {
      username: '',
      password: '',
      error: null
    }
  },
  methods: {
    submit () { //Die Login-daten werden nur an den UNI-Server gesendet.
      axios('https://elearning2.uni-heidelberg.de/login/token.php', {
        params: {
          username: this.username,
          password: this.password,
          service: 'moodle_mobile_app'
        }
      }).then(resp => {
        console.log(resp)
        if (resp.data.token) {
          axios('/moodle/token', {
            params: {
              token: resp.data.token //Der erhaltene moodle-token wird zur weiteren Anmeldung verwendet
            }
          }).then(response => {
            window.location = '/moodle/'
          })
        } else {
          this.error = resp.data.error
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