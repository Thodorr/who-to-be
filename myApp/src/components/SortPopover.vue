<template>
  <ion-list>
    <ion-item button @click="selectSort('alphabetical')">
      <ion-label>Alphabetical</ion-label>
    </ion-item>
    <ion-item button @click="selectSort('value')">
      <ion-label>By Value</ion-label>
    </ion-item>
    <ion-item button @click="selectSort('tier')">
      <ion-label>By Tier</ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonList, IonItem, IonLabel } from '@ionic/vue';

export default defineComponent({
  name: 'SortPopover',
  components: { IonList, IonItem, IonLabel },
  props: {
    currentSort: String,
    handleSortChange: {
      type: Function,
      required: true
    }
  },
  methods: {
    selectSort(sort: string) {
      this.handleSortChange(sort);
    }
  }
});
</script>
