var fileSystemModule = require('fs');
var expressModule = require('express');
var app = expressModule();

app.use(expressModule.static('../Front-End-Page'));

app.get('/', function(req, res) {
    res.sendFile('../Front-End-Page/index.html');
});

var server = app.listen(8080, "127.0.0.1", function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

// ============================================================ (=x60)

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// ============================================================ (=x60)

var options = {
    host: '127.0.0.1',
    port: '4040',
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 140
    }
};

app.post("/", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
        [{
            "source": "KKTIX",
            "image_url": "https://t.kfs.io/upload_images/56029/___logo_medium.jpg",
            "type": [
                "Conf",
                "資安"
            ],
            "url": "http://tdohackerparty.kktix.cc/events/tdoh-conf-2016",
            "host": "TDOH 區聚會工作團隊",
            "fee": 500,
            "start_date": "2016/12/17 09:00",
            "description": "擺脫以往年會單方面輸出知識的框架 提供講師與會眾更優良的互動環境 傳承令人驚嘆的駭客技術與精神",
            "end_date": "2016/12/17 09:00",
            "title": "The Dungeons of Hackers Conference 2016 - 駭客的地下城",
            "number_of_people": -1,
            "location": "台中逢甲大學 人言大樓 地下一樓 / 407台中市西屯區文華路100號 "
        }, {
            "source": "KKTIX",
            "image_url": "https://t.kfs.io/upload_images/55635/Hackathon_1021_medium.jpg",
            "type": [
                "軟體",
                "資安",
                "開發"
            ],
            "url": "http://hackathontaiwanjr.kktix.cc/events/infoandstudio",
            "host": "明道中學資訊社。明道中學創客中隊",
            "fee": 0,
            "start_date": "2016/12/17 08:30",
            "description": "學習 & 研究 & 交流 Hackathon Taiwan Junior是一場為高中生量身打造的科技探索活動。   突破過往黑客松的框架，我們在鼓勵學員自由創作之餘，更引導年輕學子探索各種資訊技術。為",
            "end_date": "2016/12/17 08:30",
            "title": "Hackathon Taiwan Junior 報名系統 ",
            "number_of_people": -1,
            "location": "其他"
        }, {
            "source": "KKTIX",
            "image_url": "https://t.kfs.io/assets/kktix-og-icon-06989f684356f4d1ff2fc4ab0efd7498.png",
            "type": [
                "Conf",
                "資安"
            ],
            "url": "http://hitcon.kktix.cc/events/hitcon-training-2016",
            "host": "社團法人台灣駭客協會（HIT）",
            "fee": 50000,
            "start_date": "2016/11/27 09:00",
            "description": "主辦單位： 台灣駭客協會 Hacks in Taiwan Association | CHROOT Security Group | iThome 電週文化事業股份有限公司 會議地點： CLBC- ",
            "end_date": "2016/11/27 09:00",
            "title": "台灣駭客年會 HITCON 2016 Training",
            "number_of_people": -1,
            "location": "正確上課教室，開課前另行通知。"
        }]
    ));
    console.log('Send Post !');
});
