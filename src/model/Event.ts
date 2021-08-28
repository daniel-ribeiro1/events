import { Model, DataTypes } from 'sequelize';
import sequelize from "../instance/mysql";

export interface EventInstance extends Model {
    id: number,
    title: string,
    startTie: number,
    endTime: number,
    descriptiom: string
}

export const Event = sequelize.define<EventInstance>('Event', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    title: DataTypes.STRING,
    startTime: DataTypes.INTEGER.UNSIGNED,
    endTime: DataTypes.INTEGER.UNSIGNED,
    description: DataTypes.STRING,
    },
    {
        timestamps: false,
        tableName: 'events'
    }
);

