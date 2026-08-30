<template>
  <ion-page>

    <ion-content :fullscreen="true">
      <div class="background">
        <swiper
            :modules="modules"
            @swiper="onSwiperInitialized"
            @slideChange="onSlideChange"
            class="attribute-swiper"
            :touchStartPreventDefault="false"
            :simulateTouch="false"
            :allow-touch-move="false">
          <swiper-slide v-for="(type, index) in [Type.Body, Type.Mind, Type.Social]" :key="index" class="attribute-slide">
            <div class="list-wrapper" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
              <AttributeList
                  @levelUp="levelUp"
                  @delete="deleteAttribute"
                  @remove="removeCondition"
                  @reorder="handleReorder"
                  :name="getTypeName(type)"
                  :list="filterAttributes(type)"
                  :conditions="getTypeConditions(type)"
                  :type-level="getCurrentTypeLevel(type)"
                  :editLevel="editLevel"
                  :initialSort="currentSort[type]">
              </AttributeList>
            </div>
          </swiper-slide>
          <div class="pagination"></div>
        </swiper>

        <!-- Enhanced skill points display -->
        <div class="skill-points-display" @click="manageModal('point')">
          <div class="skill-points-content">
            <span class="skill-points-label">Available Attribute-Points:</span>
            <span class="skill-points-value">{{ attributePoints - usedPoints }}</span>
          </div>
        </div>

        <ion-modal
            :is-open="conditionModalOpen"
            :initial-breakpoint="0.7"
            :breakpoints="[0, 0.7]"
            :backdrop-dismiss="true"
            @didDismiss="manageModal('close')">
          <ConditionModal :type="currentType" @create="addCondition"></ConditionModal>
        </ion-modal>

        <ion-modal
            :is-open="modalOpen"
            :initial-breakpoint="0.7"
            :breakpoints="[0, 0.7]"
            :backdrop-dismiss="true"
            @didDismiss="manageModal('close')">
          <InputGenerator
              :title="modalConfig.title"
              :content="modalConfig.content"
              :selectOptions="modalConfig.selectOptions"
              :rangeOptions="modalConfig.rangeOptions"
              @submit="handleModalSubmit"
          />
          <!-- <ConditionModal :type="currentType" @create="addCondition"></ConditionModal> -->
        </ion-modal>

        <ion-modal
            class="bottom-sheet-modal list-modal"
            :is-open="addModalOpen"
            :initial-breakpoint="1"
            :breakpoints="[0, 0.5, 1]"
            :backdrop-dismiss="true"
            @didDismiss="manageModal('close')">
          <AddModal @create="createAttribute"
                    @createMultiple="createMultipleAttributes"
                    @error="openToast"
                    :current-type="currentType"
                    :remaining-points="attributePoints - usedPoints">
          </AddModal>
        </ion-modal>

        <ion-modal
            class="bottom-sheet-modal point-modal"
            :is-open="pointModalOpen"
            :initial-breakpoint="1"
            :breakpoints="[0, 0.35, 0.5, 1]"
            :backdrop-dismiss="true"
            @didDismiss="manageModal('close')">
          <PointModal :used-points="usedPoints" :attribute-points="attributePoints" @points="changeAttributePoints" ></PointModal>
        </ion-modal>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="custom-fab">
          <ion-fab-button @click="toggleFabMenu" color="danger">
            <ion-icon :icon="ellipsisVertical" :class="{ 'rotate-icon': fabMenuOpen }"></ion-icon>
          </ion-fab-button>

          <transition-group
              name="fab-menu"
              tag="ion-fab-list"
              side="top"
              @enter="onEnter"
              @leave="onLeave"
          >
            <ion-fab-button
                v-show="fabMenuOpen"
                key="add"
                size="small"
                @click="manageModal('add')"
                color="danger"
                data-index="0"
            >
              <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
            <ion-fab-button
                v-show="fabMenuOpen"
                key="condition"
                size="small"
                @click="manageModal('condition')"
                color="danger"
                data-index="1"
            >
              <ion-icon :icon="medkit"></ion-icon>
            </ion-fab-button>
            <ion-fab-button
                v-show="fabMenuOpen"
                key="edit"
                size="small"
                @click="initLevelUp"
                color="danger"
                data-index="2"
            >
              <ion-icon :icon="pencil"></ion-icon>
            </ion-fab-button>
          </transition-group>
        </ion-fab>

      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonPage,
  toastController
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {Attribute, Tier, Type} from "@/model/Attribute";
import AttributeList from "@/components/AttributeList.vue";
import {add, ellipsisVertical, barbell, people, school, pencil, bandage, fitness, happy, medkit, close} from "ionicons/icons";
import AddModal from "@/components/Modals/AddModal.vue";
import PointModal from "@/components/Modals/PointModal.vue";
import ConditionModal from "@/components/Modals/ConditionModal.vue";
import {useRoute} from "vue-router";
import {DataController} from "@/stores/DataController";
import {Character} from "@/model/Character";
import {Swiper, SwiperSlide} from "swiper/vue";
import {Pagination} from "swiper";
import { Swiper as SwiperClass} from 'swiper';


