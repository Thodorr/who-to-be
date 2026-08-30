<template>
  <ion-content class="ion-padding">
    <h2 class="modal-title">Add new Condition for {{ getTypeName(type) }}</h2>

    <div class="input-container">
      <ion-item class="input">
        <ion-label position="floating" color="danger" class="input-content">Name</ion-label>
        <ion-input v-model="name" type="text" class="input-value"></ion-input>
      </ion-item>

      <div class="input effect-value-container">
        <ion-label color="danger" class="picker-label">Effect</ion-label>
        <div class="points-control">
          <ion-button fill="clear" @click="decrementEffectValue" class="control-button">
            <ion-icon :icon="removeCircleOutline" size="default"></ion-icon>
          </ion-button>

          <ion-range
              v-model="effectValue"
              :min="-20"
              :max="20"
              step="1"
              color="danger"
              pin
              :snaps="true"
              @ionChange="updateEffectValue">
          </ion-range>

          <ion-button fill="clear" @click="incrementEffectValue" class="control-button">
            <ion-icon :icon="addCircleOutline" size="default"></ion-icon>
          </ion-button>
        </div>
      </div>

      <div class="icon-picker input">
        <ion-label color="danger" class="picker-label">Icon</ion-label>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div
            v-for="(iconName, key) in icons"
            :key="key"
            class="icon-option"
            :class="{ 'selected': icon === key }"
            @click="selectIcon(key)"
        >
          <ion-icon :icon="iconName" size="large"></ion-icon>
        </div>
      </div>
    </div>

    <ion-button expand="block" color="danger" @click="addCondition">Confirm</ion-button>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IonContent, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonRange } from "@ionic/vue";
import { bandage, fitness, happy, sad, star, flame, water, skull, flash, shield, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { Condition } from '@/model/Condition';
import { Type } from '@/model/Attribute';

export default defineComponent({
  name: "ConditionModal",
  components: {
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    IonRange
  },
  props: {
    type: {
      type: Number as PropType<Type>,
      required: true
    }
  },
  data() {
    return {
      name: "",
      effectValue: 0,
      icon: "bandage",
      icons: {
        bandage, fitness, happy, sad, star, flame, water, skull, flash, shield
      },
      addCircleOutline,
      removeCircleOutline
    }
  },
  methods: {
    addCondition() {
      if (this.name && this.effectValue !== undefined) {
        const newCondition = new Condition(
            this.name,
            this.type,
            Number(this.effectValue),
            this.icon
        );
        this.$emit('create', newCondition);
      }
    },
    getTypeName(type: Type): string {
      switch (type) {
        case Type.Body: return 'Body';
        case Type.Mind: return 'Mind';
        case Type.Social: return 'Social';
        default: return 'Unknown';
      }
    },
    selectIcon(iconName: string) {
      this.icon = iconName;
    },
    updateEffectValue(event: CustomEvent) {
      this.effectValue = event.detail.value as number;
    },
    incrementEffectValue() {
      if (this.effectValue < 10) {
        this.effectValue++;
      }
    },
    decrementEffectValue() {
      if (this.effectValue > -10) {
        this.effectValue--;
      }
    }
  }
});
</script>

<style scoped>
.modal-title {
  text-align: center;
  color: var(--ion-color-danger);
  margin-bottom: 1.5rem;
}

.input-container {
  margin-bottom: 1.5rem;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 1rem;
}

ion-input, ion-select {
  --padding-start: 0;
}

ion-label {
  color: var(--ion-color-medium);
}

ion-button {
  margin-top: 1rem;
}

.input {
  margin: 0 10px 20px 10px;
  border-radius: 10px !important;
  background-color: var(--ion-card-background);
}

.input-content {
  padding-left: 10px;
}

.input-value {
  margin-left: 10px;
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  padding: 10px;
}

.icon-option {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
}

.icon-option.selected {
  background-color: var(--ion-color-danger);
  color: white;
}

.picker-label {
  margin-bottom: 1px;
}

.effect-value-container {
  padding: 10px;
}

.points-control {
  display: flex;
  align-items: center;
  height: 60px; /* Increased height to accommodate larger buttons */
}

ion-range {
  flex-grow: 1;
}

.control-button {
  --padding-start: 8px;
  --padding-end: 8px;
  margin: 15px 0 0;
  color: var(--ion-color-danger);
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-button ion-icon {
  font-size: 24px; /* Increased icon size */
}

ion-range::part(pin) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  top: -25px;
}

ion-range::part(pin-value) {
  top: -1px;
}
</style>
