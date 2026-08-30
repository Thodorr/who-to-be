<template>
  <ion-app>
    <ion-router-outlet />
    <TabBar v-if="currentRoute !== '/Selection'" :current-route="currentRoute"></TabBar>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { person, man, library, diamond } from "ionicons/icons";
import TabBar from "@/components/TabBar.vue";
import router from "@/router";
import SortPopover from './components/SortPopover.vue';
import { getCurrentInstance } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    TabBar,
    IonApp,
    IonRouterOutlet
  },
  computed: {
    currentRoute() {
      return router.currentRoute.value.path
    }
  },
  setup() {
    const app = getCurrentInstance()?.appContext.app;
    if (app) {
      app.component('sort-popover', SortPopover);
    }

    return {
      person,
      man,
      library,
      diamond
    };
  },
});
</script>

<style scoped>
</style>
