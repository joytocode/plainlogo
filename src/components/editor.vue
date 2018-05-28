<template>
  <div>
    <div class="mb-4">
      <label class="headline">Background</label>
      <v-switch
        v-model="params.background.transparent"
        color="primary"
        label="Transparent"
        hide-details
      />
      <color-picker
        v-if="!params.background.transparent"
        v-model="params.background.color"
      />
    </div>
    <div>
      <label class="headline">Texts</label>
      <v-btn
        title="Add a new text"
        color="primary"
        large
        flat
        icon
        @click="addText()"
      >
        <v-icon>fas fa-plus</v-icon>
      </v-btn>
      <div
        v-for="(text, index) in params.texts"
        :key="text.id"
      >
        <text-form
          :resources="resources"
          :text="text"
          :expand="textExpandById[text.id]"
          @toggle="toggleExpand(text.id)"
          @add="addText(index)"
          @remove="removeText(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defaultBackgroundColor, createTextItem } from '~/utils/params'

export default {
  components: {
    'color-picker': require('./color-picker').default,
    'text-form': require('./text-form').default
  },
  props: {
    resources: {
      type: Object,
      required: true
    },
    initialParams: {
      type: Object,
      required: true
    }
  },
  data () {
    const { fontList } = this.resources
    return {
      params: {
        background: {
          transparent: true,
          color: defaultBackgroundColor
        },
        texts: [
          createTextItem(fontList, { value: 'Plain' }),
          createTextItem(fontList, { value: 'Logo' })
        ],
        ...this.initialParams
      },
      textExpandById: {}
    }
  },
  watch: {
    params: {
      handler (value) {
        this.$emit('params-change', { params: value })
      },
      deep: true
    }
  },
  mounted () {
    this.$emit('params-change', { params: this.params, first: true })
  },
  methods: {
    setParams (params) {
      this.params = params
    },
    addText (indexToAdd) {
      const texts = [...this.params.texts]
      texts.splice(typeof indexToAdd === 'undefined' ? texts.length : (indexToAdd + 1), 0, createTextItem(this.resources.fontList))
      this.params.texts = texts
    },
    removeText (indexToRemove) {
      const texts = [...this.params.texts]
      texts.splice(indexToRemove, 1)
      this.params.texts = texts
    },
    toggleExpand (textId) {
      const expand = this.textExpandById[textId]
      this.textExpandById = {
        ...this.textExpandById,
        [textId]: !expand
      }
    }
  }
}
</script>
