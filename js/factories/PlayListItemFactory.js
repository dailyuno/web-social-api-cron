const Factory = require('../Factory');

module.exports = class PlayListItemFactory extends Factory {
    exists(play_list_id, video_id) {
        const { items } = this;
        const item = items.findIndex(x => x.play_list_id === play_list_id && x.video_id === video_id);

        if (item >= 0) {
            return true;
        }

        return false;
    }

    find(play_list_id, video_id) {
        return this.items.find(x => x.play_list_id === play_list_id && x.video_id === video_id);
    }

    async get() {
        return super.get(`${this.baseUrl}/api/youtube-play-list-items`);
    }

    async create(params) {
        return super.create(`${this.baseUrl}/api/youtube-play-list-items`, params);
    }

    async update(id, params) {
        return super.update(`${this.baseUrl}/api/youtube-play-list-items/${id}`, params);
    }
}