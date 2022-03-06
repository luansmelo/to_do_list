import { Length } from "class-validator";
import {
  Column,
  Entity,
  CreateDateColumn,
  OneToMany,
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
  toJSON() {
    const { limitDate, createdAt, updatedAt, ...task } = this;

    return {
      ...task,
      limitDate: limitDate.toLocaleString("pt-BR", { dateStyle: "short" }),
    };
  }

  @Column()
  @Length(10, 40)
  description: string;

  @CreateDateColumn({ type: "timestamp", nullable: true })
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
