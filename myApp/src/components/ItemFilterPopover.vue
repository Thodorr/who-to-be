<template>
  <ion-list>
    <ion-item button @click="selectFilter('all')">
      <ion-label>All Items</ion-label>
    </ion-item>
    <ion-item button @click="selectFilter('weapon')">
      <ion-label>Weapons</ion-label>
    </ion-item>
    <ion-item button @click="selectFilter('armor')">
      <ion-label>Armor</ion-label>
    </ion-item>
    <ion-item button @click="selectFilter('tool')">
      <ion-label>Tools</ion-label>
    </ion-item>
    <ion-item button @click="selectFilter('consumable')">
      <ion-label>Consumables</ion-label>
    </ion-item>
    <ion-item button @click="selectFilter('valuable')">
      <ion-label>Valuables</ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonList, IonItem, IonLabel } from '@ionic/vue';

export default defineComponent({
  name: 'ItemFilterPopover',
  components: { IonList, IonItem, IonLabel },
  props: {
    currentFilter: String,
    handleFilterChange: {
      type: Function,
      required: true
    }
  },
  methods: {
    selectFilter(filter: string) {
      this.handleFilterChange(filter);
    }
  }
});
</script>
