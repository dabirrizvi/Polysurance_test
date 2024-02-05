<template>
  <!-- Using bootstrap accordion for better visualisation -->
  <!-- Creating an accordion template for better reusability -->
  <div :class="'accordion'" :id="accordionId">
    <!-- Loop through accordion items -->
    <div class="accordion-item" v-for="(item, index) in accordionItems" :key="index">
      <!-- Button to toggle collapse -->
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" :data-bs-toggle="'collapse'"
          :data-bs-target="`#${item.collapseId}`" :aria-expanded="item.ariaExpanded" :aria-controls="item.ariaControls">
          {{ item.title }}
        </button>
      </h2>
      <div :id="item.collapseId" class="accordion-collapse collapse show" :data-bs-parent="`#${accordionId}`">
        <div class="accordion-body">
          <!-- Loop through contents of each accordion item -->
          <ul>
            <li v-for="(contents, contentsIndex) in item.contents" :key="contentsIndex">{{ contents }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // Unique identifier for each accordion component
    accordionId: {
      type: String,
      required: true,
    },
    // Array of items to be displayed in the accordion
    accordionItems: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
