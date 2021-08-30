import { Model, DataTypes } from 'sequelize';
import sequelize from "../instance/mysql";

export interface UserInstance extends Model {
    id: number,
    name: string,
    email: string,
    password: string,
}

export const User = sequelize.define<UserInstance>('Event', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    },
    {
        timestamps: false,
        tableName: 'users'
    }
);

