<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="inventory-container">

        <!-- Main inventory grid -->
        <InventoryGrid
            :items="items"
            :edit-mode="editMode"
            @delete="deleteItem"
            @reorder="handleReorder"
            name="Inventory">
        </InventoryGrid>

        <!-- Add Item Modal -->
        <ion-modal
            class="bottom-sheet-modal"
            :is-open="addModalOpen"
            :initial-breakpoint="1"
            :breakpoints="[0, 1]"
            :backdrop-dismiss="true"
            @didDismiss="manageModal('close')">
          <AddItemModal
              @create="createItem"
              @createMultiple="createMultipleItems"
              @error="openToast">
          </AddItemModal>
        </ion-modal>

        <!-- FAB Menu -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="custom-fab">
          <ion-fab-button @click="toggleFabMenu" color="danger">
            <ion-icon :icon="ellipsisVertical" :class="{ 'rotate-icon': fabMenuOpen }"></ion-icon>
          </ion-fab-button>

          <transition-group
              name="fab-menu"
              tag="ion-fab-list"
              side="top"
              @enter="onEnter"
              @leave="onLeave">
            <ion-fab-button
                v-show="fabMenuOpen"
                key="add"
                size="small"
                @click="manageModal('add')"
                color="danger"
                data-index="0">
              <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
            <ion-fab-button
                v-show="fabMenuOpen"
                key="edit"
                size="small"
                @click="toggleEditMode"
                color="danger"
                data-index="1">
              <ion-icon :icon="pencil"></ion-icon>
            </ion-fab-button>
          </transition-group>
        </ion-fab>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonContent,
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  toastController
} from '@ionic/vue';
import {
  add,
  ellipsisVertical,
  pencil,
  cash,
} from 'ionicons/icons';
import { Item, ItemType } from '@/model/Item';
import InventoryGrid from '@/components/InventoryGrid.vue';
import AddItemModal from '@/components/Modals/ItemModal.vue';
import { DataController } from '@/stores/DataController';
import { useRoute } from 'vue-router';
import { Character } from '@/model/Character';

export default defineComponent({
  name: 'InventoryPage',
  components: {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    InventoryGrid,
    AddItemModal,
  },
  data() {
    return {
      items: [] as Item[],
      editMode: false,
      addModalOpen: false,
      fabMenuOpen: false,
    };
  },
  computed: {
    calculateTotalValue(): number {
      return this.items.reduce((total, item) => total + item.value, 0);
    },
  },
  methods: {
    // Data management methods
    async getData() {
      const character: Character = await this.dataController.getCurrentCharacter();
      this.updateUI(character);
    },

    updateUI(character: Character) {
      this.items = character.items;
    },

    async createItem(item: Item) {
      const result = await this.dataController.createItem(item);
      if (result !== null) {
        this.updateUI(result);
      }
      this.manageModal('close');
    },

    async createMultipleItems(items: Item[]) {
      for (const item of items) {
        await this.createItem(item);
      }
    },

    async deleteItem(item: Item) {
      console.log(item)
      const character: Character = await this.dataController.deleteItem(item);
      this.updateUI(character);
    },

    async handleReorder(reorderedItems: Item[]) {
      this.items = reorderedItems;
      await this.dataController.saveItemOrder(this.items);
    },

    // UI management methods
    manageModal(modalName: string) {
      this.fabMenuOpen = false;

      if (this.addModalOpen || modalName === 'close') {
        this.addModalOpen = false;
      } else if (modalName === 'add') {
        this.addModalOpen = true;
      }
    },

    toggleEditMode() {
      this.editMode = !this.editMode;
      this.fabMenuOpen = false;
    },

    toggleFabMenu() {
      this.fabMenuOpen = !this.fabMenuOpen;
    },

    async openToast(message: string) {
      const toast = await toastController.create({
        message: message,
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    },

    // Animation methods
    onEnter(el: Element, done: () => void) {
      const delay = Number(el.getAttribute('data-index')) * 100;
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'scale(1) translateY(0)';
        done();
      }, delay);
    },

    onLeave(el: Element, done: () => void) {
      const delay = (2 - Number(el.getAttribute('data-index'))) * 100;
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.transform = 'scale(0.4) translateY(40px)';
        done();
      }, delay);
    },
  },
  setup() {
    const dataController: DataController = new DataController();
    const route = useRoute();
    const { id } = route.params;

    return {
      id,
      dataController,
      ItemType,
      add,
      ellipsisVertical,
      pencil,
      cash,
    };
  },
  mounted() {
    this.getData();
  },
  ionViewWillEnter() {
    this.getData();
  },
});
</script>

<style scoped>

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.inventory-header h1 {
  margin: 0;
  color: var(--ion-color-danger);
  font-size: 24px;
}

.custom-fab {
  margin-bottom: 70px;
}

ion-fab-button {
  --border-radius: 15px;
}

.rotate-icon {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

ion-fab-list ion-fab-button {
  opacity: 0;
  transform: scale(0.4) translateY(40px);
  transition: all 0.3s ease-out;
}

.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: scale(0.4) translateY(40px);
}

.bottom-sheet-modal {
  --height: 75vh;
}
</style>
