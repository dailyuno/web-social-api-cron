const _ = require('lodash');
const SimpleDate = require('./SimpleDate');
const YoutubeApi = require('./YoutubeApi');
const PlayListFactory = require('./factories/PlayListFactory');
const PlayListItemFactory = require('./factories/PlayListItemFactory');
const VideoFactory = require('./factories/VideoFactory');

module.exports = class App {
    constructor() {
        this.date = (new SimpleDate).subtract(7, 'days').format('Y-m-dT00:00:00Z');
        this.playListFactory = new PlayListFactory();
        this.playListItemFactory = new PlayListItemFactory();
        this.videoFactory = new VideoFactory();
    }

    async init() {
        const { playListFactory, playListItemFactory, videoFactory } = this;

        await playListFactory.init();
        await playListItemFactory.init();
        await videoFactory.init();

        console.log((new SimpleDate).format('Y-m-d H:i:s'));

        await this.setItems();

        console.log('done');
        console.log((new SimpleDate).format('Y-m-d H:i:s'));
    }

    isBeforeDate(publishedAt) {
        if (!publishedAt) {
            return false;
        }

        const { date } = this;
        const currentTime = (new Date(date)).getTime();
        const time = (new Date(publishedAt)).getTime();

        if (currentTime > time) {
            return true;
        }

        return false;
    }

    convertDate(published_at) {
        if (!published_at) {
            return null;
        }

        const d = new SimpleDate(published_at);
        return d.format('Y-m-d H:i:s');
    }

    /**
     * 유튜브에 업로드 된 영상이 있을 경우,
     * 채널 재생목록 리스트를 가지고 오고,
     * 데이터들 DB에 넣는 작업
     */
    async setItems() {
        try {
            await this.setPlayLists();

            const { playListFactory } = this;
            const { items } = playListFactory;

            for (let i = 0; i < items.length; i++) {
                const playList = items[i];
                const { id } = playList;
                await this.setPlayListItems(id);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async setPlayLists(pageToken = null) {
        try {
            const { items, nextPageToken } = await YoutubeApi.getPlayLists(pageToken);

            console.log(`${items.length}개 플레이리스트 발견`);

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const { id, snippet } = item;
                const { title, publishedAt } = snippet;

                await this.setPlayList(id, title, publishedAt);
            }

            if (nextPageToken) {
                await this.setPlayLists(nextPageToken);
            }
        } catch (e) {
            console.log(e);
        }
    }

    setPlayList(id, title, published_at) {
        const { playListFactory } = this;

        if (playListFactory.exists(id)) {
            return;
        }

        return playListFactory.create({
            id,
            title,
            published_at: this.convertDate(published_at)
        });
    }

    /**
     * 유튜브 재생목록의 영상들 가지고 와서 세팅
     * @param {String} playListId
     */
    async setPlayListItems(playListId, pageToken = null) {
        try {
            const { playListFactory } = this;
            const playList = playListFactory.find(playListId);
            const { title } = playList;
            const { items, nextPageToken } = await YoutubeApi.getPlayListItems(playListId, pageToken);

            console.log(`${title} 동영상 ${items.length}개 발견`)

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const { snippet, contentDetails } = item;
                const { title, description, thumbnails, publishedAt } = snippet;
                const { videoId, videoPublishedAt } = contentDetails;

                await this.setVideo(videoId, title, description, videoPublishedAt, Object.keys(thumbnails));
                await this.setPlayListItem(playListId, videoId, publishedAt);
            }

            if (nextPageToken) {
                await this.setPlayListItems(playListId, nextPageToken);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async setVideo(id, title, description, published_at = null, thumbnails) {
        const { videoFactory } = this;
        const params = {
            id,
            title,
            description: description === '' ? null : description,
            published_at: this.convertDate(published_at)
        };

        if (videoFactory.exists(id)) {
            const video = videoFactory.find(id);

            if (_.isEqual(video, params)) {
                return;
            }

            console.log('영상 수정');
            return videoFactory.update(id, params);
        }

        console.log('영상 생성');
        return videoFactory.create({
            thumbnails,
            ...params
        });
    }

    async setPlayListItem(play_list_id, video_id, published_at) {
        const { playListItemFactory } = this;

        if (playListItemFactory.exists(play_list_id, video_id)) {
            return;
        }

        console.log('플레이리스트 아이템 생성');
        return playListItemFactory.create({
            play_list_id,
            video_id,
            published_at: this.convertDate(published_at)
        });
    }
}