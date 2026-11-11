
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('document_statuses')
export class DocumentStatus {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    comment: 'Primary key ID',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Name of the document status',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Description of the document status',
  })
  description: string | null;
}
