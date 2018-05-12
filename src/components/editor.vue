<template>
  <div>
    <v-card
      class="mb-2"
      raised>
      <v-card-title
        class="pb-0"
        primary-title>
        <div class="headline">Settings</div>
      </v-card-title>
      <v-card-text class="py-0">
        <v-form class="pt-3">
          <v-text-field
            v-validate="'required'"
            v-model="params.name"
            :error-messages="errors.collect('name')"
            name="name"
            label="Name"/>
          <v-text-field
            v-validate="'required'"
            v-model="params.textColor"
            :error-messages="errors.collect('textColor')"
            name="textColor"
            label="Text Color"/>
          <v-text-field
            v-validate="'required'"
            v-model="params.width"
            :error-messages="errors.collect('width')"
            name="width"
            label="Width"/>
          <v-text-field
            v-validate="'required'"
            v-model="params.height"
            :error-messages="errors.collect('height')"
            name="height"
            label="Height"/>
          <v-text-field
            v-validate="'required'"
            v-model="params.padding"
            :error-messages="errors.collect('padding')"
            name="padding"
            label="Padding"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          flat
          @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>
    <no-ssr>
      <preview
        :params="params"
        font-name="InknutAntiqua-Bold"/>
    </no-ssr>
  </div>
</template>

<script>
const getDefaultParams = () => ({
  name: 'PlainLogo',
  textColor: 'EDB050',
  width: 400,
  height: 300,
  padding: 20
})

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    'preview': require('~/components/preview').default
  },
  props: {
    initialParams: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      params: {
        ...getDefaultParams(),
        ...this.initialParams
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
    reset () {
      this.params = getDefaultParams()
    },
    setParams (params) {
      this.params = {
        ...getDefaultParams(),
        ...params
      }
    }
  }
}
</script>
