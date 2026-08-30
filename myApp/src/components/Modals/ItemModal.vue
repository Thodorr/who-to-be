<template>
  <ion-content class="ion-padding">
    <h2 class="modal-title">Add new Item</h2>

    <ion-segment v-model="selectedTab" color="danger">
      <ion-segment-button value="new">
        <ion-label>Create New</ion-label>
      </ion-segment-button>
      <ion-segment-button value="existing">
        <ion-label>Select Existing</ion-label>
      </ion-segment-button>
    </ion-segment>

    <div v-if="selectedTab === 'new'" class="input-container">
      <ion-item class="input">
        <ion-label class="input-content" position="floating" color="danger">Name</ion-label>
        <ion-input class="input-content" v-model="name" type="text"></ion-input>
      </ion-item>

      <ion-item class="input">
        <ion-label class="input-content" color="danger">Type</ion-label>
        <ion-select v-model="type" interface="popover">
          <ion-select-option v-for="(value, key) in enumTypes"
                             :key="key"
                             :value="key">
            {{ value }}
          </ion-select-option>
        </ion-select>
      </ion-item>


      <universalSlider
            @update="amount => {value = amount}"
            :slider-value="1"
            :slider-name="'Amount'"
            :max-value="20"
            :min-value="1">
      </universalSlider>

      <div class="icon-picker input">
        <ion-label color="danger" class="picker-label">Icon</ion-label>
        <div
            v-for="iconClass in typeIcons"
            :key="iconClass"
            class="icon-option"
            :class="{ 'selected': icon === iconClass }"
            @click="selectIcon(iconClass)"
        >
          <i :class="['ra', `ra-${iconClass}`]"></i>
        </div>
      </div>

    </div>


    <div v-else class="input-container">
      <ion-searchbar v-model="searchTerm"
                     placeholder="Search items">
      </ion-searchbar>

      <ion-list>
        <ion-item v-for="item in filteredPresetItems"
                  :key="item.name"
                  button
                  @click="selectPresetItem(item)">
          <i :class="['icon', 'ra', `ra-${item.icon}`]"></i>
          <ion-label>
            <h2>{{ item.name }}</h2>
          </ion-label>
          <ion-input
              type="number"
              v-model="item.quantity"
              min="1"
              placeholder="Qty"
              class="quantity-input"
              v-if="item.selected"
              @click.stop
          ></ion-input>
          <ion-checkbox slot="end"
                        v-model="item.selected"
                        color="danger"
                        @click.stop>
          </ion-checkbox>
        </ion-item>
      </ion-list>
    </div>


    <ion-button expand="block"
                color="danger"
                @click="handleConfirm">
      Add to Inventory
    </ion-button>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSearchbar,
  IonList,
  IonCheckbox
} from '@ionic/vue';
import { Item, ItemType } from '@/model/Item';
import itemsData from '@//stores/items.json';
import UniversalSlider from "@/components/UniversalSlider.vue";

interface PresetItem {
  name: string;
  value: number;
  type: ItemType;
  icon: string;
  description: string;
  selected: boolean;
  quantity?: number;
}

