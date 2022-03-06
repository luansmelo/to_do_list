import { Entity, Column, OneToOne, ManyToMany, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { Task } from "./Task";
import { Labenu } from "./Labenu";
import { RefreshToken } from "./RefreshToken";

export enum profiles {
  USER = "user",
  MODERATOR = "moderator",
  ADMINISTRATOR = "administrator",
}

export const allProfiles = [
  profiles.USER,
  profiles.MODERATOR,
  profiles.ADMINISTRATOR,
];

@Entity()
export class User extends Labenu {
  toJSON() {
    const { password, createdAt, updatedAt, ...user } = this;
    return {
      ...user,
    };
  }

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

  @Column({
    type: "enum",
    enum: profiles,
    default: profiles.USER,
  })
  profile: profiles;

  @OneToOne(() => RefreshToken, (refresh) => refresh.user_id)
  refresh_token: RefreshToken;

  @ManyToMany(() => Task, {
    cascade: true,
  })
  tasks: Task[];

  @OneToMany(() => Task, (task) => task.creatorUser, {
    cascade: true,
  })
  ownedTasks: Task[];
}
