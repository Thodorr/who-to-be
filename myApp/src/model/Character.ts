import {Condition} from "@/model/Condition";
import {Attribute} from "@/model/Attribute";
import {Item} from "@/model/Item";

export class Character {
    public id : number;
    public name: string;
    public description: string;
    public age: number;
    public gender: string;
    public profession: string;
    public height: number;
    public physique: string;
    public imgUrl: string;
    public attributePoints: number;
    public usedPoints: number;

    public conditions: Array<Condition>;
    public attributes: Array<Attribute>;
    public items: Array<Item>;

    constructor(id:number, name: string, description: string, age: number, gender: string, profession: string, height: number, physique: string, imgUrl: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.age = age;
        this.gender = gender;
        this.profession = profession;
        this.height = height;
        this.physique = physique;
        this.imgUrl = imgUrl;
        this.conditions = [];
        this.attributes = [];
        this.items = [];
        this.attributePoints = 400;
        this.usedPoints = 0;
    }

}
