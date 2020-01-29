import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { floralwhite } from "color-name";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    uid: number = 0; 

    @Column()
    username: string;

    @Column({select : false})
    password:string;

    @Column()
    isAdmin: boolean;

    @Column()
    displayName: string;

}
