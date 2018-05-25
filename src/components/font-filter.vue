<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-width="200"
    v-model="showMenu"
    offset-x
  >
    <v-btn
      slot="activator"
      title="Filter fonts"
      color="grey darken-2"
      flat
      icon
    >
      <v-icon small>fas fa-filter</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <div class="subheading">Categories</div>
        <v-checkbox
          v-for="category in categoryItems"
          :key="category.id"
          :label="category.name"
          v-model="category.selected"
          color="primary"
          hide-details
          @change="updateCategory"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { titleCase } from 'change-case'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    fontList: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      categoryItems: this.fontList.categories.map((category) => ({
        id: category,
        name: titleCase(category),
        selected: this.value.categories.includes(category)
      })),
      showMenu: false
    }
  },
  methods: {
    updateCategory () {
      const categories = this.categoryItems
        .filter(({ selected }) => selected)
        .map(({ id }) => id)
      this.$emit('input', { ...this.value, categories })
    }
  }
}
</script>
