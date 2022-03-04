import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { Task } from "./Task";
import { Labenu } from "./Labenu";

@Entity()
export class User extends Labenu {
  @Column()
  nickname: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 100, {
    message:
      "your password must contain a minimum of 6 characters and a maximum of 30 characters. ",
  })
  password: string;

  @ManyToMany(() => Task)
  @JoinTable({ name: "task_user" })
  task: Task[];
}
