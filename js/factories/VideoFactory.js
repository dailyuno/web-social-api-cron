const Factory = require('../Factory');

module.exports = class VideoFactory extends Factory {
    async get() {
        return super.get(`${this.baseUrl}/api/youtube-videos`);
    }

    async create(params) {
        return super.create(`${this.baseUrl}/api/youtube-videos`, params);
    }

    async update(id, params) {
        return super.update(`${this.baseUrl}/api/youtube-videos/${id}`, params);
    }
}