const Factory = require('../Factory');

module.exports = class PlayListFactory extends Factory {
    async get() {
        return super.get(`${this.baseUrl}/api/youtube-play-lists`);
    }

    async create(params) {
        return super.create(`${this.baseUrl}/api/youtube-play-lists`, params);
    }

    async update(id, params) {
        return super.update(`${this.baseUrl}/api/youtube-play-lists/${id}`, params);
    }
}