import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import {Condition} from "@/model/Condition";
import InputGenerator from "@/components/InputGenerator.vue";

export default defineComponent({
  name: 'HomePage',
  components: {
    PointModal,
    AddModal,
    AttributeList,
    IonContent,
    IonPage,
    IonFab,
    IonModal,
    IonFabButton,
    IonIcon,
    Swiper,
    SwiperSlide,
    InputGenerator,
    ConditionModal
  },
  data () {
    return {
      showList: [new Attribute("Jumping", Type.Body, 10)],
      tableName: "Body",
      currentType: Type.Body,
      addModalOpen: false,
      pointModalOpen: false,
      conditionModalOpen: false,
      editLevel: false,
      attributePoints: 400,
      usedPoints: 0,
      currentSlideIndex: 0,
      swiperInstance: null as SwiperClass | null,
      touchStartX: 0,
      touchStartY: 0,
      isSwiping: false,
      groupedConditions: {
        [Type.Body]: [],
        [Type.Mind]: [],
        [Type.Social]: []
      } as Record<Type, Condition[]>,
      modalConfig: {
        title: '',
        content: {},
        selectOptions: {},
        rangeOptions: {}
      },
      modalOpen: false,
      fabMenuOpen: false,
      currentSort: {
        [Type.Body]: 'custom',
        [Type.Mind]: 'custom',
        [Type.Social]: 'custom',
      },
    }
  },
  methods: {
    //Data Related
    async createAttribute (attribute: Attribute) {
      const result = await this.dataController.createAttribute(attribute);
      if (result !== null) {
        this.updateUI(result);
        this.changeList(result.attributes[result.attributes.length-1].type);
      } else {
        await this.openToast('Not enough points.')
      }
      this.manageModal('close');
    },
    async createMultipleAttributes(attributes: Attribute[]) {
      for (const attribute of attributes) {
        await this.createAttribute(attribute);
      }
    },
    async levelUp(attribute: Attribute, amount: number) {
      const result = await this.dataController.levelUp(attribute, amount);
      if (result !== null) {
        this.updateUI(result)
      } else {
        await this.openToast('Not enough points.')
      }
      this.changeList(this.currentType);
    },
    async deleteAttribute (attribute: Attribute) {
      const character: Character = await this.dataController.deleteAttribute(attribute)
      this.updateUI(character);
    },
    async changeAttributePoints(amount: number) {
      this.attributePoints = await this.dataController.changeAttributePoints(amount);
      this.manageModal('points');
    },
    async getData () {
      const character: Character = await this.dataController.getCurrentCharacter();
      this.updateUI(character);
    },
    async addCondition(condition: Condition) {
      const character: Character = await this.dataController.addCondition(condition);
      this.updateUI(character);
      this.manageModal('close');
    },
    async removeCondition( condition: Condition) {
      const character: Character = await this.dataController.removeCondition(condition);
      this.updateUI(character);
    },
    getConditionModifierForType(type: Type): number {
      return this.groupedConditions[type].reduce((sum, condition) => sum + condition.effectValue, 0);
    },
    getCurrentTypeLevel(type: Type): number {
      let level = 0;
      let typeList = this.filterAttributes(type);
      for (let attribute of typeList) {
        if (attribute.tier === Tier.Small) level += attribute.value / 2
        else level += attribute.value
      }

      level = Math.floor(level / 10);

      const conditionModifier = this.getConditionModifierForType(type);

      return level + conditionModifier;
    },



    //UI Related
    updateUI(character: Character) {
      this.attributeList = character.attributes;
      this.attributePoints = character.attributePoints;
      this.usedPoints = character.usedPoints;
      this.groupConditions(character.conditions);
      this.changeList(this.currentType);

      // Reset the current sort for each type
      this.currentSort = {
        [Type.Body]: 'custom',
        [Type.Mind]: 'custom',
        [Type.Social]: 'custom',
      };
    },

    changeList (type: Type) {
      this.showList = this.attributeList.filter((attribute: any) => attribute.type === type)

      switch (type) {
        case Type.Body:
          this.tableName = "Body";
          this.currentType = Type.Body;
          break;
        case Type.Mind:
          this.tableName = "Mind";
          this.currentType = Type.Mind;
          break;
        case Type.Social:
          this.tableName = "Social";
          this.currentType = Type.Social;
          break;
      }
    },
    manageModal (modalName: string) {
      this.fabMenuOpen = false;

      if (this.addModalOpen || this.pointModalOpen || modalName === 'close') {
        this.addModalOpen = false;
        this.pointModalOpen = false;
        this.conditionModalOpen = false;
      }
      else {
        if (modalName === 'add') this.addModalOpen = !this.addModalOpen;
        else if (modalName === 'condition') this.conditionModalOpen = !this.conditionModalOpen
        else this.pointModalOpen = !this.pointModalOpen;
      }
    },
    initLevelUp () {
      this.fabMenuOpen = false;
      this.editLevel = !this.editLevel;
    },
    async openToast(text: string) {
      const toast = await toastController
          .create({
            message: text,
            duration: 800
          })
      return toast.present();
    },
    filterAttributes(type: Type) {
      return this.attributeList.filter((attribute: any) => attribute.type === type)
    },
    onSwiperInitialized(swiper: SwiperClass) {
      this.swiperInstance = swiper;
    },
    onSlideChange() {
      if (this.swiperInstance) {
        this.currentSlideIndex = this.swiperInstance.activeIndex;
        this.updateCurrentType();
      }
    },
    updateCurrentType() {
      switch(this.currentSlideIndex) {
        case 0:
          this.currentType = Type.Body;
          break;
        case 1:
          this.currentType = Type.Mind;
          break;
        case 2:
          this.currentType = Type.Social;
          break;
      }
    },
    getTypeName(type: Type): string {
      switch (type) {
        case Type.Body: return 'Body';
        case Type.Mind: return 'Mind';
        case Type.Social: return 'Social';
        default: return '';
      }
    },
    getTypeConditions(type: Type) {
      return this.groupedConditions[type];
    },
    groupConditions(conditions: Condition[]) {
      this.groupedConditions[Type.Body] = [];
      this.groupedConditions[Type.Mind] = [];
      this.groupedConditions[Type.Social] = [];

      conditions.forEach(condition => {
        this.groupedConditions[condition.type].push(condition);
      });
    },
    openModal(type: 'attribute' | 'condition') {
      if (type === 'attribute') {
        this.modalConfig = {
          title: "Add new Attribute",
          content: {
            name: "text",
            amount: "number",
            type: "select"
          },
          selectOptions: {
            type: ["Body", "Mind", "Social"]
          },
          rangeOptions: {}
        };
      } else if (type === 'condition') {
        this.modalConfig = {
          title: "Add new Condition",
          content: {
            name: "text",
            effect: "range",
            icon: "icon-picker"
          },
          rangeOptions: {
            effect: { min: -20, max: 20, step: 1 }
          },
          selectOptions: {}
        };
      }
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    },
    handleModalSubmit(formData: any) {
      // Handle the submitted data here
      console.log(formData);
      this.closeModal();
    },
    toggleFabMenu() {
      this.fabMenuOpen = !this.fabMenuOpen;
    },
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
    handleReorder(reorderedList: Attribute[]) {
      console.log(reorderedList)
      // Update the attribute list for the current type
      this.attributeList = this.attributeList.filter(attr => attr.type !== this.currentType);
      this.attributeList.push(...reorderedList);
      // Save the new order
      this.saveAttributeOrder();
    },
    saveAttributeOrder() {
      this.dataController.saveAttributeOrder(this.attributeList)
    },


    //Input Related
    handleTouchStart(event: TouchEvent) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.isSwiping = false;
    },
    handleTouchMove(event: TouchEvent) {
      if (this.isSwiping) return;

      const touchEndX = event.touches[0].clientX;
      const touchEndY = event.touches[0].clientY;
      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;

      if (Math.abs(dx) > Math.abs(dy) + 5) {
        event.preventDefault();
        this.isSwiping = true;
      }
    },
    handleTouchEnd(event: TouchEvent) {
      if (!this.isSwiping) return;

      const touchEndX = event.changedTouches[0].clientX;
      const dx = touchEndX - this.touchStartX;

      if (dx > 50 && this.currentSlideIndex > 0) {
        this.swiperInstance?.slidePrev();
      } else if (dx < -50 && this.currentSlideIndex < 2) {
        this.swiperInstance?.slideNext();
      }
    },
  },
  mounted () {
    this.getData();
  },
  setup() {
    const dataController: DataController = new DataController();
    const attributeList: Array<Attribute> = [];

    const route = useRoute();
    const { id } = route.params;
    return {
      add,
      pencil,
      ellipsisVertical,
      barbell,
      people,
      school,
      bandage,
      fitness,
      happy,
      medkit,
      close,
      id,
      attributeList,
      Type,
      dataController,
      pagination: {
        el: '.pagination',
        clickable: true,
        paginationType: 'custom',
        bulletClass: 'bullet',
        bulletActiveClass:'bullet-active',
        renderBullet: function (index: any, className: any) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
      },
      modules: [Pagination]
    };
  },
  ionViewWillLeave() {
    this.manageModal('close')
  },
  ionViewWillEnter() {
    this.getData();
  },
});
</script>

