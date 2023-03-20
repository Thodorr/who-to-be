<template>
  <ion-header>
    <ion-toolbar class="header">

      <ion-title>{{ title }}</ion-title>
      <ion-button v-if="currentRoute === '/Attributes'" @click="$emit('openModal')" slot="end" fill="clear" color="danger">
        {{ attributePoints }}
      </ion-button>
      <ion-button slot="end" fill="clear" color="danger" @click="buttonClicked">
        <ion-icon class="icon iconButton" :icon="barIcon" :class="{grey: isClicked === false, red: isClicked}"></ion-icon>
      </ion-button>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {IonButton, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/vue";
import {arrowBack, arrowUpCircleOutline, hammerOutline, menu} from "ionicons/icons";
import router from "@/router";

export default {
  name: "TopBar",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  },
  props: {
    attributePoints: Number
  },
  data () {
    return {
      isClicked: false
    }
  },
  methods: {
    buttonClicked () {
      this.isClicked = !this.isClicked;
      this.$emit('buttonClicked');
    }
  },
  computed: {
    currentRoute () {
      return router.currentRoute.value.path
    },
    barIcon () {
      if (this.currentRoute === "/Character") {
        return this.hammerOutline
      } else {
        return arrowUpCircleOutline
      }
    },
    title () {
      const stringTitle = this.currentRoute.slice(1, this.currentRoute.length-2)
      return stringTitle;
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
.icon {
  font-size: 30px;
  color: grey;
}
.grey {
  color: grey;
}
.red {
  color: #ff4961;
}

</style>
