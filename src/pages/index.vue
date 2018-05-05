<template>
  <v-container fluid>
    <editor/>
  </v-container>
</template>

<script>
export default {
  head: {
    title: 'Home'
  },
  components: {
    'editor': require('~/components/editor').default
  }
}
</script>
