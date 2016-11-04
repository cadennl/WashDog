var fs = require("fs");
var http = require("http");
var https = require("https");
var path = require("path");
var url = require("url");
var events = require("events").EventEmitter;
var util = require("util");

var cheerio = require("cheerio");

// "Image" object that contains property values of the image that has been identified
function Image(image, address){

	var at = this.attributes = image.attribs;

	this.name = path.basename(at.src, path.extname(at.src));
	//this.saveTo = path.dirname(require.main.filename) + "/";
	this.extension = path.extname(at.src);
	this.address = url.resolve(address, at.src);
	this.fromAddress = address;
}

Image.prototype.save = function(callback){

	var parsedUrl = url.parse(this.address);

	// Make a reference to the current instance.
	var ref = this;

	// Support HTTPS.
	var protocol = http;
	if(parsedUrl.protocol == "https:") {
		protocol = https;
	}

	var request = protocol.request(this.address, function(response){

		if(response.statusCode != 200){

			console.error("Image scraper(3): image couldn't be found. (statusCode:" + response.statusCode + ")");
			return request.end();
		}
		else{

			var imageFile = fs.createWriteStream(path.normalize(ref.saveTo + ref.name + ref.extension));

			imageFile.on("error", function(e){

				console.error("Image scraper(4): error while loading image: " + e + ".");
			});

			response.on("data", function(data){

				imageFile.write(data);
			});

			response.on("end", function(){

				imageFile.end();

				if(typeof(callback) == "function") callback.call(ref);
			});
		}
	});

	request.end();
	request.on("error", function(e){

		console.error(e);
	});
};

function Scraper(address){

	events.call(this);
	this.address = address;
}

// Inherit the methods of "events".
util.inherits(Scraper, events);

Scraper.prototype.scrape = function(callback){

	if(typeof(callback) == "function"){

		this.on("image", callback);
	}

	var parsedUrl = url.parse(this.address);

	// Make a reference to the current instance.
	var ref = this;

	// Support HTTPS.
	var protocol = http;
	if(parsedUrl.protocol == "https:") {
		protocol = https;
	}

	var request = protocol.request(this.address, function(response){

		if(response.statusCode != 200){
			console.error("Image scraper(1): web page couldn't be found. (statusCode:" + response.statusCode + ")");
			ref.emit("end");
			request.end();
			return process.exit(1);
		}
		else{

			response.setEncoding("utf8");

			var previous = "",
				current;

			response.on("data", function(data){
				var current = previous + data;

				current.replace(/<img[\S\s]*?>/ig, function(responseData){
					var loadedCheerio = cheerio.load(responseData);
					var image = new Image(loadedCheerio("img")[0], ref.address);
					console.log(image);
					ref.emit("image", image);
				});

				previous = data;
			});

			response.on("end", function(){
				ref.emit("end");
			});
		}
	});
	request.end();

	request.on("error", function(e){

		console.error("Image scraper(2): error while loading web page: " + e + ".");
	});
};

var list = [];
var currentURL = window.location.href;
var scraper = new Scraper(currentURL);

scraper.scrape(function(image){
	list.push(image.address);
});

console.log(list);

