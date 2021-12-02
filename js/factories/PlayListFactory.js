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

    async delete(id) {
        return super.delete(`${this.baseUrl}/api/youtube-play-lists/${id}`, id);
    }

    async setSyncApi(playLists) {
        try {
            console.log(`${playLists.length}개 플레이리스트 발견`);

            await this.removeItems(playLists);
            await this.refreshItems(playLists);
        } catch (e) {
            console.log(e);
        }
    }

    async removeItems(playLists) {
        const { items } = this;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const { id } = item;
            const playListIndex = playLists.findIndex(x => x.id === id);

            if (playListIndex < 0) {
                await this.delete(id);
            }
        }
    }

    async refreshItems(playLists) {
        for (let i = 0; i < playLists.length; i++) {
            const playList = playLists[i];
            const { id, snippet } = playList;
            const { title, publishedAt } = snippet;

            await this.setItem(id, title, publishedAt);
        }
    }

    setItem(id, title, publishedAt) {
        if (this.exists(id)) {
            return;
        }

        return this.create({
            id,
            title,
            published_at: this.convertDate(publishedAt)
        });
    }
}