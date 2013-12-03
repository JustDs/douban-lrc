
/*
 * 歌词查找处理模块
 */

var doubanFMAccessor = require('../accessor/douban-fm');

module.exports = function (fmInfo, callback) {

	console.log(fmInfo);

	doubanFMAccessor.getSongInfo(fmInfo, function (err, songInfo) {

		if (err) {

			if (callback) callback(err);

		} else {

			var lyricsInfo = {
				startTime: fmInfo.startTime,
				lyrics: [
					{ "lyric": "\u9648\u5955\u8fc5 - \u5144\u59b9", "time": 260 },
					{ "lyric": "\u4f5c\u66f2\uff1a\u5f90\u4f1f\u8d24  \u586b\u8bcd\uff1a\u6797\u5915", "time": 3500 },
					{ "lyric": "", "time": 124770 },
					{ "lyric": "", "time": 80930 },
					{ "lyric": "", "time": 6430 },
					{ "lyric": "\u5bf9\u6211\u597d \u5bf9\u6211\u597d \u597d\u5230\u65e0\u8def\u53ef\u9000", "time": 12940 },
					{ "lyric": "\u53ef\u662f\u6211\u4e5f\u5f88\u60f3 \u6709\u4e2a\u4eba\u966a", "time": 16830 },
					{ "lyric": "\u624d\u4e0d\u613f\u628a\u4f60\u5f97\u7f6a \u4e8e\u662f\u90a3\u4e48\u8fc2\u56de", "time": 21440 },
					{ "lyric": "\u4e00\u65f6\u8fdb \u4e00\u65f6\u9000 \u4fdd\u6301\u5b89\u5168\u8303\u56f4", "time": 27340 },
					{ "lyric": "\u8fd9\u4e2a\u9634\u8c0b\u8ba9\u6211\u597d\u60ed\u6127", "time": 30510 },
					{ "lyric": "\u4eab\u53d7\u88ab\u7231\u6ecb\u5473 \u5374\u4e0d\u8ba9\u4f60\u60f3\u5165\u975e\u975e", "time": 34820 },
					{ "lyric": "", "time": 144710 },
					{ "lyric": "\u5c31\u8ba9\u6211\u4eec\u865a\u4f2a", "time": 42120 },
					{ "lyric": "\u6709\u611f\u60c5 \u522b\u6d6a\u8d39", "time": 45260 },
					{ "lyric": "\u4e0d\u80fd\u76f8\u7231\u7684\u4e00\u5bf9", "time": 48990 },
					{ "lyric": "\u4eb2\u7231\u50cf\u4e24\u5144\u59b9", "time": 52510 },
					{ "lyric": "\u7231\u8ba9\u6211\u4eec\u865a\u4f2a", "time": 55520 },
					{ "lyric": "\u6211\u5f97\u5230 \u4e8e\u4e8b\u65e0\u8865\u7684\u5b89\u6170", "time": 58840 },
					{ "lyric": "\u4f60\u4e5f\u5f97\u5230 \u6a21\u4eff\u7231\u4e0a\u4e00\u4e2a\u4eba\u7684\u673a\u4f1a", "time": 63580 },
					{ "lyric": "\u6b8b\u5fcd\u4e5f\u4e0d\u662f\u6148\u60b2", "time": 70500 },
					{ "lyric": "", "time": 176810 },
					{ "lyric": "\u8fd9\u6837\u7684\u5173\u7cfb\u4f60\u8bf4 \u591a\u5b8c\u7f8e", "time": 73800 },
					{ "lyric": "\u773c\u770b\u4f60 \u770b\u8457\u6211 \u770b\u5f97\u90a3\u4e48\u66a7\u6627", "time": 92650 },
					{ "lyric": "\u88ab\u7231\u7231\u4eba\u539f\u6765\u4e00\u6837\u53ef\u60b2", "time": 95650 },
					{ "lyric": "\u4e3a\u751a\u4e48\u7adf\u7136\u9632\u5907 \u522b\u4eba\u7ed9\u6211\u732e\u5a9a", "time": 100010 },
					{ "lyric": "\u4e0d\u80fd\u63a8 \u4e0d\u80fd\u8981 \u8981\u4e86\u6015\u4f60\u8bef\u4f1a", "time": 105970 },
					{ "lyric": "\u8ba9\u6211\u60f3\u8d77\u66fe\u7ecf\u7231\u8fc7\u8c01", "time": 109140 },
					{ "lyric": "\u6211\u6240\u8981\u7684\u5979\u4e0d\u7ed9 \u597d\u50cf\u5c0f\u5077\u4e00\u6837\u5351\u5fae", "time": 114230 }
				]
			};

			if (callback) callback(null, songInfo, lyricsInfo);
		}
	});
};