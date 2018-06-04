<template>
  <div>
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
      <confirm-dialog ref="confirm"/>
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
    <div class="mb-4">
      <label class="headline">Spacing</label>
      <v-text-field
        v-model="params.spacing"
        type="number"
        step="5"
        min="0"
        max="50"
        class="pt-0"
        hide-details
      />
    </div>
    <div class="mb-4">
      <label class="headline">Padding</label>
      <v-text-field
        v-model="params.padding"
        type="number"
        step="5"
        min="0"
        max="50"
        class="pt-0"
        hide-details
      />
    </div>
  </div>
</template>

<script>
import { defaultBackgroundColor, defaultSpacing, defaultPadding, createTextItem } from '~/utils/params'

export default {
  components: {
    'color-picker': require('./color-picker').default,
    'text-form': require('./text-form').default,
    'confirm-dialog': require('./confirm-dialog').default
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
        texts: [
          createTextItem(fontList, { value: 'P', color: 'AE74CA', font: { name: 'Akronim', style: 'regular', scale: 1.2 } }),
          createTextItem(fontList, { value: 'lain', color: '616F67', font: { name: 'Akronim', style: 'regular', scale: 1 } }),
          createTextItem(fontList, { value: 'L', color: 'AE74CA', font: { name: 'Akronim', style: 'regular', scale: 1.2 } }),
          createTextItem(fontList, { value: 'ogo', color: '616F67', font: { name: 'Akronim', style: 'regular', scale: 1 } })
        ],
        background: {
          transparent: true,
          color: defaultBackgroundColor
        },
        spacing: defaultSpacing,
        padding: defaultPadding,
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
    async removeText (indexToRemove) {
      const confirmed = await this.$refs.confirm.open({
        title: `Delete '${this.params.texts[indexToRemove].value}'`,
        message: 'Are you sure you want to delete this text?',
        color: 'error',
        action: 'Delete',
        maxWidth: 400
      })
      if (confirmed) {
        const texts = [...this.params.texts]
        texts.splice(indexToRemove, 1)
        this.params.texts = texts
      }
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
