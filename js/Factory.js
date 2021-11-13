const axios = require('axios');

module.exports = class Factory {
    baseUrl = 'https://social-api.samsungbioglobal.com';

    constructor() {

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

    async delete(url) {
        try {
            const response = await axios.delete(url);
            const { data } = response;
            return data;
        } catch (e) {
            console.log(e.response);
        }
    }
}