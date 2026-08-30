<template>
  <div class="attribute-list">
    <div class="list-header">
      <h2>{{ name }}</h2>
      <div class="sort-controls">
        <ion-button fill="clear" @click="presentPopover($event)">
          <ion-icon :icon="funnel" class="sort-icon"></ion-icon>
        </ion-button>
      </div>
      <div>
        <ion-badge color="danger" class="type-level-badge">{{ typeLevel }}</ion-badge>
      </div>

    </div>


    <div class="conditions-display">
      <ion-chip
          v-for="condition in conditions"
          :key="condition.name"
          outline
          :color="condition.effectValue >= 0 ? 'success' : 'danger'">
        <ion-icon :icon="getIconForCondition(condition)"></ion-icon>
        <ion-label>{{ condition.name }} ({{ condition.effectValue > 0 ? '+' : ''}}{{ condition.effectValue }})</ion-label>
        <ion-icon :icon="close" @click="$emit('remove', condition)"></ion-icon>
      </ion-chip>
    </div>

    <ion-content class="scroller">
      <ion-reorder-group :disabled="false" @ionItemReorder="handleReorder($event)">
        <ion-item class="attribute-card" v-for="(item, index) in internalList" :key="item.name">
          <ion-card @click="editSpec(index)"
                    :class="[{
                      'full-skill-max': item.tier === 0 && item.value >= 100,
                      'small-skill-max': item.tier === 1 && item.value >= 100,
                      'deficit-skill-max': item.tier === 2 && item.value >= 100
                    }]">
            <ion-card-header>
              <ion-card-subtitle>{{ proficiency(item) }}</ion-card-subtitle>
              <ion-card-title>{{ item.name }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <div class="attribute-info">
                <div class="thermometer">
                  <div :class="[{ 'circle': true,
                  'full-skill-circle': item.tier === 0,
                  'small-skill-circle': item.tier === 1,
                  'deficit-skill-circle': item.tier === 2}]">{{ item.value }}</div>
                  <div class="bar-container">
                    <div :class="[{ 'bar': true,
                    'full-skill-bar': item.tier === 0,
                    'small-skill-bar': item.tier === 1,
                    'deficit-skill-bar' : item.tier === 2}]"
                         :style="{ width: `${(item.value / 100) * 100}%` }">
                    </div>
                  </div>
                  <ion-badge :class="[{
                   'full-skill-circle': item.tier === 0,
                   'small-skill-circle': item.tier === 1,
                   'deficit-skill-circle': item.tier === 2}]" class="adjusted-badge">{{ getResultLevel(item) }}</ion-badge>
                </div>
              </div>

              <div @click.stop class="attribute-actions" v-if="editLevel || specLvlUp === index">
                <div class="action-group">
                  <ion-button @click="$emit('levelUp', item, -10)" fill="clear" color="danger" class="small-button">
                    -10
                  </ion-button>
                  <ion-button @click="$emit('levelUp', item, -1)" fill="clear" color="danger">
                    <ion-icon :icon="remove"></ion-icon>
                  </ion-button>
                </div>
                <ion-button @click="$emit('delete', item)" fill="clear" color="danger">
                  <ion-icon :icon="trash"></ion-icon>
                </ion-button>
                <div class="action-group">
                  <ion-button @click="$emit('levelUp', item, 1)" fill="clear" color="danger">
                    <ion-icon :icon="add"></ion-icon>
                  </ion-button>
                  <ion-button @click="$emit('levelUp', item, 10)" fill="clear" color="danger" class="small-button">
                    +10
                  </ion-button>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
          <ion-reorder v-if="editLevel || specLvlUp === index"></ion-reorder>
        </ion-item>
      </ion-reorder-group>
    </ion-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonContent,
  IonChip,
  IonLabel,
  IonReorderGroup,
  IonReorder,
  IonItem,
  popoverController
} from "@ionic/vue";
import {
  add, remove, trash, close,
  bandage, fitness, happy, sad, star, flame, water, skull, flash, shield, funnel
} from "ionicons/icons";
import { Attribute } from "@/model/Attribute";
import { Condition } from "@/model/Condition";
import SortPopover from "@/components/SortPopover.vue";

