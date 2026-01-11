import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("Weather")
export class Weather {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    city!: string;

    @Column("float")
    temperature!: number;

    @Column("float", { name: "windSpeed" })
    windSpeed!: number;

    @Column({ name: "lastUpdated", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    lastUpdated!: Date;

    @CreateDateColumn({ name: "createdAt" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updatedAt" })
    updatedAt!: Date;
}
