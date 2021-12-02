const YoutubeApi = require('./YoutubeApi');
const SimpleDate = require('./SimpleDate');
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

    /**
     * 기준 날짜보다 더 전인지 확인
     * @param {String} publishedAt 
     * @returns 
     */
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

    /**
     * 유튜브에 업로드 된 영상이 있을 경우,
     * 채널 재생목록 리스트를 가지고 오고,
     * 데이터들 DB에 넣는 작업
     */
    async setItems() {
        try {
            const { playListFactory, playListItemFactory, videoFactory } = this;

            const playLists = await YoutubeApi.getAllPlayLists();
            await playListFactory.setSyncApi(playLists);

            const { items } = playListFactory;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const { id } = item;
                const playListItems = await YoutubeApi.getAllPlayListItems(id);

                await videoFactory.setSyncApi(playListItems);
                await playListItemFactory.setSyncApi(id, playListItems);
            }
        } catch (e) {
            console.log(e, 'setItems');
        }
    }
}