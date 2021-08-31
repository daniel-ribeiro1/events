import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

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
    password: {
        type: DataTypes.STRING,
        set(password: string) {
            this.setDataValue('password', bcrypt.hashSync(password, 10));
        }
    }
    },
    {
        timestamps: false,
        tableName: 'users'
    }
);

