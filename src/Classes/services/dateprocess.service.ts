import { Injectable } from '@nestjs/common';

import * as  Moment from "moment-timezone";


@Injectable()
export class DateProcessService {



    setDate()
    {
        const dateMoment = Moment().tz("America/Montevideo");
        dateMoment.locale('es');
        return dateMoment.format('dddd,LL,h:mm A').split(',');
    }

    getShortDate()
    {
        let dateMoment = Moment().tz("America/Montevideo");
        dateMoment.locale('es');
    	return dateMoment.format('LL');
    }

    getDiffInDays(date:any)
    {
        date = this.convertHumanDateIntoSystemDate(date)
        let dateMoment = Moment().tz("America/Montevideo");
        dateMoment.locale('es');
        return dateMoment.diff(date, 'days');
    }

    //incluimos un nuevo metodo para sacar rango de fechas
    getNextPointToPointInTime(days:number, date:any)
    {
        date = this.convertHumanDateIntoSystemDate(date)
    	let day_Array:String[] = Array();

    	for (let i = 1; i<= days; ++i) 
    	{
    		day_Array.push(Moment(date).add(i, "days").format('LL'));
    	}

    	return day_Array;
    }

    //funcion en base a la fecha humana, la transforma a fehca de sistema
    convertHumanDateIntoSystemDate(date:string)
    {
        
        return Moment(date, 'LL','es').format('YYYYMMDD')
    }

    getBackpointInTime(days:number)
    {
        let dateMoment = Moment().tz("America/Montevideo");
        dateMoment.locale('es');
    	return dateMoment.subtract(days, "days");
    }

    //funcion que me retorna fecha futura en base a dias
    getNextPointInTime(days:number)
    {
        let dateMoment = Moment().tz("America/Montevideo");
        dateMoment.locale('es');
        return dateMoment.add(days, 'days').format('LL');
    }

    getNextPointDate(days:number, date:string)
    {
        date = this.convertHumanDateIntoSystemDate(date)
        let dateMoment = Moment(date).tz("America/Montevideo");
        dateMoment.locale('es');
        return dateMoment.add(days, 'days').format('dddd,LL,h:mm A').split(',');
    }


}
