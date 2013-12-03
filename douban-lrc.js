
/**
 * 主程序入口
 */

var express = require('express');
var http = require('http');
var path = require('path');

var routes = {

	mainPage: require('./routes/main-page'),
	lyrics: require('./routes/lyrics')
};


// 应用初始化

var app = express();


// 环境配置

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('C62C985229C29E4D'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'static') }));
app.use(require('express-uglify').middleware({ src: path.join(__dirname, 'static') }));
app.use(express.static(path.join(__dirname, 'static')));
app.enable('trust proxy');


// 调试模式

if ('development' == app.get('env')) {

	app.use(express.errorHandler());
}


// 路径映射

app.get('/', routes.mainPage);
app.post('/', routes.lyrics);


// 启动应用

http.createServer(app).listen(app.get('port'), function () {

	console.log('DoubanLRC listening on port ' + app.get('port'));
});
