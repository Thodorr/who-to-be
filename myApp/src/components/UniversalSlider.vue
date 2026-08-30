<template>
  <div class="input slider-value-container">
    <ion-label color="danger" class="picker-label">{{ sliderName }}</ion-label>
    <div class="points-control">
      <ion-button fill="clear" @click="decrementSliderValue" class="control-button">
        <ion-icon :icon="removeCircleOutline" size="default"></ion-icon>
      </ion-button>

      <ion-range
          v-model="internalSliderValue"
          :min="minValue"
          :max="maxValue"
          step="1"
          color="danger"
          pin
          :snaps="true"
          @ionChange="updateSliderValue">
      </ion-range>

      <ion-button fill="clear" @click="incrementSliderValue" class="control-button">
        <ion-icon :icon="addCircleOutline" size="default"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonLabel, IonButton, IonIcon, IonRange } from "@ionic/vue";
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';

export default defineComponent({
  name: "Universal-Slider",
  components: {
    IonLabel, IonButton, IonIcon, IonRange
  },
  props: {
    sliderValue: {
      type: Number,
      required: true
    },
    sliderName: {
      type: String,
      required: true
    },
    maxValue: {
      type: Number,
      required: true
    },
    minValue: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      internalSliderValue: this.sliderValue
    };
  },
  watch: {
    sliderValue(newValue) {
      this.internalSliderValue = newValue;
    }
  },
  emits: ["update"],
  methods: {
    decrementSliderValue() {
      if (this.internalSliderValue > this.minValue) {
        this.internalSliderValue--;
        this.$emit("update", this.internalSliderValue);
      }
    },
    incrementSliderValue() {
      if (this.internalSliderValue < this.maxValue) {
        this.internalSliderValue++;
        this.$emit("update", this.internalSliderValue);
      }
    },
    updateSliderValue(event: CustomEvent) {
      this.internalSliderValue = event.detail.value;
      this.$emit("update", this.internalSliderValue);
    }
  },
  setup() {
    return {
      addCircleOutline,
      removeCircleOutline,
    }
  }
});
</script>

<style scoped>

.input {
  margin: 0 10px 20px 10px;
  border-radius: 10px !important;
  background-color: var(--ion-card-background);
}

.picker-label {
  margin-bottom: 1px;
}

.slider-value-container {
  padding: 10px;
}

.points-control {
  display: flex;
  align-items: center;
  height: 60px;
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
  font-size: 24px;
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
