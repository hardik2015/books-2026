<template>
  <div class="flex items-center z-10">
    <p class="me-1"><slot></slot></p>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      default: true,
      type: Boolean,
    },
  },
};
</script>
