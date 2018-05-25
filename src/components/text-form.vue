<template>
  <v-container
    class="mb-3"
    grid-list-xs
  >
    <v-layout row>
      <v-flex>
        <v-text-field
          v-model="text.value"
          class="pt-0"
          hide-details
        />
      </v-flex>
      <v-flex style="flex: none;">
        <v-btn
          :title="expand ? 'Close' : 'Show other options'"
          color="primary"
          class="mx-0"
          flat
          icon
          @click="$emit('toggle')"
        >
          <v-icon small>fas fa-{{ expand ? 'chevron-up' : 'cog' }}</v-icon>
        </v-btn>
        <v-btn
          title="Remove this text"
          color="grey darken-2"
          class="mx-0"
          flat
          icon
          @click="$emit('remove')"
        >
          <v-icon small>fas fa-minus</v-icon>
        </v-btn>
        <v-btn
          title="Add a new text"
          color="grey darken-2"
          class="mx-0"
          flat
          icon
          @click="$emit('add')"
        >
          <v-icon small>fas fa-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout
      v-if="expand"
      class="mb-4 px-3"
      row
      wrap
    >
      <v-flex xs12>
        <color-picker
          v-model="text.color"
          label="Color"
        />
        <font-picker
          :font-list="resources.fontList"
          :text="text.value"
          :color="normalizeColor(text.color)"
          v-model="text.font"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { normalizeColor } from '~/utils/color'

export default {
  components: {
    'color-picker': require('./color-picker').default,
    'font-picker': require('./font-picker').default
  },
  props: {
    resources: {
      type: Object,
      required: true
    },
    text: {
      type: Object,
      required: true
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    normalizeColor
  }
}
</script>
