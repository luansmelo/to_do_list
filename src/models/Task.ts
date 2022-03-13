import { Length } from "class-validator";
import {
  Column,
  Entity,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Labenu } from "./Labenu";

export enum ITask {
  TODO = "to-do",
  DOING = "doing",
  DONE = "done",
}

@Entity()
export class Task extends Labenu {

  @Column()
  @Length(10, 40)
  description: string;

  @CreateDateColumn({ nullable: true })
  limitDate: Date;

  @Column({
    type: "enum",
    enum: ITask,
    default: ITask.TODO,
  })
  status: ITask;

  @ManyToMany(() => User)
  @JoinTable({ name: "tasks_users" })
  users: User[];

  @ManyToOne(() => User, (user) => user.ownedTasks)
  creatorUser: User;
}
