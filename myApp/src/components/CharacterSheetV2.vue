<!--suppress CssUnusedSymbol -->
<template>
  <div class="frame">
    <div class="fade" v-on:click="showUrl = !showUrl"></div>
    <img id="portrait" :src="currentCharacter.imgUrl" alt="No character picture found!" onerror="src='https://cdn.pixabay.com/photo/2014/06/24/17/34/silhouette-376538_960_720.jpg'" class="charImg">
    <Transition>
      <ion-item v-if="showUrl" class="input srcInput" color="none" lines="none">
        <ion-label class="label" color="medium" position="stacked">Img-URL</ion-label>
        <ion-input @change="$emit('create')" v-model="currentCharacter.imgUrl" :clear-input="true" type="text"></ion-input>
      </ion-item>
    </Transition>
    <button @click="$emit('menu')" class="characterButton">
      <ion-icon :icon="peopleOutline"></ion-icon>
    </button>
    <button @click="$emit('delete')" style="margin-bottom: 50px" class="characterButton">
      <ion-icon :icon="trashOutline"></ion-icon>
    </button>
  </div>
  <ion-row class="infoArea">
    <ion-col>
      <ion-item size="7" class="input nameField">
        <ion-label class="label" color="medium" position="stacked">Name</ion-label>
        <ion-input @change="$emit('create')" class="characterInput" v-model="currentCharacter.name" ref="input" type="text"></ion-input>
      </ion-item>

      <ion-row>
        <ion-col size="4" class="col">
          <ion-item class="input">
            <ion-label class="label" color="medium" position="stacked">Gender</ion-label>
            <ion-input @change="$emit('create')" v-model="currentCharacter.gender" type="text"></ion-input>
          </ion-item>
        </ion-col>

        <ion-col size="4" class="col">
          <ion-item class="input">
            <ion-label class="label" color="medium" position="stacked">Height</ion-label>
            <ion-input @change="$emit('create')" v-model="currentCharacter.height" type="text"></ion-input>
          </ion-item>
        </ion-col>

        <ion-col size="4" class="col">
          <ion-item class="input">
            <ion-label class="label" color="medium" position="stacked">Age</ion-label>
            <ion-input @change="$emit('create')" v-model="currentCharacter.age" type="text"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6" class="col">
          <ion-item class="input">
            <ion-label class="label" color="medium" position="stacked">Physique</ion-label>
            <ion-input @change="$emit('create')" v-model="currentCharacter.physique" type="text"></ion-input>
          </ion-item>
        </ion-col>

        <ion-col size="6" class="col">
          <ion-item class="input">
            <ion-label class="label" color="medium" position="stacked">Profession</ion-label>
            <ion-input @change="$emit('create')" v-model="currentCharacter.profession" type="text"></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-item class="input">
        <ion-label class="label" color="medium" position="stacked">Description</ion-label>
        <ion-textarea @change="$emit('create')" :auto-grow="true" v-model="currentCharacter.description" type="text"></ion-textarea>
      </ion-item>
    </ion-col>
  </ion-row>
</template>

<script>
import {
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonTextarea,
} from "@ionic/vue";
import {bookOutline, brushOutline, peopleOutline, trashOutline} from "ionicons/icons";

export default {
  name: "CharacterSheet",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonCol,
    IonRow,
    IonTextarea,
    IonIcon
  },
  props: {
    currentCharacterInput: Object
  },
  data () {
    return {
      currentCharacter: {},
      attributesReady: false,
      imgUrl: 'https://i.pinimg.com/236x/2d/16/71/2d1671a4e725a28c99ef4b619af8a839.jpg',
      showUrl: false
    }
  },
  emits: [
      'create',
      'menu',
      'delete'
  ],
  watch: {
    currentCharacterInput(newCharacter) {
      this.currentCharacter = newCharacter
    }
  },
  mounted() {
    this.currentCharacter = this.currentCharacterInput;
  },
  setup () {
    return {
      bookOutline,
      brushOutline,
      peopleOutline,
      trashOutline
    }
  }
}
</script>

<style scoped>
:root {
  --new-background: #26151D;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-out;
}
.v-enter-from,
.v-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}

.input {
  margin: 0 10px 20px 10px;
  border-radius: 10px!important;
}
.col {
  padding: 0;
}
.charImg{
  position: relative;
  width: 100%;
  max-height: 60%;
  object-fit: cover;
  z-index: -1;
}
.fade {
  height: 100%;
  width: 100%;
  position:absolute;
  background: -webkit-linear-gradient(top,
  rgba(var(--ion-background-color-rgb), 0) 0%,
  rgba(var(--ion-background-color-rgb), 0) 20%,
  rgba(var(--ion-background-color-rgb), 0.7) 80%,
  rgba(var(--ion-background-color-rgb), 1) 100%
  );
}
.characterButton {
  height: 40px;
  width: 40px;
  bottom: 60px;
  right: 20px;
  border-radius: 50px;
  position:absolute;
  background-color: rgba(0,0,0,0)!important;
  backdrop-filter: blur(60px)!important;
}
.srcInput {
  position:absolute;
  top: 10%;
  width: 95%;
  background-color: rgba(0,0,0,0)!important;
  backdrop-filter: blur(6px)!important;
}

.frame {
  height: 100%;
  max-height: 55vh;
  overflow: hidden;
  position: relative;
}
.infoArea{
  position: relative;
  border-radius: 28px;
  width: 100%;
  margin-top: -40px;
  margin-bottom: 10px;
  z-index: 2;
}
.nameField{
  margin-top: 5px;
}
@media (prefers-color-scheme: light) {
  .input {
    box-shadow: 0.7px 0.7px 2.5px;
  }
  .infoArea{
    position: relative;
    border-radius: 28px;
    width: 100%;
    margin-top: -40px;
    padding-top: 5px;
    z-index: 2;
    background-color: white;

  }
}

</style>
