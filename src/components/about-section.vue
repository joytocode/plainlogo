<template>
  <v-container
    class="accent lighten-3 py-4"
    fluid
  >
    <v-container>
      <div class="display-1 mb-3">About</div>
      <p><strong>PlainLogo</strong> is a free and open source logo maker. You put texts, colors and fonts together to craft your appealing logo (see our <a
        href="#top"
        class="secondary--text text--darken-2"
      >Examples</a>). The result can be downloaded as SVG or PNG image for editing later. We use only free resources (such as Google Fonts) so that you can use the logo anywhere, whether commercial or personal. The application works on the most recent versions of Chrome, Firefox, Safari and Edge.</p>
      <p>If you want a quick or first design of your logo, then try it out.</p>
      <div class="display-1 mb-3">Usage</div>
      <div class="headline mb-2">Options</div>
      <p>You can set the following options for a logo:</p>
      <ul class="ml-3">
        <li><strong>Texts</strong>: the logo can contain multiple texts with different colors and fonts.
          <ul class="ml-3">
            <li>Click <v-icon small>fas fa-cog</v-icon> to see the text options.</li>
            <li>Click <v-icon small>fas fa-minus</v-icon> to remove text.</li>
            <li>Click <v-icon small>fas fa-plus</v-icon> to add text.</li>
            <li>Click <v-icon small>fas fa-filter</v-icon> to filter fonts by category.</li>
            <li>For fonts, you can set the family, style (Regular, Bold, etc.) and scale (smaller if less than 1 and bigger if greater than 1).</li>
          </ul>
        </li>
        <li><strong>Background</strong>: transparent or a solid color.</li>
        <li><strong>Spacing</strong>: the space between two texts (px).</li>
        <li><strong>Padding</strong>: the space between the logo content and its border (px).</li>
      </ul>
      <div class="headline my-2">Download</div>
      <p>Click <v-icon small>fas fa-cloud-download-alt</v-icon> to download the logo.</p>
      <ul class="ml-3">
        <li><strong>Image</strong>: you can set the logo size (width, height) and select the format to download:
          <ul class="ml-3">
            <li>SVG: scalable, high quality, easy to edit.</li>
            <li>PNG: widely supported across almost every platform and service.</li>
          </ul>
        </li>
        <li><strong>Inline HTML</strong>: you can set the base font size then copy/paste the HTML code to anywhere in your website.</li>
      </ul>
      <div class="headline my-2">Share</div>
      <p>Click <v-icon small>fas fa-share-alt</v-icon> to share the logo to social networks.</p>
    </v-container>
  </v-container>
</template>
