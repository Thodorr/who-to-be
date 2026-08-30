<template>
  <div class="tabBar">
    <div class="deplacer">
      <ion-button @click="routeStackless('/Character/' + characterId)" shape="round" fill="clear" class="barButton" :class="{clicked: currentRoute.includes('/Character')}">
        <div>
          <ion-icon class="tabIcon" :icon="person"></ion-icon> <br>
          <ion-label class="tabText">Character</ion-label>
        </div>
      </ion-button>
      <ion-button @click="routeStackless('/Attributes/' + characterId)" shape="round" fill="clear" class="barButton" :class="{clicked: currentRoute.includes('/Attributes')}">
        <div>
          <ion-icon class="tabIcon" :icon="library"></ion-icon> <br>
          <ion-label class="tabText">Attributes</ion-label>
        </div>
      </ion-button>
      <ion-button @click="routeStackless('/Inventory/' + characterId)" shape="round" fill="clear" class="barButton" :class="{clicked: currentRoute.includes('/Inventory')}"><div>
        <ion-icon class="tabIcon" :icon="diamond"></ion-icon> <br>
        <ion-label class="tabText">Inventory</ion-label>
      </div></ion-button>
    </div>
  </div>
</template>

<script>
import {IonButton, IonIcon, IonLabel} from "@ionic/vue";
import { person, man, library, diamond } from "ionicons/icons";
import {useRouter} from "vue-router";

export default {
  name: "TabBar",
  components: {
    IonButton,
    IonIcon,
    IonLabel,
  },
  props: {
    currentRoute: String
  },
  computed: {
    characterId () {
      return this.currentRoute.split('/')[2]
      //return this.currentRoute.slice(this.currentRoute.length-1, this.currentRoute.length)
    }
  },
  methods: {
    routeStackless (route) {
      console.log(this.currentRoute)
      console.log(this.characterId)
      console.log(route)
      this.router.replace(route)
    }
  },
  setup() {
    const router = useRouter()

    return {
      person,
      man,
      library,
      diamond,
      router
    };
  }
}
</script>

<style scoped>

.tabBar {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 0 0 5px 0px #888888;
  background-color: var(--ion-item-background);
}
.deplacer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
}
.barButton {
  height: 6vh;
  color: grey;
  flex-basis: auto;
  min-width: 80px;
}
.clicked {
  color: var(--ion-color-danger);
}
.tabText {
  font-size: 12px;
}
.tabIcon {
  font-size: 25px!important;
}

</style>
