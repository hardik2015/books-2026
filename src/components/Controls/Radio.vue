<template>
  <div :class="[inputClasses, containerClasses]">
    <div v-if="showLabel" :class="labelClasses">
      {{ df.label }}
    </div>
    <div class="flex flex-col gap-2 mt-2">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center cursor-pointer"
        :class="isReadOnly ? 'opacity-50 cursor-default' : ''"
        @click="!isReadOnly && selectOption(option)"
      >
        <div
          style="width: 16px; height: 16px"
          class="relative flex items-center justify-center"
        >
          <!-- Radio circle -->
          <svg
            v-if="value === option.value"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="7.5"
              :stroke="color"
              stroke-width="1.5"
              fill="white"
            />
            <circle
              cx="8"
              cy="8"
              r="4"
              :fill="color"
            />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="7.5"
              :stroke="offColor"
              stroke-width="1.5"
              fill="white"
            />
          </svg>
        </div>
        <span class="ml-2 text-gray-700 dark:text-gray-200">
          {{ option.label }}
        </span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Base from './Base.vue';
import { SelectOption } from 'schemas/types';

export default defineComponent({
  name: 'Radio',
  extends: Base,
  emits: ['focus'],
  data() {
    return {
      offColor: '#D1D5DB',
      color: '#A1ABB4',
    };
  },
  computed: {
    options(): SelectOption[] {
      if (this.df.fieldtype !== 'Radio') {
        return [];
      }
      return this.df.options || [];
    },
  },
  methods: {
    selectOption(option: SelectOption) {
      if (this.isReadOnly) {
        return;
      }
      this.triggerChange(option.value);
    },
  },
});
</script>

<style scoped>
label:hover {
  opacity: 0.9;
}
</style>
