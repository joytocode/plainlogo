<template>
  <div>
    <label
      v-if="label"
      class="subheading grey--text text--darken-2"
    >{{ label }}</label>
    <no-ssr>
      <chrome-picker
        :value="value"
        class="mt-2 mb-4"
        @input="updateValue"
      />
    </no-ssr>
  </div>
</template>

<script>
import { rgbaToHex } from '~/utils/color'

export default {
  components: {
    'chrome-picker': require('vue-color').Chrome
  },
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    updateValue (value) {
      this.$emit('input', rgbaToHex(value.rgba))
    }
  }
}
</script>
