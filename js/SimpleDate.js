module.exports = class SimpleDate {
    constructor(number = Date.now()) {
        this.date = new Date(number);
        return this;
    }

    subtract(number, type) {
        const { date } = this;
        switch (type) {
            case 'days':
                date.setDate(date.getDate() - number);
                break;
            case 'months':
                date.setMonth(date.getMonth() - number);
                break;
            case 'years':
                date.setYear(date.getFullYear() - number);
                break;
            case 'hours':
                date.setHours(date.getHours() - number);
                break;
        }
        return this;
    }

    format(str) {
        const { date } = this;

        return str
            .replace(/Y/, date.getFullYear())
            .replace(/m/, (date.getMonth() + 1).toString().padStart(2, 0))
            .replace(/d/, date.getDate().toString().padStart(2, 0))
            .replace(/H/, date.getHours().toString().padStart(2, 0))
            .replace(/i/, date.getMinutes().toString().padStart(2, 0))
            .replace(/s/, date.getSeconds().toString().padStart(2, 0));
    }
}