const Factory = require('../Factory');
const _ = require('lodash');

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

    async setSyncApi(playListItems) {
        await this.refreshItems(playListItems);
    }

    async refreshItems(playListItems) {
        for (let i = 0; i < playListItems.length; i++) {
            const item = playListItems[i];
            const { snippet, contentDetails } = item;
            const { title, description, thumbnails } = snippet;
            const { videoId, videoPublishedAt } = contentDetails;

            await this.setItem(videoId, title, description, videoPublishedAt, Object.keys(thumbnails));
        }
    }

    setItem(id, title, description, publishedAt = null, thumbnails) {
        const params = {
            id,
            title,
            description: description === '' ? null : description,
            published_at: this.convertDate(publishedAt)
        };

        if (this.exists(id)) {
            const video = this.find(id);

            if (_.isEqual(video, params)) {
                return;
            }

            console.log('영상 수정');
            return this.update(id, params);
        }

        console.log('영상 생성');
        return this.create({ thumbnails, ...params });
    }
}