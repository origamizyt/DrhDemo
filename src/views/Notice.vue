<template>
  <div>
    <h1>通知</h1>
    <p>
      NodeJS Test of Login Services<br>
      Powered By Node.js, Vue.js and ElementUI<br>
    </p>
    <code>
      Web Token: base64:scrypt:{{storage.tokenId}}
    </code>
  </div>
</template>

<script>
  export default {
    name: 'Notice'
  }
</script>