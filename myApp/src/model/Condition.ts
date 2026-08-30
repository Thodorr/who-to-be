import {Type} from "@/model/Attribute";

export class Condition {
    public name: string;
    public type: Type;
    public effectValue: number;
    public icon: string;

    constructor(name: string, type: Type, effectValue: number, icon: string) {
        this.name = name;
        this.type = type;
        this.effectValue = effectValue;
        this.icon = icon;
    }
}
