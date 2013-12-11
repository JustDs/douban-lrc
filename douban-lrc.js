
/**
 * 主程序入口
 */

var express = require('express');
var http = require('http');
var path = require('path');
var util = require('util');

var config = require('./config');

var routes = {

	mainPage: require('./routes/main-page'),
	lyrics: require('./routes/lyrics')
};


(function (logError) {

	// 应用初始化

	var app = express();


	// 环境配置

	app.set('port', config.server.port || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.bodyParser());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser(config.server.cookieSecret || ''));
	app.use(express.session());
	app.use(app.router);
	app.use(require('less-middleware')({ src: path.join(__dirname, 'static'), prefix: '/static' }));
	app.use('/static', express.static(path.join(__dirname, 'static')));
	app.use(require('express-uglify').middleware({ src: path.join(__dirname, 'static') }));
	app.enable('trust proxy');


	// 调试模式

	if ('development' === app.get('env')) {

		app.use(express.errorHandler());
	}


	// 路径映射

	app.get('/', function (req, res) {

		routes.mainPage(req, res, function (err) {

			if (logError && err) logError(err);
		});
	});

	app.post('/', function (req, res) {

		routes.lyrics(req, res, function (err) {

			if (logError && err) logError(err);
		});
	});


	// 启动应用

	http.createServer(app).listen(app.get('port'), function () {

		console.log('DoubanLRC listening on port ' + app.get('port'));
	});


})(function (err) {

	console.error('\n');
	
	while (err) {

		var message = '错误 ' + err.code + ': ' + err.message + '\n';

		for (var item in err.details) {

			message += item + ': ' + util.inspect(err.details[item], { depth: null }) + '\n';
		}

		(err.fatal ? console.error : console.warn)(message);

		err = err.prevErr;
	}
});