<template>
  <div>
    <div class="mb-2">
      <label>Background</label>
      <v-switch
        v-model="params.background.transparent"
        color="primary"
        label="Transparent"
        hide-details/>
      <color-picker
        v-show="!params.background.transparent"
        v-model="params.background.color"/>
    </div>
    <div class="mb-2">
      <label>Texts</label>
      <v-btn
        title="Add a new text"
        color="primary"
        large
        flat
        icon
        @click="addText()">
        <v-icon>fas fa-plus</v-icon>
      </v-btn>
    </div>
    <v-container
      grid-list-md>
      <v-layout
        v-for="(text, index) in params.texts"
        :key="text.id"
        class="mb-4"
        row
        wrap>
        <v-flex xs11>
          <v-card
            raised>
            <v-card-text>
              <v-text-field
                v-model="text.value"
                label="Text"/>
              <color-picker
                v-model="text.color"
                label="Color"/>
              <v-select
                :items="fonts"
                v-model="text.font"
                label="Font"
                autocomplete/>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1>
          <v-btn
            title="Add a new text"
            color="primary"
            flat
            icon
            @click="addText(index)">
            <v-icon small>fas fa-plus</v-icon>
          </v-btn>
          <v-btn
            title="Remove this text"
            color="secondary"
            flat
            icon
            @click="removeText(index)">
            <v-icon small>fas fa-minus</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
const fonts = [
  'InknutAntiqua', 'JosefinSans', 'Lato', 'Oswald', 'Raleway'
]

let nextId = 1

const createTextItem = ({ value = '', color = '000000', font = fonts[0] } = {}) => ({
  id: nextId++, value, color, font
})

export default {
  components: {
    'color-picker': require('./color-picker').default
  },
  data () {
    return {
      fonts: fonts.map((font) => ({ value: font, text: font })),
      params: {
        background: {
          transparent: true,
          color: 'CCCCCC'
        },
        texts: [
          createTextItem({ value: 'Plain' }),
          createTextItem({ value: 'Logo' })
        ]
      }
    }
  },
  watch: {
    params: {
      handler (value) {
        this.$emit('paramsChange', { params: value })
      },
      deep: true
    }
  },
  mounted () {
    this.$emit('paramsChange', { params: this.params, first: true })
  },
  methods: {
    addText (indexToAdd) {
      const texts = [...this.params.texts]
      texts.splice(typeof indexToAdd === 'undefined' ? texts.length : (indexToAdd + 1), 0, createTextItem())
      this.params.texts = texts
    },
    removeText (indexToRemove) {
      const texts = [...this.params.texts]
      texts.splice(indexToRemove, 1)
      this.params.texts = texts
    }
  }
}
</script>
