import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../";
import { Account } from "./account.entity";

@Entity({ name: 'accountmoviment' })
export class AccountMoviment {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => Account, account => account.id)
    account: Account;

    @Column({ length: 1 })
    type: string;

    @Column({ length: 1000 })
    description: string;

    @Column()
    value: number;

    @Column()
    balance: number;

    @Column()
    active: boolean;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, user => user.id)
    userCreated: User;

    @Column({ nullable: true })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.id)
    userUpdated: User;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.id)
    userDeleted: User;

    @Column({ nullable: true })
    orderNumber: string;

    @Column({ nullable: true })
    reference: string;
}