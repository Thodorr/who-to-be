export enum ItemType {
    Weapon = 0,
    Clothing = 1,
    Tool = 2,
    Consumable = 3,
    Miscellaneous = 4
}

export class Item {
    public name: string;
    public value: number;
    public type: ItemType;
    public icon: string;

    constructor(name: string, value: number, type: ItemType, icon: string) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.icon = icon;
    }
}
