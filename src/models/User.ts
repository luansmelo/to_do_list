import { Entity, Column, OneToOne, ManyToMany, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { Task } from "./Task";
import { Labenu } from "./Labenu";
import { RefreshToken } from "./RefreshToken";

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

  @OneToOne(() => RefreshToken, (refresh) => refresh.user_id)
  refresh_token: RefreshToken;

  @ManyToMany(() => Task)
  tasks: Task[];
  
  @OneToMany(() => Task, task => task.creatorUser)
  ownedTasks: Task[]
}
