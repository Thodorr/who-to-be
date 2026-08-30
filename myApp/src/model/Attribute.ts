export class Attribute {
    public name: string;
    public type: Type;
    public value: number;
    public isSmallSkill: boolean;
    public tier: Tier;


    constructor(name: string, type: Type, value: number, isSmallSkill = false, tier = 0) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.isSmallSkill = isSmallSkill;
        this.tier = tier;
    }
}

export enum Type {
    Body,
    Mind,
    Social
}

export enum Tier {
    Full,
    Small,
    Deficit
}
