<template>
  <ion-card class="card-body">
    <div style="justify-content: center">
      <div class="portrait">
        <img alt="Character Portrait" :src="imageUrl"/>
      </div>
    </div>
    <ion-card-header class="text-area">
      <ion-card-title>{{header}}</ion-card-title>
      <ion-card-subtitle>{{subHeader}}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content class="text-area">
      {{cutText}}
    </ion-card-content>
  </ion-card>
</template>

<script>
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/vue";

export default {
  name: "CharacterCard",
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
  },
  props: {
    header: String,
    subHeader: String,
    text: String,
    imageUrl: String,
  },
  computed: {
    cutText () {
      let cutText = this.text
      if (cutText.length > 90) {
        cutText = cutText.slice(0, 80)
        cutText += '...'
      }
        return cutText
    }
  }
}
</script>

<style scoped>

.portrait {
  position: absolute;
  left: 10px;
  top: 15px;
  bottom: 15px;
  box-shadow: 0 1px 6px black;
  border-radius: 25px;
  width: 100px;
  height: auto;
  max-height: 100px;
  overflow: hidden;
}
.text-area {
  margin-left: 110px;
}
.card-body {
  min-height: 120px;
  max-height: 160px;
  border-radius: 20px;
}

</style>
