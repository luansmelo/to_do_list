import {
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  expiresIn: number;

  @Column()
  user_id: string;

  @OneToOne(() => User)
  @JoinTable()
  user: User[];
}

export { RefreshToken };