export default defineComponent({
  name: 'AddItemModal',
  components: {
    UniversalSlider,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSearchbar,
    IonList,
    IonCheckbox
  },
  data() {
    return {
      selectedTab: 'new',
      name: '',
      type: ItemType.Weapon,
      value: 1, // Default quantity is 1
      icon: 'flame',
      searchTerm: '',
      presetItems: [] as PresetItem[],
      ItemType,
      weaponIcons: [
        'sword',
        'axe',
        'crossbow',
        'shield',
        'arrow-cluster',
        'bear-trap',
        'bowie-knife',
        'boomerang',
        'bombs',
        'revolver',
        'mp5',
        'cluster-bomb',
      ],
      toolIcons: [
        'chain',
        'explosive-materials',
        'hand-saw',
        'hammer',
        'shovel',
        'telescope',
        'compass',
        'key-basic',
        'wrench',
        'microphone',
        'quill-ink',
        'torch',
      ],
      clothingIcons: [
        'boot-stomp',
        'vest',
        'ankh',
        'arena',
        'knight-helmet',
        'arcane-mask',
        'fedora',
        'hand',
        'hood',
        'queen-crown',
        'helmet',
        'nuclear',
      ],
      consumableIcons: [
        'apple',
        'beer',
        'brandy-bottle',
        'carrot',
        'cheese',
        'meat',
        'knife-fork',
        'leaf',
        'pill',
        'vial',
        'round-bottom-flask',
        'super-mushroom',
      ],
      miscIcons: [
        'vase',
        'book',
        'ammo-bag',
        'ball',
        'jigsaw-piece',
        'lighthouse',
        'stopwatch',
        'spiral-shell',
        'cog',
        'unplugged',
        'spades-card',
        'sapphire',
      ],
    };
  },
  computed: {
    filteredPresetItems() {
      return this.presetItems.filter(item =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    enumTypes() {
      return Object.entries(this.ItemType)
          .filter(([key, value]) => typeof value === "number")
          .map(([text, value]) => (text));
    },
    typeIcons() {
      let availableIcons = []
      switch(this.type) {
        case ItemType.Weapon:
          availableIcons = this.weaponIcons;
          break;
        case ItemType.Clothing:
          availableIcons = this.clothingIcons
          break;
        case ItemType.Consumable:
          availableIcons = this.consumableIcons
          break;
        case ItemType.Tool:
          availableIcons = this.toolIcons
          break;
        case ItemType.Miscellaneous:
          availableIcons = this.miscIcons
          break;
      }
      return availableIcons
    }
  },
  methods: {
    handleConfirm() {
      if (this.selectedTab === 'new') {
        if (!this.name) {
          this.$emit('error', 'Name is required!');
          return;
        }
        if (this.value < 1) {
          this.$emit('error', 'Quantity must be at least 1!');
          return;
        }
        const newItem = new Item(
            this.name,
            this.value,
            this.type,
            this.icon
        );
        this.$emit('create', newItem);
      } else {
        const selectedItems = this.presetItems
            .filter(item => item.selected && item.quantity && item.quantity > 0)
            .map(item => new Item(
                item.name,
                item.quantity || 1,
                item.type,
                item.icon
            ));
        if (selectedItems.length === 0) {
          this.$emit('error', 'Please select at least one item and specify quantity!');
          return;
        }
        this.$emit('createMultiple', selectedItems);
      }
    },
    selectPresetItem(item: PresetItem) {
      item.selected = !item.selected;
      if (item.selected && !item.quantity) {
        item.quantity = 1;
      }
    },
    loadItemsFromJSON() {
      this.presetItems = itemsData.map(item => ({
        ...item,
        selected: false,
        quantity: undefined
      }));
    },
    getIconForItem(item: Item) {
      switch(item.type) {
        case ItemType.Weapon: return 'sword';
        case ItemType.Clothing: return 'shield';
        case ItemType.Tool: return 'key';
        case ItemType.Consumable: return 'potion';
        case ItemType.Miscellaneous: return 'gem';
        default: return 'sword';
      }
    },
    selectIcon(iconClass: string) {
      this.icon = iconClass;
    },
  },
  mounted() {
    this.loadItemsFromJSON();
  },

});
</script>

<style scoped>
.modal-title {
  text-align: center;
  color: var(--ion-color-danger);
  margin-bottom: 1.5rem;
}

.input-container {
  margin: 1.5rem 0;
}

.input {
  margin: 0 10px 20px 10px;
  border-radius: 10px !important;
  background-color: var(--ion-card-background);
}

ion-item {
  --padding-start: 0;
  margin-bottom: 1rem;
}

ion-searchbar {
  padding: 0;
}

ion-button {
  margin-top: 1rem;
}

.quantity-input {
  max-width: 80px;
  text-align: center;
  margin-right: 8px;
}

ion-label {
  color: grey;
}

.icon {
  margin-right: 16px; /* Adjust spacing as needed */
  font-size: 24px; /* Adjust font size to match icon size */
  color: var(--ion-color-danger); /* Match the icon color */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.input-content {
  padding-left: 10px !important;
}
.icon-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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
  margin-bottom: 10px;
  grid-column: 1 / -1;
}

i {
  font-size: 35px;
}

</style>
