import {Storage} from "@ionic/storage";
import {Character} from "@/model/Character";
import {Item} from "@/model/Item";
import {Attribute} from "@/model/Attribute";
import {Condition} from "@/model/Condition";

export class DataController {
    private store = new Storage();

    constructor() {
        this.store.create()
    }

    //Character Methods
    public async getCurrentCharacter(): Promise<Character> {
        const index: number = JSON.parse(await this.store.get('currentId'))
        let character: Character = JSON.parse(await this.store.get('Character' + index)) as Character;
        if (character === null) character = new Character(999,'', '', 0, '', '', 0,'','') as Character

        return character;
    }
    public async getCharacterById(id: number): Promise<Character> {
        const character: Character = JSON.parse(await this.store.get('Character' + id)) as Character;
        return character;
    }
    public async changeCurrentCharacter(index: number) {
        let character: Character = JSON.parse(await this.store.get('Character' + index)) as Character;
        await this.store.set('currentId', index)
        if (character === null) character = new Character(999,'', '', 0, '', '', 0,'','') as Character
        return character;
    }
    public async getCharacters () {
        const characterList: Character[] = [];
        const keys = await this.store.keys();
        for (const i in keys) {
            if (keys[i].includes('Character')) {
                const value = await this.store.get(keys[i]);
                characterList[i] = JSON.parse(value);
            }
        }
        return characterList;
    }
    public async addCharacter () {
        const slot: number = await this.getFreeSlot();
        const character: Character = new Character(slot, '', '', 0, '', '', 0, '',
            'https://cdn.pixabay.com/photo/2014/06/24/17/34/silhouette-376538_960_720.jpg');
        await this.store.set('currentId', slot)
        return character;
    }
    public async saveCharacter(character: Character) {
        await this.store.set('Character' + character.id, JSON.stringify(character))
    }
    public async removeCharacter() {
        const index: number = JSON.parse(await this.store.get('currentId'))
        await this.store.remove('Character' + index)
    }
    private async getFreeSlot () {
        const characters: Character[] = await this.getCharacters();
        if (characters.length === 0 ) return 0;
        for (const i in characters) {
            if (characters[i].id !== Number(i) ) {
                return Number(i);
            }
        }
        return characters.length
    }

    // Attribute Methods
    public async createAttribute(attribute: Attribute) {
        const character: Character = await this.getCurrentCharacter();
        if (character.attributes === undefined) character.attributes = [];
        const amount = attribute.value;
        attribute.value = 0;
        return await this.levelUp(attribute, amount);
    }
    public async levelUp(attribute: Attribute, amount: number) {
        const threshHolds: number[] = [70, 100, 120, 200];
        let multiplier = 1;
        let removeAmount = 0;

        const character: Character = await this.getCurrentCharacter();
        const index = character.attributes.findIndex((attr: any) => attr.name === attribute.name);
        if (index === -1) character.attributes.push(attribute);
        else attribute = character.attributes[index];

        for (const threshold of threshHolds) {
            if (attribute.value < threshold) {
                const distance = threshold - attribute.value;
                if (amount <= distance) {
                    if (attribute.isSmallSkill && attribute.value < 70) {
                        removeAmount += amount * 0.5; // Small skills cost half until the first threshold
                    } else {
                        removeAmount += amount * multiplier;
                    }
                    attribute.value += amount;
                    break;
                } else {
                    amount -= distance;
                    if (attribute.isSmallSkill && attribute.value < 70) {
                        removeAmount += distance * 0.5; // Small skills cost half until the first threshold
                    } else {
                        removeAmount += distance * multiplier;
                    }
                    attribute.value += distance;
                }
            }
            multiplier++;
        }

        if (removeAmount > character.attributePoints - character.usedPoints) {
            attribute.value -= amount;
            return null;
        } else {
            character.usedPoints += removeAmount;
        }

        await this.saveCharacter(character);
        return character;
    }
    public async deleteAttribute(attribute: Attribute) {
        const threshHolds = [200, 120, 100, 70, 0];
        let multiplier = threshHolds.length;

        let amount = attribute.value;
        let regainAmount = 0;

        for (const i in threshHolds) {
            if (attribute.value > threshHolds[i]) {
                const distance = threshHolds[i] - attribute.value;

                if (amount <= distance) {
                    regainAmount += amount * multiplier;
                    attribute.value += amount;
                    break;
                } else {
                    amount -= distance
                    regainAmount += distance * multiplier;
                    attribute.value += distance;
                }
            }
            multiplier--;
        }

        const character: Character = await this.getCurrentCharacter();

        character.usedPoints += regainAmount;

        const index = character.attributes.findIndex((attr: any) => attr.name === attribute.name);
        character.attributes.splice(index, 1);

        await this.saveCharacter(character);
        return character
    }
    public async changeAttributePoints(amount: number) {
        const character: Character = await this.getCurrentCharacter();
        character.attributePoints = amount;
        await this.saveCharacter(character);
        return character.attributePoints;
    }
    public async saveAttributeOrder(attributes: Attribute[]): Promise<Character> {
        const character = await this.getCurrentCharacter();
        character.attributes = attributes;
        await this.saveCharacter(character);
        return character;
    }


    // Item Methods
    public async getItems(): Promise<Item[]> {
        const character: Character = await this.getCurrentCharacter();
        if (character.items === undefined) character.items = [];
        return character.items as Item[]
    }
    public async addItem(item: Item): Promise<Item[]> {
        const character = await this.getCurrentCharacter();
        const index = character.items.findIndex((item1: any) => item1.name === item.name);
        if (index === -1) {
            character.items.push(item)
        } else {
            const foundItem = character.items[index];
            foundItem.value += item.value;
        }
        await this.saveCharacter(character);
        return character.items as Item[]
    }
    public async removeItem(item: Item): Promise<Item[]> {
        const character = await this.getCurrentCharacter();
        const index = character.items.findIndex((item1: any) => item1.name === item.name);
        character.items.splice(index, 1);
        await this.saveCharacter(character);
        return character.items as Item[]
    }
    async createItem(item: Item): Promise<Character | null> {
        const character = await this.getCurrentCharacter();
        character.items.push(item);
        await this.saveCharacter(character);
        return character;
    }

    // Delete an item
    async deleteItem(item: Item): Promise<Character> {
        const character = await this.getCurrentCharacter();
        character.items = character.items.filter(i => i.name !== item.name);
        await this.saveCharacter(character);
        return character;
    }

    // Save item order
    async saveItemOrder(items: Item[]): Promise<Character> {
        const character = await this.getCurrentCharacter();
        character.items = items;
        await this.saveCharacter(character);
        return character;
    }

    // Condition Methods
    public async addCondition(condition: Condition): Promise<Character> {
        const character = await this.getCurrentCharacter();
        character.conditions.push(condition);
        await this.saveCharacter(character);
        return character
    }

    public async removeCondition(condition: Condition): Promise<Character> {
        const character = await this.getCurrentCharacter();
        const index = character.conditions.findIndex(c => c.name === condition.name && c.type === condition.type);
        if (index !== -1) {
            character.conditions.splice(index, 1);
            await this.saveCharacter(character);
        }
        return character
    }



}
