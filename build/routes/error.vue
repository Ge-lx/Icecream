<template>
  <div class="error-page">
    <h1>{{error}}</h1>
    <div v-if="debug">
      <p>Error code: {{error.code}}</p>
      <p>Stacktrace:</p>
      <pre>
        {{error.stack}}
      </pre>
    </div>
    <div v-else>
      <p>The page you're looking for is in another framework</p>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {}
  }
}
</script>

<style lang="css">
</style>