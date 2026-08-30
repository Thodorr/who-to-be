<template>
  <ion-content class="ion-padding">
    <h2 class="modal-title">Add new Attribute</h2>

    <ion-segment v-model="selectedTab" color="danger">
      <ion-segment-button value="new">
        <ion-label>Create New</ion-label>
      </ion-segment-button>
      <ion-segment-button value="existing">
        <ion-label>Select Existing</ion-label>
      </ion-segment-button>
    </ion-segment>

    <div v-if="selectedTab === 'new'" class="input-container">
      <ion-item class="input">
        <ion-label position="floating" color="danger" class="input-content">Name</ion-label>
        <ion-input
            v-model="name"
            @input="filterAttributes"
            type="text"
            class="input-value"
        ></ion-input>
        <ul v-if="filteredAttributes.length" class="autocomplete-list">
          <li v-for="attribute in filteredAttributes" :key="attribute.name" @click="selectAttribute(attribute)">
            {{ attribute.name }}
          </li>
        </ul>
      </ion-item>


      <ion-item class="input">
        <ion-label color="danger" class="input-content">Type</ion-label>
        <ion-select v-model="typeString" interface="popover" :placeholder="typeString">
          <ion-select-option value="Body">Body</ion-select-option>
          <ion-select-option value="Mind">Mind</ion-select-option>
          <ion-select-option value="Social">Social</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item lines="none" class="input skill-type-selector">
        <ion-label color="danger" class="input-content">Tier</ion-label>
        <ion-chip :color="tier === 0 ? 'danger' : 'medium'" @click="tier = 0">Full</ion-chip>
        <ion-chip :color="tier === 1 ? 'danger' : 'medium'" @click="tier = 1">Small</ion-chip>
        <ion-chip :color="tier === 2 ? 'danger' : 'medium'" @click="tier = 2">Deficit</ion-chip>
      </ion-item>

      <!--
      <ion-item class="input">
        <ion-label position="floating" color="danger" class="input-content">Amount</ion-label>
        <ion-input v-model="amount" type="number" class="input-value"></ion-input>
      </ion-item>
      -->

      <universalSlider
          @update="value => {amount = value}"
          :slider-value="0"
          :slider-name="'Value'"
          :max-value="getMaxPoints"
          :min-value="getMinPoints">
      </universalSlider>
    </div>

    <div v-else class="input-container">
      <ion-searchbar v-model="searchTerm" placeholder="Search skills" class="search-bar"></ion-searchbar>
      <ion-content class="existing-skills-content">
        <div v-for="(skills, type) in filteredCategorizedSkills" :key="type" class="skill-category">
          <h3 class="category-title">{{ type }}</h3>
          <ion-list class="existing-skills-list">
            <ion-item v-for="skill in skills" :key="skill.name" class="existing-skill-item">
              <ion-label>
                {{ skill.name }}
                <ion-chip color="medium" size="small" v-if="skill.tier === Tier.Small" class="small-skill-chip">Small</ion-chip>
              </ion-label>
              <ion-checkbox slot="end" v-model="skill.selected" color="danger"></ion-checkbox>
            </ion-item>
          </ion-list>
        </div>
      </ion-content>
    </div>

    <ion-button expand="block" color="danger" @click="handleConfirm">Confirm</ion-button>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonSegment, IonSegmentButton, IonList, IonCheckbox, IonChip, IonSearchbar } from "@ionic/vue";
import {Attribute, Tier, Type} from "@/model/Attribute";
import attributesData from "../../stores/attributes.json";
import universalSlider from "@/components/UniversalSlider.vue";

interface CategorizedSkills {
  [key: string]: Array<{
    name: string;
    type: Type;
    isSmallSkill: boolean;
    tier: Tier
    selected: boolean;
    description: string;
  }>;
}

interface AttributeData {
  name: string;
  description: string;
  isSmallSkill: boolean;
  tier: Tier;
  type: Type;
}

