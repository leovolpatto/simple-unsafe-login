import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Usuario{

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        unique: true,
        nullable: false
    })
    public userName: string;

    @Column()
    public password: string;
}