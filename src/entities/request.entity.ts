import { ApiProperty } from '@nestjs/swagger';
import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Repository, AfterUpdate, UpdateEvent} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {BlockchainEntity} from "./blockchain.entity";


@Entity()
export class RequestEntity {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({example: 'payed', description: 'Статус заявки'})
    @Column()
    status: string;

    @ApiProperty({example: '0x24822D24028fD8CCb969B88fB4BD92DC53CA1B20', description: 'Адреса для получения монет'})
    @Column()
    address: string;

    @ApiProperty({example: '0x24822D24028fD8CCb969B88fB4BD92DC53CA1B20', description: 'Ключ'})
    @Column()
    prKey: string;

    @ApiProperty({example: '10000000000', description: 'Сумма монет с учетом комисии'})
    @Column({type:"double precision"})
    finalSum: string;

    @ApiProperty({example: 'eth', description: 'Сеть в которой была сделана транзакция'})
    @Column()
    typeCoin: string;

    @ApiProperty({example: '[{to:"0x", value:"10000"}]', description: 'Адресаты и количество монет'})
    @Column({type: 'jsonb',
        default: () => "'[]'"})
    result: object;

    @ApiProperty({example: '10000000000', description: 'Сумма монет с учетом комисии'})
    @Column({type:"double precision", nullable:true})
    tokenCoins: string;

    @ApiProperty({example: '10.00', description: 'Дата/Время, в которое была сохдана транзакция'})
    @Column()
    date: Date;

}