import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { floralwhite } from "color-name";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number = 0; 

    @Column()
    title: string;

    @Column()
    done: boolean;

}
