<template>
  <ion-content class="ion-padding">
    <h2 class="modal-title">{{ title }}</h2>

    <div class="input-container">
      <template v-for="(value, key) in content" :key="key">
        <div v-if="value === 'text'" class="input">
          <ion-item>
            <ion-label position="floating" color="danger" class="input-content">{{ key }}</ion-label>
            <ion-input v-model="formData[key]" type="text" class="input-value"></ion-input>
          </ion-item>
        </div>

        <div v-else-if="value === 'number'" class="input">
          <ion-item>
            <ion-label position="floating" color="danger" class="input-content">{{ key }}</ion-label>
            <ion-input v-model="formData[key]" type="number" class="input-value"></ion-input>
          </ion-item>
        </div>

        <div v-else-if="value === 'select'" class="input">
          <ion-item>
            <ion-label color="danger" class="input-content">{{ key }}</ion-label>
            <ion-select v-model="formData[key]" interface="popover" :placeholder="key">
              <ion-select-option v-for="option in selectOptions[key]" :key="option" :value="option">{{ option }}</ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <div v-else-if="value === 'range'" class="input effect-value-container">
          <ion-label color="danger" class="picker-label">{{ key }}: {{ formData[key] }}</ion-label>
          <div class="points-control">
            <ion-button fill="clear" @click="decrementValue(key)" class="control-button">
              <ion-icon :icon="removeCircleOutline" size="default"></ion-icon>
            </ion-button>

            <ion-range
                v-model="formData[key]"
                :min="rangeOptions[key]?.min || -20"
                :max="rangeOptions[key]?.max || 20"
                :step="rangeOptions[key]?.step || 1"
                color="danger"
                pin
                :snaps="true"
                @ionChange="updateRangeValue($event, key)">
            </ion-range>

            <ion-button fill="clear" @click="incrementValue(key)" class="control-button">
              <ion-icon :icon="addCircleOutline" size="default"></ion-icon>
            </ion-button>
          </div>
        </div>

        <div v-else-if="value === 'icon-picker'" class="icon-picker input">
          <ion-label color="danger" class="picker-label">{{ key }}</ion-label>
          <div class="icon-grid">
            <div
                v-for="(iconName, iconKey) in icons"
                :key="iconKey"
                class="icon-option"
                :class="{ 'selected': formData[key] === iconKey }"
                @click="selectIcon(key, iconKey)"
            >
              <ion-icon :icon="iconName" size="large"></ion-icon>
            </div>
          </div>
        </div>
      </template>
    </div>

    <ion-button expand="block" color="danger" @click="submitForm">Confirm</ion-button>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';
import { IonContent, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonRange, IonSelect, IonSelectOption } from "@ionic/vue";
import { bandage, fitness, happy, sad, star, flame, water, skull, flash, shield, addCircleOutline, removeCircleOutline } from 'ionicons/icons';

export default defineComponent({
  name: "UniversalModal",
  components: {
    IonContent, IonButton, IonInput, IonItem, IonLabel, IonIcon, IonRange, IonSelect, IonSelectOption
  },
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    selectOptions: {
      type: Object as PropType<Record<string, string[]>>,
      default: () => ({})
    },
    rangeOptions: {
      type: Object as PropType<Record<string, { min: number; max: number; step: number }>>,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const formData = reactive({} as Record<string, any>);
    const icons = {
      bandage, fitness, happy, sad, star, flame, water, skull, flash, shield
    };

    // Initialize formData based on content prop
    for (const key in props.content) {
      formData[key] = '';
    }

    const updateRangeValue = (event: CustomEvent, key: string) => {
      formData[key] = event.detail.value as number;
    };

    const incrementValue = (key: string) => {
      const max = props.rangeOptions[key]?.max || 20;
      if (formData[key] < max) {
        formData[key]++;
      }
    };

    const decrementValue = (key: string) => {
      const min = props.rangeOptions[key]?.min || -20;
      if (formData[key] > min) {
        formData[key]--;
      }
    };

    const selectIcon = (key: string, iconKey: string) => {
      formData[key] = iconKey;
    };

    const submitForm = () => {
      emit('submit', formData);
    };

    return {
      formData,
      icons,
      updateRangeValue,
      incrementValue,
      decrementValue,
      selectIcon,
      submitForm,
      addCircleOutline,
      removeCircleOutline
    };
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
  border-radius: 10px!important;
}

.input-content {
  padding-left: 10px;
}

.input-value {
  margin-left: 10px;
}

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
