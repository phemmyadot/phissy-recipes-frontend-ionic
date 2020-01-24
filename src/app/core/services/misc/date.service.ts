import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DateService {

    constructor() { }

    toDate(dateString: string, format = 'MM/DD/YYYY'): Date {
        var retVal: Date;
        try {
            retVal = moment(dateString, format).toDate();
        }
        catch (ex) {
            console.log(`Unable to format date from string ${dateString} `);
        }
        return retVal;
    }

    formatToString(value: Date, format = 'MM/DD/YYYY'): string {
        var retVal: string;
        try {
            retVal = moment(value).format(format);
        }
        catch (ex) {
            console.log('Unable to format date to string ', value);
        }
        return retVal;
    }

    formatToDateOnly(value: Date, format = 'MM-DD-YYYY'): string {
        var retVal: string;
        try {
            retVal = moment(value).format(format);
        }
        catch (ex) {
            console.log('Unable to format date to string ', value);
        }
        return retVal;
    }

    formatDateStringToDateOnly(date: string, format = 'MM-DD-YYYY'): string {
        var retVal: string;
        try {
            retVal = moment(date).format(format);
        }
        catch (ex) {
            console.log('Unable to format date to string ', date);
        }
        return retVal;
    }

    formatToTimeOnly(value: Date, format = 'hh:mm a'): string {
        var retVal: string;
        try {
            retVal = moment(value).format(format);
        }
        catch (ex) {
            console.log('Unable to format date to string ', value);
        }
        return retVal;
    }

    formatToShortdate(value: Date): string {
        var retVal: string;
        try {
            retVal = moment(value).format('MMM DD, YYYY');
        }
        catch (ex) {
            console.log('Unable to format to full date ', value);
        }
        return retVal;
    }

    formatToFullDate(value: Date): string {
        var retVal: string;
        try {
            retVal = moment(value).format('MMM DD, YYYY hh:mm a');
        }
        catch (ex) {
            console.log('Unable to format to full date ', value);
        }
        return retVal;
    }

    toDateString(date: Date) {
        return moment(date).format();
    }

    toUTC(date: Date) {
        return moment.utc(date).format();
    }

    toUTCDate(date: Date) {
        return moment.utc(date).toDate();
    }

    isValid(date: any, format?: string): boolean {
        if (format) {
            return moment(date, format, true).isValid();
        } else {
            return moment(date, moment.ISO_8601, true).isValid();
        }
    }

    isValidFormat(date: any, format: string) {
        return moment(date, format, true).isValid();
    }

    addDays(date: Date, counter: number) {
        return moment(date).add(counter, 'd').toDate();
    }

    addHours(date: Date, counter: number) {
        return moment(date).add(counter, 'h').toDate();
    }

    addMinutes(date: Date, counter: number) {
        return moment(date).add(counter, 'm').toDate();
    }

    addSeconds(date: Date, counter: number) {
        return moment(date).add(counter, 's').toDate();
    }

    difference(higher: Date, lower: Date, unit = 's'): number {
        const date1 = moment(higher);
        const date2 = moment(lower);
        if (unit === 's') {
            return moment.duration(date1.diff(date2)).asSeconds();
        } else if (unit === 'm') {
            return moment.duration(date1.diff(date2)).asMinutes();
        }
    }

    fromDateToUTCDate(date: Date): Date {
        if (date) {
            let bucketDate = moment(date).utc();
            let bucketDateLocal = moment().startOf('day');

            bucketDateLocal.set('year', bucketDate.year());
            bucketDateLocal.set('month', bucketDate.month());
            bucketDateLocal.set('date', bucketDate.date());
            bucketDateLocal.set('hour', bucketDate.hour());
            bucketDateLocal.set('minute', bucketDate.minute());
            bucketDateLocal.set('second', bucketDate.second());

            return bucketDateLocal.toDate();
        } else {
            return null;
        }
    }

    utcDate(date: Date): Date {
        return moment(date).utc().toDate();
    }

    convertSecondsToTimeString(seconds: number, format = 'HH:mm:ss') {
        return moment("2015-01-01").startOf('day')
            .seconds(seconds)
            .format(format);
    }

    convertTimeStringToSeconds(value: string, format = 'HH:mm:ss') {
        return moment(value, format).utc().diff(moment().startOf('day'), 'seconds');
    }

    getPreviousMonth(date: Date) {
        return moment(date).add(-1, 'M').startOf('month').toDate();
    }

    getNextMonth(date: Date) {
        return moment(date).add(1, 'M').startOf('month').toDate();
    }

    mergeDateAndTime(date: Date, time: string, mergeStrings?: boolean) {
        if (mergeStrings) {
            const dateString = this.formatToString(date, 'DD/MM/YYYY');
            return moment(dateString + ' ' + time, 'DD/MM/YYYY HH:mm a').toDate();
        } else {
            const seconds = this.convertTimeStringToSeconds(time, 'HH:mm a');
            return moment(date).utc().startOf('day').add(seconds, 's').toDate();
        }
    }

    utcTimeToLocalTime(time: string) {
        return moment.utc(time, 'hh:mm a').local().format('hh:mm a');
    }

    utcTime(time: string) {
        return moment(time, 'hh:mm a').utc().format('hh:mm a');
    }

    mergeUTCDateTime(date: Date, time: string) {
        const localDateString = this.formatToString(new Date(date), 'MM-DD-YYYY');
        const localTimeString = this.utcTimeToLocalTime(time);
        return new Date(localDateString + ' ' + localTimeString);
    }

    mergeLocalDateTime(date: Date, time: string) {
        const localDateString = this.formatToString(date, 'MM-DD-YYYY');
        return this.toUTC(new Date(localDateString + ' ' + time));
    }
}

