import { Model, DataTypes } from 'sequelize';
import sequelize from "../instance/mysql";
import { User } from './User';

export interface EventInstance extends Model {
    id: number,
    title: string,
    startTime: number,
    endTime: number,
    description: string;
    authorId: number;
}

export const Event = sequelize.define<EventInstance>('Event', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    title: DataTypes.STRING,
    startTime: {
        type: DataTypes.BIGINT.UNSIGNED,
        get() {
            let hours = '';
            let minutes = '';

            let time = this.getDataValue('startTime');
            time = new Date(time);

            hours = time.getHours();
            minutes = time.getMinutes();

            if(parseInt(hours) < 10) {
                hours = '0' + hours;
            }
            if(parseInt(minutes) < 10) {
                minutes = '0' + minutes;
            }

            return `${hours}:${minutes}`;
        }
    },
    endTime: {
        type: DataTypes.BIGINT.UNSIGNED,
        get() {
            let hours = '';
            let minutes = '';

            let time = this.getDataValue('endTime');
            time = new Date(time);

            hours = time.getHours();
            minutes = time.getMinutes();

            if(parseInt(hours) < 10) {
                hours = '0' + hours;
            }
            if(parseInt(minutes) < 10) {
                minutes = '0' + minutes;
            }

            return `${hours}:${minutes}`;
        }
    },
    description: DataTypes.STRING,
    authorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.VIRTUAL,
        get() {
            let currentTime = new Date().getTime();
            let startTimeEvent = this.getDataValue('startTime');
            let endTimeEvent = this.getDataValue('endTime');
            
            const result = {
                color: '',
                msg: '',
            };

            if( (currentTime >= startTimeEvent) && (currentTime < endTimeEvent )) {
                result.color = 'primary';
                result.msg = 'Em andamento';
            }

            if(currentTime >= endTimeEvent) {
                result.color = 'success';
                result.msg = 'Finalizado';
            }

            if(currentTime < startTimeEvent) {
                result.color = 'warning';
                result.msg = 'Pendente';
            }

            return result;
        }
    }
    },
    {
        timestamps: false,
        tableName: 'events'
    }
);

