import { Length } from "class-validator";
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

abstract class Labenu {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Length(4, 35, {
    message:
      "the name must contain a minimum of 4 characters and a maximum of 35 characters.",
  })
  name: string;

  @CreateDateColumn({ name: "created_At" })
  createdAt: Date;

  @UpdateDateColumn({ name: "update_At" })
  updatedAt: Date;
}

export { Labenu };