export default defineComponent({
  name: "AttributeList",
  components: {
    IonBadge, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonContent, IonChip, IonLabel,
    IonReorderGroup, IonReorder, IonItem
  },
  props: {
    name: String,
    list: {
      type: Array as () => Attribute[],
      default: () => []
    },
    typeLevel: Number,
    editLevel: Boolean,
    conditions: Array,
    initialSort: {
      type: String,
      default: 'custom'
    }
  },
  data() {
    return {
      currentSort: this.initialSort,
      internalList: this.list ? [...this.list] : [],
      specLvlUp: -1
    };
  },
  computed: {
    sortedList(): Attribute[] {
      switch (this.currentSort) {
        case 'alphabetical':
          return [...this.internalList].sort((b, a) => a.name.localeCompare(b.name));
        case 'value':
          return [...this.internalList].sort((b, a) => b.value - a.value);
        default:
          return this.internalList;
      }
    },
    proficiency() {
      return (attribute: Attribute) => {
        if (!attribute || typeof attribute.type === 'undefined' || typeof attribute.value === 'undefined') {
          console.warn('Invalid attribute:', attribute);
          return "Unknown";
        }

        const skillDescriptors = {
          0: [
            "Untrained", "Amateur", "Apprentice", "Practitioner", "Competent",
            "Skilled", "Proficient", "Advanced", "Expert", "Master", "Virtuoso", "Legendary",
          ],
          1: [
            "Aware", "Curious", "Learner", "Informed", "Knowledgeable",
            "Proficient", "Educated", "Specialist", "Expert", "Authority", "Master", "Genius"
          ],
          2: [
            "Inept", "Awkward", "Timid", "Basic", "Capable", "Confident",
            "Engaging", "Compelling", "Persuasive", "Charismatic", "Inspirational",
            "Influential", "Commanding"
          ]
        };

        const relevantCategory = skillDescriptors[attribute.type];
        if (!relevantCategory) {
          console.warn(`Unknown attribute type: ${attribute.type}`);
          return "Unknown";
        }

        const index = Math.max(0, Math.min(Math.round(attribute.value / 10) - 1, relevantCategory.length - 1));
        return attribute.tier === 1 ? "Small" : relevantCategory[index];
      };
    },
  },
  watch: {
    list: {
      handler(newList: Attribute[]) {
        this.internalList = newList;
      },
      deep: true
    },
    editLevel(newValue: boolean) {
      if (newValue) {
        this.specLvlUp = -1;
      }
    }
  },
  methods: {
    async presentPopover(e: Event) {
      const popover = await popoverController.create({
        component: SortPopover, // Use the actual component, not a string
        event: e,
        translucent: true,
        componentProps: {
          currentSort: this.currentSort,
          handleSortChange: this.handleSortChange
        }
      });

      await popover.present();
    },
    handleSortChange(sortType: string) {
      this.currentSort = sortType;
      let sortedList = [...this.internalList];
      switch (sortType) {
        case 'alphabetical':
          sortedList.sort((b, a) => a.name.localeCompare(b.name));
          break;
        case 'value':
          sortedList.sort((b, a) => a.value - b.value);
          break;
        case 'tier':
          sortedList.sort((a, b) => a.tier - b.tier);
          break;
      }
      this.internalList = sortedList;
      this.$emit('reorder', sortedList);
      popoverController.dismiss();
    },

    handleReorder(event: CustomEvent) {
      const itemToMove = this.internalList.splice(event.detail.from, 1)[0];
      this.internalList.splice(event.detail.to, 0, itemToMove);
      this.specLvlUp = event.detail.to
      console.log(this.internalList)
      this.$emit('reorder', this.internalList);
      event.detail.complete();
    },

    editSpec(index: number) {
      if (this.name === undefined || this.name.length === 0 || this.editLevel) return;
      this.specLvlUp = this.specLvlUp === index ? -1 : index;
    },

    getIconForCondition(condition: Condition) {
      switch(condition.icon) {
        case "bandage": return bandage;
        case "fitness": return fitness;
        case "happy": return happy;
        case "sad": return sad;
        case "star": return star;
        case "flame": return flame;
        case "water": return water;
        case "skull": return skull;
        case "flash": return flash;
        case "shield": return shield;
        default: return bandage;
      }
    },

    getResultLevel(attribute: Attribute) {
      if (attribute.tier === 2 || this.typeLevel === undefined) return attribute.value
      else return attribute.value + this.typeLevel
    },
  },
  setup() {
    return {
      add, remove, trash, close,
      bandage, fitness, happy, sad, star, flame, water, skull, flash, shield, funnel, popoverController
    };
  }
});
</script>

<style scoped>
.attribute-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 16px 16px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h2 {
  font-size: 24px;
  margin: 0;
  color: var(--ion-color-danger);
}

.type-level-badge {
  font-size: 18px;
  padding: 4px 8px;
}

.sort-icon {
  font-size: 20px;
  color: var(--ion-color-medium);
}

.sort-controls {
  margin-left: 200px;
}

ion-content {
  --padding-bottom: 120px;
}

.attribute-card {
  margin: 15px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.attribute-info {
  margin-bottom: 12px;
}

.bar {
  height: 100%;
  border-radius: 0 5px 5px 0;
}

.full-skill-bar {
  background-color: var(--ion-color-danger);
}

.adjusted-badge {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.attribute-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.action-group {
  display: flex;
  align-items: center;
}

.attribute-actions ion-button {
  --padding-start: 4px;
  --padding-end: 4px;
  height: 30px;
}

.small-button {
  font-size: 1em;
  --padding-start: 4px;
  --padding-end: 4px;
}

ion-card-subtitle {
  font-size: 12px;
  color: var(--ion-color-medium);
}

ion-card-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
}

ion-card-content {
  padding-top: 0;
}

.thermometer {
  display: flex;
  align-items: center;
  position: relative;
  height: 30px;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  z-index: 1;
  font-size: 14px;
}

.full-skill-circle {
  background-color: var(--ion-color-danger);
}

.small-skill-circle {
  background-color: var(--ion-color-warning);
  color: var(--ion-color-warning-contrast);
}

.deficit-skill-circle {
  background-color: darkorange;
  color: var(--ion-color-warning-contrast);
}

.bar-container {
  flex-grow: 1;
  height: 10px;
  background-color: var(--ion-color-light);
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  margin-left: -15px;
}

.adjusted-badge {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  padding: 4px 8px;
  font-weight: bold;
}

.small-skill-bar {
  background-color: var(--ion-color-warning);
}

.deficit-skill-bar {
  background-color: darkorange;
}

.deficit-skill-max {
  border: darkorange;
}

.small-skill-max {
  border: 2px solid var(--ion-color-warning);
}

.full-skill-max {
  border: 2px solid var(--ion-color-danger);
}

.small-skill-label {
  color: var(--ion-color-warning);
  font-weight: bold;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-card {
  margin: 5px 0;
  width: 100%;
}

ion-reorder {
  margin-right: 10px;
}
</style>
