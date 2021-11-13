const axios = require('axios');

module.exports = class YoutubeApi {
    static channelId = 'UCTaOU9vqcFgVl0Spiw-pwTQ';
    static key = 'AIzaSyBOh-ajNYbL3GIPvdyFMe6AmWnbt2jk0bI';
    static key = 'AIzaSyAcX0YI8MNHzYj1WjjF5iGPfdVLeTt-Igg';

    /**
     * 1일 전을 기준으로
     * 유튜브에 업로드 된 영상이 있는지 가지고 오는 함수
     */
    static async getRecentVideoItems(date) {
        try {
            const { channelId, key } = YoutubeApi;
            const url = `https://www.googleapis.com/youtube/v3/activities?channelId=${channelId}&key=${key}&part=snippet&order=date&publishedAfter=${date}`;
            const response = await axios.get(url);
            const { data } = response;
            const { items } = data;
            return items;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 유튜브 채널 - 재생목록 리스트 가지고 오기
     */
    static async getPlayLists(pageToken = null) {
        const { channelId, key } = YoutubeApi;

        try {
            let url = `https://www.googleapis.com/youtube/v3/playlists?channelId=${channelId}&key=${key}&part=snippet&maxResults=50`;

            if (pageToken) {
                url += `&pageToken=${pageToken}`;
            }

            const response = await axios.get(url);
            const { data } = response;
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 유튜브 재생목록의 영상들 가지고 오는 함수
     */
    static async getPlayListItems(id, pageToken = null) {
        try {
            const { key } = YoutubeApi;

            let url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${id}&key=${key}&part=snippet,contentDetails&maxResults=50`;

            if (pageToken) {
                url += `&pageToken=${pageToken}`;
            }

            const response = await axios.get(url);
            const { data } = response;
            return data;
        } catch (e) {
            console.log(e);
        }
    }
}
