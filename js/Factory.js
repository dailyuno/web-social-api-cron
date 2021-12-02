const axios = require('axios');
const SimpleDate = require('./SimpleDate');

module.exports = class Factory {
    baseUrl = 'https://social-api.samsungbioglobal.com';

    constructor() {

    }

    async init() {
        this.items = await this.get();
    }

    async get(url) {
        try {
            const response = await axios.get(url);
            const { data } = response;
            const { items } = data;
            return items;
        } catch (e) {
            console.log(e.response);
        }
    }

    async create(url, params) {
        try {
            const response = await axios.post(url, params);
            const { data } = response;
            this.items.push(data);

            return data;
        } catch (e) {
            console.log(e.response);
        }
    }

    async update(url, params) {
        try {
            const response = await axios.put(url, params);
            const { data } = response;
            return data;
        } catch (e) {
            console.log(e.response);
        }
    }

    async delete(url, id) {
        try {
            const response = await axios.delete(url);
            const { data } = response;
            const index = this.items.findIndex(x => x.id === id);
            this.items.splice(index, 1);

            return data;
        } catch (e) {
            console.log(e.response);
        }
    }

    exists(id) {
        if (this.items.map(x => x.id).indexOf(id) < 0) {
            return false;
        }

        return true;
    }

    find(id) {
        return this.items.find(x => x.id === id);
    }

    /**
     * Date 비교 함수
     * @param {String} published_at 
     * @returns 
     */
    convertDate(published_at) {
        if (!published_at) {
            return null;
        }

        const d = new SimpleDate(published_at);
        return d.format('Y-m-d H:i:s');
    }
}