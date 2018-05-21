<template>
  <div class="input-group input-group--dirty input-group--text-field">
    <label v-if="label">{{ label }}</label>
    <no-ssr>
      <sketch-picker
        :value="value"
        :class="`${label ? 'mt-2' : ''} mb-4`"
        @input="updateValue"/>
    </no-ssr>
  </div>
</template>

<script>
import colorString from 'color-string'

export default {
  components: {
    'sketch-picker': require('vue-color').Sketch
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
      const color = colorString.to.hex([value.rgba.r, value.rgba.g, value.rgba.b, value.rgba.a]).substring(1)
      this.$emit('input', color)
    }
  }
}
</script>