export default defineComponent({
  name: "AddModal",
  components: {
    IonContent, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption,
    IonSegment, IonSegmentButton, IonList, IonCheckbox, IonChip, IonSearchbar, universalSlider
  },
  props: {
    currentType: {
      type: Number,
      default: Type.Body
    },
    remainingPoints: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedTab: 'new',
      name: "",
      amount: 0,
      typeString: "Body",
      preExistingSkills: [] as Array<{ name: string; type: Type; isSmallSkill: boolean; tier: Tier;selected: boolean; description: string;  }>,
      isSmallSkill: false,
      tier: 0,
      searchTerm: '',
      filteredAttributes: [] as AttributeData[],
    }
  },
  computed: {
    Tier() {
      return Tier
    },
    categorizedSkills() {
      return {
        Body: this.preExistingSkills.filter(skill => skill.type === Type.Body),
        Mind: this.preExistingSkills.filter(skill => skill.type === Type.Mind),
        Social: this.preExistingSkills.filter(skill => skill.type === Type.Social)
      };
    },
    filteredCategorizedSkills(): CategorizedSkills {
      const filtered: CategorizedSkills = {};
      for (const [type, skills] of Object.entries(this.categorizedSkills as CategorizedSkills)) {
        filtered[type] = skills.filter(skill =>
            skill.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      return filtered;
    },
    getMaxPoints(): number {
      if (this.tier === Tier.Deficit) return 0
      if (this.remainingPoints > 100) return 100
      else return this.remainingPoints
    },
    getMinPoints(): number {
      if (this.tier === Tier.Deficit) return -50
      else return 0
    },
  },
  methods: {
    filterAttributes() {
      const query = this.name.toLowerCase();
      this.filteredAttributes = this.preExistingSkills.filter((attribute) =>
          attribute.name.toLowerCase().includes(query)
      );
    },
    selectAttribute(attribute: AttributeData) {
      this.name = attribute.name;
      this.amount = 0;
      this.isSmallSkill = attribute.isSmallSkill;
      this.tier = attribute.tier;
      this.typeString = this.getTypeString(attribute.type);
      this.filteredAttributes = [];
      console.log(this.typeString)
    },
    buildAttribute() {
      let type = Type.Body;
      switch (this.typeString) {
        case "Mind":
          type = Type.Mind;
          break;
        case "Social":
          type = Type.Social;
          break;
      }
      this.amount = Number(this.amount);
      if (isNaN(this.amount)) this.amount = 0;
      return new Attribute(this.name, type, this.amount, this.isSmallSkill, this.tier);
    },
    handleConfirm() {
      if (this.selectedTab === 'new') {
        if (this.name === ''){
          this.$emit('error', "Name required!")
          return
        }
        this.$emit('create', this.buildAttribute());
      } else {
        const selectedSkills = this.preExistingSkills
            .filter(skill => skill.selected)
            .map(skill => new Attribute(skill.name, skill.type, 0, skill.isSmallSkill, skill.tier));
        this.$emit('createMultiple', selectedSkills);
      }
    },
    loadAttributesFromJSON() {
      for (const [typeString, skills] of Object.entries(attributesData)) {
        let type: Type;
        switch (typeString) {
          case 'Body':
            type = Type.Body;
            break;
          case 'Mind':
            type = Type.Mind;
            break;
          case 'Social':
            type = Type.Social;
            break;
          default:
            continue;
        }
        for (const skill of skills) {
          this.preExistingSkills.push({
            name: skill.name,
            type: type,
            isSmallSkill: skill.isSmallSkill,
            tier: skill.tier,
            selected: false,
            description: skill.description
          });
        }
      }
    },
    getTypeString(type: Type): string {
      let typeString : string
      switch (type) {
        case Type.Mind:
          typeString = "Mind";
          break;
        case Type.Social:
          typeString = "Social";
          break;
        default:
          typeString = "Body";
      }
      return typeString;
    }
  },
  mounted() {
    this.loadAttributesFromJSON();
    this.typeString = this.getTypeString(this.currentType)
  },
});
</script>

<style scoped>
.modal-title {
  text-align: center;
  color: var(--ion-color-danger);
  margin-bottom: 1.5rem;
}

.input-container {
  margin-bottom: 1.5rem;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 1rem;
}

ion-input, ion-select {
  --padding-start: 0;
}

ion-label {
  color: var(--ion-color-medium);
}

ion-button {
  margin-top: 1rem;
}

.input {
  margin: 0 10px 20px 10px;
  border-radius: 10px !important;
}

.input-content {
  padding-left: 10px;
}

.input-value {
  margin-left: 10px;
}

ion-segment {
  margin-bottom: 1rem;
}

.input-container {
  margin-top: 1rem;
}

.existing-skills-content {
  height: 60vh;
  overflow-y: auto;
}

.existing-skills-list {
  background: transparent;
}

.existing-skill-item {
  --background: var(--ion-card-background);
  --border-radius: 10px;
  margin-bottom: 10px;
}

.existing-skill-item ion-label {
  margin-left: 10px;
}

ion-checkbox {
  --size: 24px;
  --checkbox-background-checked: var(--ion-color-danger);
  --border-color-checked: var(--ion-color-danger);
  margin-right: 10px;
}

.category-title {
  color: var(--ion-color-danger);
  font-size: 1.2em;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 10px;
}

.skill-category:first-child .category-title {
  margin-top: 0;
}

.existing-skills-content {
  height: 60vh;
  overflow-y: auto;
  touch-action: pan-y;
  max-height: 250px;
}

.skill-type-selector {
  margin-bottom: 1rem;
}

.skill-type-option span {
  margin-top: 0.5rem;
}

.skill-info ion-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}

.skill-type-selector {
  --min-height: 50px;
}

.skill-type-selector ion-chip {
  margin: 0 5px;
}

.small-skill-chip {
  font-size: 0.7em;
  height: 20px;
  margin-left: 5px;
}

.existing-skills-content {
  height: 60vh;
  overflow-y: auto;
  touch-action: pan-y;
  max-height: 250px;
}

.search-bar {
  padding: 8px;
  font-size: 16px;
  --background: var(--ion-card-background);
  --border-radius: 12px;
  margin-bottom: 10px;
}

.autocomplete-list {
  list-style-type: none;
  padding: 0;
  margin: 5px 0;
  background-color: var(--ion-card-background);
  border-radius: 8px;
  max-height: 140px;
  width: 100%;
  overflow-y: hidden;
}
.autocomplete-list li {
  padding: 8px;
  cursor: pointer;
}
.autocomplete-list li:hover {
  background-color: var(--ion-color-danger);
}
</style>
