<template>
  <ion-content class="ion-padding">
    <h2 class="modal-title">Manage Attribute Points</h2>

    <div class="formula-container">
      <div class="formula-item">
        <div class="formula-label">Total</div>
        <div class="formula-value">{{ attributePoints }}</div>
      </div>
      <span class="formula-operator">-</span>
      <div class="formula-item">
        <div class="formula-label">Used</div>
        <div class="formula-value">{{ usedPoints }}</div>
      </div>
      <span class="formula-operator">=</span>
      <div class="formula-item result">
        <div class="formula-label">Available</div>
        <div class="formula-value">{{ remainingPoints }}</div>
      </div>
    </div>

    <universal-slider @update="points => currentPoints = points" :min-value="-remainingPoints" :max-value="200" slider-name="Add Points" :slider-value="currentPoints"></universal-slider>

    <ion-button expand="block" color="danger" @click="confirmChanges">Confirm</ion-button>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {IonContent, IonButton} from '@ionic/vue';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import UniversalSlider from "@/components/UniversalSlider.vue";

export default defineComponent({
  name: "PointModal",
  components: {
    UniversalSlider,
    IonContent,
    IonButton,
  },
  props: {
    attributePoints: {
      type: Number,
      required: true
    },
    usedPoints: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentPoints: 0,
      addCircleOutline,
      removeCircleOutline
    }
  },
  computed: {
    remainingPoints(): number {
      return this.attributePoints - this.usedPoints;
    }
  },
  methods: {
    confirmChanges() {
      this.$emit('points', this.attributePoints + this.currentPoints);
    },
  }
});
</script>

<style scoped>
.modal-title {
  text-align: center;
  color: var(--ion-color-danger);
  margin-bottom: 1.5rem;
}

.formula-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.formula-item {
  padding: 0.5rem;
  background-color: var(--ion-color-light);
  border-radius: 0.25rem;
  text-align: center;
  min-width: 70px;
}

.formula-label {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  margin-bottom: 0.2rem;
}

.formula-value {
  font-weight: bold;
}

.formula-operator {
  margin: 0 0.5rem;
}

.result {
  color: var(--ion-color-danger);
}

ion-range {
  flex-grow: 1;
}

ion-button[fill="clear"] {
  --color: var(--ion-color-danger);
}

ion-button[fill="clear"]:disabled {
  --color: var(--ion-color-medium);
}


</style>
