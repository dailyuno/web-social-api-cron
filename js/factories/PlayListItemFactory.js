const Factory = require('../Factory');

module.exports = class PlayListItemFactory extends Factory {
    async get() {
        return super.get(`${this.baseUrl}/api/youtube-play-list-items`);
    }

    async create(params) {
        return super.create(`${this.baseUrl}/api/youtube-play-list-items`, params);
    }

    async update(id, params) {
        return super.update(`${this.baseUrl}/api/youtube-play-list-items/${id}`, params);
    }

    async delete(id) {
        return super.delete(`${this.baseUrl}/api/youtube-play-list-items/${id}`, id);
    }

    exists(playListId, videoId) {
        const { items } = this;
        const item = items.findIndex(x => x.play_list_id === playListId && x.video_id === videoId);

        if (item >= 0) {
            return true;
        }

        return false;
    }

    find(playListId, videoId) {
        return this.items.find(x => x.play_list_id === playListId && x.video_id === videoId);
    }

    filter(playListId) {
        return this.items.filter(x => x.play_list_id === playListId);
    }

    async setSyncApi(playListId, playListItems) {
        await this.removeItems(playListId, playListItems);
        await this.refreshItems(playListId, playListItems);
    }

    async removeItems(playListId, playListItems) {
        const items = this.filter(playListId);

        console.log(playListItems.length, items.length)

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const { id, play_list_id, video_id } = item;
            const playListItemIndex = playListItems.findIndex(x =>
                x.snippet.playlistId === play_list_id &&
                x.contentDetails.videoId === video_id
            );

            if (playListItemIndex < 0) {
                await this.delete(id);
            }
        }
    }

    async refreshItems(playListId, playListItems) {
        try {
            for (let i = 0; i < playListItems.length; i++) {
                const item = playListItems[i];
                const { snippet, contentDetails } = item;
                const { publishedAt } = snippet;
                const { videoId } = contentDetails;

                await this.setItem(playListId, videoId, publishedAt);
            }
        } catch (e) {
            console.log(e);
        }
    }

    setItem(playListId, videoId, publishedAt) {
        if (this.exists(playListId, videoId)) {
            return;
        }

        console.log('플레이리스트 아이템 생성');
        return this.create({
            play_list_id: playListId,
            video_id: videoId,
            published_at: this.convertDate(publishedAt)
        });
    }
}