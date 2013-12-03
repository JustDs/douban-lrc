
/*
 * 歌词请求处理
 */

var lyricsProcessor = require('../processors/lyrics');

module.exports = function (req, res) {

	(function (response) {

		var fmInfo = {
			songId: null,
			artist: null,
			title: null,
			album: null,
			albumImgUrl: null,
			startTime: 0,
			channel: null,
			shareUrl: null
		};

		for (var key in fmInfo) {

			if (req.body[key]) {

				fmInfo[key] = req.body[key];

			} else {

				if (response) response({
					code: 1000,
					fatal: true,
					message: '请求格式不正确.',
					details : {}
				});

				return;
			}
		};

		lyricsProcessor(fmInfo, function (err, songInfo, lyricsInfo) {

			if (err) {

				if (response) response(err);

			} else {

				if (response) response(null, songInfo, lyricsInfo);
			}
		});

	})(function (err, songInfo, lyricsInfo) {

		if (err) {

			var message = '错误 ' + err.code + ': ' + err.message;

			for (var item in err.details) {

				message += '\n' + item + ': ' + err.details[item];
			}

			(err.fatal ? console.error : console.warn)(message);

			res.json({ code: err.code });

		} else {

			res.json({
				code: 0,
				songInfo: songInfo,
				lyricsInfo: lyricsInfo
			});
		}
	});
};