<template>
  <ion-page>
    <top-bar :title="'Attributes'" :page="'attributes'" :attribute-points="attributePoints" @backPressed="manageModal('close')" @openModal="manageModal('points')" class="front" @buttonClicked="initLevelUp"></top-bar>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div>
        <AttributeList v-if="addModalOpen === false" @levelUp="levelUp" @delete="deleteAttribute" :name="tableName" :list="showList" :type-level="typeLevel" :editLevel="editLevel"></AttributeList>
      </div>

      <ion-modal class="modal" :is-open="addModalOpen">
        <AddModal @create="createAttribute" @close="manageModal('close')" :current-type="currentType"></AddModal>
      </ion-modal>

      <ion-modal class="modal" :is-open="pointModalOpen">
        <PointModal :used-points="usedPoints" :attribute-points="attributePoints" @points="changeAttributePoints" ></PointModal>
      </ion-modal>

      <ion-fab id="fabList" class="fab" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button size="small" color="danger" @click="manageModal('add')">
          <ion-icon id="fabIcon" :icon="add" ></ion-icon>
        </ion-fab-button>
        <ion-fab-button size="small" color="danger" @click="changeList(Type.Body)">
          <ion-icon id="fabIcon" :icon="barbell" ></ion-icon>
        </ion-fab-button>
        <ion-fab-button size="small" color="danger" @click="changeList(Type.Mind)">
          <ion-icon id="fabIcon" :icon="school" ></ion-icon>
        </ion-fab-button>
        <ion-fab-button size="small" color="danger" @click="changeList(Type.Social)">
          <ion-icon id="fabIcon" :icon="people" ></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  toastController
} from '@ionic/vue';
import {defineComponent} from 'vue';
import {Attribute, Type} from "@/model/Attribute";
import AttributeList from "@/components/AttributeList.vue";
import {add, ellipsisVertical, barbell, people, school} from "ionicons/icons";
import AddModal from "@/components/Modals/AddModal.vue";
import TopBar from "@/components/TopBar.vue";
import PointModal from "@/components/Modals/PointModal.vue";
import {useRoute} from "vue-router";
import {DataController} from "@/stores/DataController";
import {Character} from "@/model/Character";

export default defineComponent({
  name: 'HomePage',
  components: {
    PointModal,
    TopBar,
    AddModal,
    AttributeList,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonModal,
    IonFabButton,
    IonIcon
  },
  data () {
    return {
      showList: [new Attribute("Jumping", Type.Body, 10)],
      tableName: "Body",
      currentType: Type.Body,
      addModalOpen: false,
      pointModalOpen: false,
      editLevel: false,
      attributePoints: 500,
      usedPoints: 0
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
        await this.openToast()
      }
      this.manageModal('add');
    },
    async levelUp(attribute: Attribute, amount: number) {
      const result = await this.dataController.levelUp(attribute, amount);
      if (result !== null) {
        this.updateUI(result)
      } else {
        await this.openToast()
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


    //UI Related
    updateUI(character: Character) {
      this.attributeList = character.attributes;
      this.attributePoints = character.attributePoints;
      this.usedPoints = character.usedPoints;
      this.changeList(this.currentType)
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
      const fabIcon = document.getElementById('fabIcon')
      if (fabIcon === null) return


      if (this.addModalOpen || this.pointModalOpen || modalName === 'close') {
        this.addModalOpen = false;
        this.pointModalOpen = false;

        setTimeout(() => fabIcon.className += ' rotateBack', 100)
      } else {
        if (modalName === 'add') this.addModalOpen = !this.addModalOpen;
        else this.pointModalOpen = !this.pointModalOpen;

        fabIcon.className = ''
        setTimeout(() => fabIcon.className += ' rotate', 100)
      }
    },
    initLevelUp () {
      this.editLevel = !this.editLevel;
    },
    async openToast() {
      const toast = await toastController
          .create({
            message: 'Not enough points.',
            duration: 800
          })
      return toast.present();
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
      ellipsisVertical,
      barbell,
      people,
      school,
      id,
      attributeList,
      Type,
      dataController
    };
  },
  computed: {
    typeLevel () {
      let level = 0;
      for (let attribute of this.showList) {
        level += attribute.value;
      }
      level /= 10;
      level = Math.floor(level);
      return level;
    }
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
.fab {
  margin-bottom: 8vh;
}
.modal {
  margin-top: 60px;
}

@media (orientation: landscape) {
  .modal {
    margin-top: 60px;
    height: 200px;
  }
  .fab {
    margin-left: 200px;

  }
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
</style>
