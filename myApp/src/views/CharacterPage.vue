<template>
  <ion-page>
    <ion-content style="max-height: 95%">
      <div>
        <!--<top-bar @openMenu="openMenu" :attribute-points="0" class="front" @buttonClicked="editable = !editable"></top-bar>-->

        <!--<CharacterSheet @create="saveCharacter" :current-character-input="character" :editable="editable"></CharacterSheet>-->
        <CharacterSheetV2 @menu="openMenu" @create="saveCharacter" @delete="controlWarning()" :current-character-input="character"></CharacterSheetV2>
      </div>

      <ion-menu @ion-did-close="menuOpen=false" v-if="menuOpen" id="menu" menu-id="menu" side="start" content-Id="menuOutlet">
        <ion-header>
          <ion-toolbar color="danger">
            <ion-title>Characters</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content padding>
          <ion-list>
            <ion-item button @click="changeCharacters(character.id)" v-for="(character, index) in characters" v-bind:key="index" >
              <ion-label > {{ character.name }} </ion-label>
            </ion-item>
            <ion-button @click="addCharacter" style="margin-left: 120px;" fill="clear" color="danger">
              <ion-icon style="font-size: 30px;" :icon="addCircleOutline"></ion-icon>
            </ion-button>
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-alert
          :is-open="warningOpen"
          :header="'Delete '+ this.character.name + '?'"
          message="Do you want to delete this character?"
          :buttons="[{text: 'Confirm', role:'confirm', handler: () => {this.controlWarning(true)}},
                     {text: 'Cancel', role:'cancel'}]"
          @didDismiss="controlWarning()"
      ></ion-alert>

      <ion-router-outlet v-if="menuOpen" id="menuOutlet"></ion-router-outlet>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  menuController,
  IonAlert, useIonRouter
} from "@ionic/vue";
import {addCircleOutline} from "ionicons/icons";
import CharacterSheetV2 from "@/components/CharacterSheetV2.vue";
import {DataController} from "@/stores/DataController";
import {defineComponent} from "vue";
import {Character} from "@/model/Character";
import router from "@/router";

export default defineComponent({
  name: "CharacterPage",
  components: {
    IonRouterOutlet,
    IonLabel,
    IonButton,
    IonPage,
    IonIcon,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CharacterSheetV2,
    IonList,
    IonItem,
    IonAlert
  },
  data () {
    return {
      characters: [new Character(15,'', '', 0, '', '', 0,'','')],
      character: new Character(15,'', '', 0, '', '', 0,'','') as Character,
      editable: false,
      menuOpen: false,
      warningOpen: false
    }
  },
  props: {
    id: String
  },
  methods: {
    // Data
    async changeCharacters (index: number) {
      const newCharacter: Character = await this.dataController.changeCurrentCharacter(index) as Character;
      this.character = newCharacter;
      this.closeMenu();
    },
    async addCharacter () {
      this.editable = true;
      this.character = await this.dataController.addCharacter();
      this.closeMenu();
    },
    async saveCharacter () {
      await this.dataController.saveCharacter(this.character);
      await this.getCharacters();
    },
    async getCurrentCharacter () {
      if (this.id === undefined) return
      if (this.id === 'new') {
        await this.addCharacter()
        return
      }
      const character: Character = await this.dataController.getCharacterById(Number(this.id)) as Character;
      if (character === null) await this.changeCharacters(0)
      this.character = character;
    },
    async getCharacters () {
      this.characters = await this.dataController.getCharacters() as Character[];
    },
    async removeCharacter () {
      await this.dataController.removeCharacter()
      // await this.changeCharacters(0)
      this.openMenu()
    },

    //UI
    openMenu () {
      this.router.navigate('/Selection', "back", "pop")
      /*
      this.menuOpen = !this.menuOpen;
      setTimeout(() => menuController.toggle());
      */
    },
    closeMenu () {
      menuController.toggle();
      setTimeout(() => this.menuOpen = false,300);
    },
    controlWarning(canDelete = false) {
      if (!canDelete) this.warningOpen = !this.warningOpen
      if (canDelete) this.removeCharacter()
    },
  },
  computed: {
    currentRoute () {
      return router.currentRoute.value.path
    }
  },
  mounted() {
    this.getCurrentCharacter();
    this.getCharacters();
  },
  setup () {
    const dataController = new DataController();
    const router = useIonRouter();

    return {
      addCircleOutline,
      dataController,
      router
    }
  },
});
</script>

<style scoped>


</style>
