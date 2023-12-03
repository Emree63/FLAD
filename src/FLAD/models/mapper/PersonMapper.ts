import { Person } from "../Person";

export class PersonMapper {
    public static toModel(person: any): Person {
        return new Person(person._id, person.name, person.image);
    }
}