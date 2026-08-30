<template>
  <div @click="isHovered(-1)" class="inventory-grid">
    <div class="grid-header">
      <h2>{{ name }}</h2>
      <div class="header-controls">
        <ion-chip color="medium" class="slot-counter">
          <ion-label>{{ items.length }} / 20 slots</ion-label>
        </ion-chip>
        <ion-button fill="clear" @click="presentFilterPopover($event)">
          <ion-icon :icon="funnel" class="filter-icon"></ion-icon>
        </ion-button>
      </div>
    </div>

    <div class="grid-container">
      <div v-for="(item, index) in filteredItems"
           :key="item.name"
           :id="index"
           class="item-card"
           @click.stop="isHovered(index)">
        <ion-card :class="['rpg-card', getTypeClass(item)]">
          <ion-card-content class="content">
            <div v-if="editMode || selectedItem === index" class="item-actions">
              <ion-button fill="clear" color="danger" @click.stop="$emit('delete', item)">
                <ion-icon :icon="trash"></ion-icon>
              </ion-button>
            </div>

            <div class="item-icon-wrapper">
              <div class="item-icon" >
                <i :class="['ra', `ra-${item.icon}`]"></i>
              </div>
              <div :class="['item-quantity', getAmountClass(item)]">{{ item.value }}</div>
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <ion-chip class="type-chip" :color="getTypeColor(item)">
                {{ ItemType[item.type] }}
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  popoverController
} from '@ionic/vue';
import {
  trash,
  funnel,
  shield,
  flame,
  hammer,
  flask,
  cash
} from 'ionicons/icons';
import { Item, ItemType } from '@/model/Item';
import ItemFilterPopover from './ItemFilterPopover.vue';
import 'rpg-awesome/css/rpg-awesome.min.css';

export default defineComponent({
  name: 'InventoryGrid',
  components: {
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel
  },
  props: {
    name: String,
    items: {
      type: Array as () => Item[],
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentFilter: 'all',
      selectedItem: -1,
      ItemType
    };
  },
  computed: {
    filteredItems() {
      if (this.currentFilter === 'all') return this.items;
      return this.items.filter(item =>
          ItemType[item.type].toLowerCase() === this.currentFilter
      );
    }
  },
  methods: {
    async presentFilterPopover(e: Event) {
      const popover = await popoverController.create({
        component: ItemFilterPopover,
        event: e,
        translucent: true,
        componentProps: {
          currentFilter: this.currentFilter,
          handleFilterChange: (filter: string) => {
            this.currentFilter = filter;
            popover.dismiss();
          }
        }
      });
      await popover.present();
    },
    isHovered(index: number) {
      console.log(index)
      if (index === -1) this.selectedItem = -1;
      const element = document.getElementById(String(index))
      if (element === null) return
      if (element.matches(":hover")) {
        this.selectedItem = index;
      }
    },
    getIconForItem(item: Item) {
      switch(item.type) {
        case ItemType.Weapon: return flame;
        case ItemType.Clothing: return shield;
        case ItemType.Tool: return hammer;
        case ItemType.Consumable: return flask;
        case ItemType.Miscellaneous: return cash;
        default: return flame;
      }
    },
    getTypeClass(item: Item) {
      return `type-${ItemType[item.type].toLowerCase()}`;
    },
    getAmountClass(item: Item) {
      return `amount-${ItemType[item.type].toLowerCase()}`;
    },
    getTypeColor(item: Item): string {
      switch(item.type) {
        case ItemType.Weapon: return 'danger';
        case ItemType.Clothing: return 'primary';
        case ItemType.Tool: return 'warning';
        case ItemType.Consumable: return 'success';
        case ItemType.Miscellaneous: return 'tertiary';
        default: return 'medium';
      }
    }
  },
  setup() {
    return {
      trash,
      funnel
    };
  }
});
</script>

<style scoped>
.inventory-grid {
  height: 100%;
  padding: 16px;
  background: var(--ion-background-color);
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 8px;
}

.grid-header h2 {
  color: var(--ion-color-danger);
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slot-counter {
  font-size: 0.9em;
  height: 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  padding-bottom: 120px;
}

.item-card {
  position: relative;
  margin-bottom: 5px;
}

.rpg-card {
  margin: 0;
  height: 100%;
  border-radius: 12px;
  background: var(--ion-card-background);
  transition: transform 0.2s, box-shadow 0.2s;
}

.rpg-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.item-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.item-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--ion-color-light);
  margin-bottom: 8px;
}

.item-icon i {
  font-size: 36px;
  color: var(--ion-color-medium);
}

.filter-icon {
  color: var(--ion-color-medium);
}

.item-quantity {
  position: absolute;
  bottom: -62px;
  right: -22px;
  background: var(--ion-color-danger);
  color: white;
  border-radius: 12px;
  padding: 3px 10px 10px 5px;
  font-size: 0.8em;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.item-details {
  text-align: center;
}


.item-details h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
  color: var(--ion-color-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-chip {
  margin-top: 4px;
  height: 20px;
  font-size: 0.7em;
}

.item-actions {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}

.item-actions ion-button {
  margin: 0;
  --padding-start: 4px;
  --padding-end: 4px;
  height: 30px;
}

.content {
  padding-bottom: 7px;
  padding-top: 2px;
}

/* Type-specific styling */
.type-weapon {
  border-left: 3px solid var(--ion-color-danger);
}

.type-clothing {
  border-left: 3px solid var(--ion-color-primary);
}

.type-tool {
  border-left: 3px solid var(--ion-color-warning);
}

.type-consumable {
  border-left: 3px solid var(--ion-color-success);
}

.type-miscellaneous {
  border-left: 3px solid var(--ion-color-tertiary);
}

.amount-weapon {
  background-color: var(--ion-color-danger);
}

.amount-clothing {
  background-color: var(--ion-color-primary);
}

.amount-tool {
  background-color: var(--ion-color-warning);
}

.amount-consumable {
  background-color: var(--ion-color-success);
}

.amount-miscellaneous {
  background-color: var(--ion-color-tertiary);
}


@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }

  .item-icon {
    width: 50px;
    height: 50px;
  }

  .item-icon i {
    font-size: 40px;
  }
}
</style>
