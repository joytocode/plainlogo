<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.maxWidth"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{ options.title }}</h3>
        </div>
      </v-card-title>
      <v-card-text v-if="options.message">{{ options.message }}</v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          flat
          @click.native="cancel"
        >Cancel</v-btn>
        <v-btn
          :color="options.color || 'primary'"
          flat
          @click.native="agree"
        >{{ options.action }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      promise: null,
      options: {}
    }
  },
  methods: {
    open (options) {
      this.options = options
      this.dialog = true
      return new Promise((resolve) => {
        this.promise = { resolve }
      })
    },
    agree () {
      this.promise.resolve(true)
      this.dialog = false
    },
    cancel () {
      this.promise.resolve(false)
      this.dialog = false
    }
  }
}
</script>
