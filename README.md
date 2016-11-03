[![build status](https://secure.travis-ci.org/substack/node-browserify.png)](https://travis-ci.org/substack/node-browserify)

#clean-me

Browser extension that runs on top of open_nsfw, Yahoo's open source deep learning neural model;

(https://github.com/yahoo/open_nsfw)

*clean-me* will identify probably NSFW links and images on any site you visit and 

allow you to act upon them as you wish



NSFW entities are categorized by default as the following:



| **Score**| `Color`      | 
| ---------|:------------:|
| 0  - .3  | Green        |
| .3 - .6  | Yellow       | 
| .6 - 1   | Red          | 



You may change these categorization settings by navigating to the clean-me icon in the top right corner of 
Chrome and then to the settings icon 








##TODO
 
+ Implement scrape of all <img> tags

+ Implement parsing of CSS attribute background-image

+ Add exchange of data between client and server

+ Configure automated Docker image build correctly 