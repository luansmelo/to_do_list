import { Length } from "class-validator";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  limitDate: Date;

  @Column({
    type: "enum",
    enum: ITask,
    default: ITask.TODO,
  })
  status: ITask;

  @ManyToMany(() => User)
  @JoinTable({ name: "task_user" })
  users: User[];
}
