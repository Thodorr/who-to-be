<template>
  <ion-header>
    <ion-toolbar class="header">

      <ion-title size="large">{{ title }}</ion-title>
      <ion-button v-if="currentRoute === '/Attributes'" @click="$emit('openModal')" slot="end" fill="clear" color="danger">
        {{ attributePoints }}
      </ion-button>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {IonButton, IonHeader, IonTitle, IonToolbar} from "@ionic/vue";
import {arrowBack, arrowUpCircleOutline, hammerOutline, menu} from "ionicons/icons";
import router from "@/router";

export default {
  name: "TopBar",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
  },
  props: {
    attributePoints: Number
  },
  data () {
    return {
      isClicked: false
    }
  },
  computed: {
    currentRoute () {
      return router.currentRoute.value.path
    },
    title () {
      return this.currentRoute.slice(1, this.currentRoute.length - 2);
    }
  },
  setup() {
    return {
      arrowUpCircleOutline,
      hammerOutline,
      arrowBack,
      menu
    };
  }
}
</script>

<style scoped>
.header {
  --background: var(--ion-background-color);
}
</style>
