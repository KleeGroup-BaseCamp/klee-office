# Local map searching service
local-map is a search-find service on all local maps of KleeGroup. The client-side is based on __jQuery.js__ and __d3.js__, and server-side is based on __express.js__. Here are the key features

* Autocomplete 
* Search bar toggle
* Info shown in box when hover on one table 


## Required Libraries

local-map uses the following additional node modules:

* cors 2.7.1 - provide cross-origin file transmit in __express__
* express 4.13.4 - provide local-server service
* lodash 4.5.1 - some js functions for array treatment
* body-parser 1.15.0 - parse incoming requests, JSON body parser

## Installation

server-side  
``npm install package.json``

``git bash`` at **local-map/api**, ``node index.js`` to start **express** server

open **index.html** at **local-map/app**

## Structure
### __API__
Here are the datas and services for server

__Data__
* maps (.svg)
* peopel (.json) - {"tableID": "", "email": "", "name": "", "firstName": "", "lastName": ""}

__Service__
* *getMap(req, res)* - *req*: **mapName**, *res*: **sendFile**
* *getAllPeople(req, res)* - *res*: **res.json** (return json file)

### __APP__
* **search.js + classie.js** - manage search-bar toggle effect, click search-icon will toggle search bar, and when click outside of search bar or suggestion box, search bar will hide.
* **script_plot_map.js** - first, click on floor number will show the whole map. 
                            second, hover on each table will show infos
* **autocomplete.js (jquery.autocomplete.js needed)** - first, input name in search bar will show corresponding suggestions,
                                                        second, select one suggestion will mark corresponding one as red.


