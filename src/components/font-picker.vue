<template>
  <div>
    <label class="subheading grey--text text--darken-2">Font Family</label>
    <font-filter
      :font-list="fontList"
      v-model="filter"
      @input="page = 1"
    />
    <v-select
      :items="fontItems"
      :value="valueFontItem.family"
      item-text="family"
      item-value="family"
      class="pt-0"
      autocomplete
      @input="updateFontName"
    />
    <div class="px-3 mb-4">
      <v-container
        :style="`background-color: #${backgroundColor};`"
        grid-list-xs
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            v-for="fontItem in pageFontItems"
            :key="fontItem.family"
            :style="`border: 2px solid #${backgroundColor}`"
            :class="`font-preview ${value.name === fontItem.family ? 'selected' : ''} text-xs-center pa-2`"
            xs6
            sm4
            md3
            @click="updateFontName(fontItem.family)"
          >
            <style v-html="getFontFaceHtml(fontItem)"/>
            <div :style="`font-family: ${fontItem.family} Preview; color: ${color};`">{{ text }}</div>
            <div class="caption">{{ fontItem.family }}</div>
          </v-flex>
        </v-layout>
        <v-layout
          row
          justify-center
        >
          <v-flex
            class="my-2"
            xs12
            sm10
            md8
          >
            <v-pagination
              :length="pageLength"
              :value="currentPage"
              @input="setPage"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <label class="subheading grey--text text--darken-2">Font Style ({{ styleItems.length }})</label>
    <v-select
      :items="styleItems"
      :value="valueStyleItem"
      class="pt-0"
      autocomplete
      @input="updateFontStyle"
    />
    <label class="subheading grey--text text--darken-2">Font Scale</label>
    <v-text-field
      :value="value.scale"
      type="number"
      step="0.1"
      min="0.5"
      max="2"
      class="pt-0"
      hide-details
      @input="updateFontScale"
    />
  </div>
</template>

<script>
import { fontStyleNameById } from '~/utils/font'
import { defaultBackgroundColor } from '~/utils/params'

export default {
  components: {
    'font-filter': require('./font-filter').default
  },
  props: {
    itemsPerPage: {
      type: Number,
      default: 12
    },
    fontList: {
      type: Object,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      filter: {
        categories: [...this.fontList.categories]
      },
      page: null,
      backgroundColor: defaultBackgroundColor
    }
  },
  computed: {
    fontItems () {
      return this.fontList.items.filter((fontItem) => this.filter.categories.includes(fontItem.category))
    },
    valueFontItem () {
      return this.fontList.itemByFamily[this.value.name] || this.fontList.items[0]
    },
    pageLength () {
      return Math.floor(this.fontItems.length / this.itemsPerPage) + (this.fontItems.length % this.itemsPerPage ? 1 : 0)
    },
    pageFontItems () {
      return this.fontItems.slice((this.currentPage - 1) * this.itemsPerPage, Math.min(this.fontItems.length, this.currentPage * this.itemsPerPage))
    },
    styleItems () {
      return this.valueFontItem.variants.map((variant) => ({ value: variant, text: fontStyleNameById[variant] }))
    },
    valueStyleItem () {
      return this.valueFontItem.variants.includes(this.value.style) ? this.value.style : this.valueFontItem.variants[0]
    },
    currentPage () {
      return this.page || this.getPageByName(this.value.name)
    }
  },
  methods: {
    updateFontName (name) {
      const fontItem = this.fontList.itemByFamily[name]
      const style = fontItem.variants.includes(this.value.style) ? this.value.style : fontItem.variants[0]
      const page = this.getPageByName(name)
      if (this.page !== page) {
        this.page = page
      }
      this.updateValue({ name, style })
    },
    getPageByName (name) {
      const index = this.fontItems.findIndex((item) => item.family === name)
      return index !== -1 ? (Math.floor(index / this.itemsPerPage) + 1) : 1
    },
    setPage (page) {
      this.page = page
    },
    updateFontStyle (style) {
      this.updateValue({ style })
    },
    updateFontScale (scale) {
      this.updateValue({ scale })
    },
    updateValue (value) {
      this.$emit('input', { ...this.value, ...value })
    },
    getFontFaceHtml (fontItem) {
      const url = fontItem.files[fontItem.variants[0]]
      return `@font-face { font-family: '${fontItem.family} Preview'; src: url(${url}); }`
    }
  }
}
</script>

<style lang="stylus" scoped>
.font-preview
  font-size: 2rem
  overflow: hidden
  cursor: pointer
  &.selected
    border: 2px solid #AE74CA !important
    padding: 0
  &:hover
    border: 2px dashed #666666 !important
    padding: 0
</style>
