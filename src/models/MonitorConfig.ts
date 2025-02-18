import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Vulnerability } from './Vulnerability'; // Assuming Vulnerability entity is in './Vulnerability'

export enum SourceType {
  ALIYUN = 'aliyun',
  NVD = 'nvd',
  REDQUEEN = 'redqueen'
}

@Entity()
export class MonitorConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  keywords: string[];

  @Column({ type: 'int' })
  interval: number;

  @Column({
    type: 'enum',
    enum: SourceType,
    array: true,
    default: [SourceType.ALIYUN]
  })
  sources: SourceType[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.configs)
  owner: User;

  @OneToMany(() => Vulnerability, vulnerability => vulnerability.config)
  vulnerabilities: Vulnerability[];

  @CreateDateColumn()
  createdAt: Date;
}