<style scoped>
.background {
  height: 100%;
  width: 100%;
  /* background: linear-gradient(245deg, #2a0000 1%, var(--ion-background-color) 87.53%);
  filter: blur(50); */
}

ion-fab-button {
  --border-radius: 15px;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

.list-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.attribute-swiper {
  height: calc(90% - 50px);
}

.attribute-slide {
  overflow: hidden;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.swiper {
  --bullet-background: red !important; /* Set the bullet background color */
  --bullet-background-active: darkred !important; /* Set the active bullet color */
  --progress-bar-background-active: darkred !important; /* If you are using a progress bar pagination type */
}


.pagination {
  margin-top: 30px;
}

.skill-points-display {
  position: fixed;
  bottom: 70px; /* Height of the tab bar */
  left: 0;
  right: 0;
  background-color: #1e1e1e; /* Darker background for contrast */
  padding: 12px 16px;
  border-top: 1px solid #333; /* Subtle separator */
  z-index: 1001;
}

.skill-points-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-points-label {
  color: #8c8c8c; /* Subdued color for the label */
}

.skill-points-value {
  color: #ff4961; /* Your existing accent color */
  font-size: 18px;
  font-weight: bold;
}

.small-fab ion-fab-button {
  --size: 40px; /* Adjust the size as needed */
  --background: #333; /* Dark background to match your theme */
  --background-activated: #444;
  --background-hover: #444;
}

.conditions-display h3 {
  margin-bottom: 10px;
}

.list-modal {
  --height: 550px;
}

.point-modal {
  --height: 350px;
}

.custom-fab {
  margin-bottom: 120px;
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

</style>
