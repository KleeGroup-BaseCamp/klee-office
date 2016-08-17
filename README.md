# Cachier de charge

**Qui** va utiliser

* les employées Klee Group (Plessis-Robinson, Issy les Moulineaux, étranger...)
* Managers (validation de déplacement)


**Où** utiliser

* A leur bureau


**Quoi** à réaliser

1. Rechercher des personnes individuellement, ou par département 
1bis. Trouver les salles de réunion
2. Trouver un espace libre pour un nouvel arrivant
3. Allocation de place -> proposition + validation
4. Rechercher des zones en général -> vouloir savoir à quoi cela correspond
5. Itinéraire -> comment faire pour y aller
6. Street View -> environment dans une photo

-------------------------------------------------------------
-------------------------------------------------------------

# Installation & Configuration

Since now all our services and datas have been moved to the server, I will help you to connect to server and configure it as you want.

##connect to server

There are several ways to connect to server, for example, on **linux** you can use ``ssh`` command of your console, or if you are using **windows**, ``putty`` might be your choice. But here I will only indroduce the way with ``git bash``.

If you use **windows**, make sure you have installed [git for windows](https://git-scm.com/download/win)

Open ``git bash``, type ``ssh dev@local-map.dev.klee.lan.net`` to enter server (you can get password by emailing the support)
-------------------------------------------------------------

##check ``nodejs``

``node -v`` check version of ``node``, normarlly you have this already installed on the server. If not, [check this](https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora).
--------------------------------------------------------------

##check file structure

* When you login with ``dev@local-map.dev.klee.lan.net``, your user directory is ``/home/dev/``. Our project ``local-map`` is here. The file structure is as follows:

.
+-- admin
|	+-- activedirectory.py
+-- api
|	+-- debug.log
|	+-- index.js
|	+-- services
|		+-- map.js
|		+-- people.js
|	+-- data
|		+-- KleeGroup.json
|		+-- maps
|			+-- LaBoursidiere
|				+-- N0.svg
|				+-- ...
+-- app
|	+-- index.html
|	+-- js
|		+-- globalMapControl.js


* Create a folder named ``local-map``

* Use ``scp -r api dev@local-map.dev.klee.lan.net:local-map`` to transfer ``api`` folder to server  

* Use ``scp -r app dev@local-map.dev.klee.lan.net:local-map`` to transfer ``app`` folder to server 

* Use ``scp package.json dev@local-map.dev.klee.lan.net:local-map`` to transfer ``package.json`` file to server 

* Run ``npm install``(make sure ``package.json`` is in your current directory) to install necessary modules

* Open ``api``, run ``node index.js`` to start server's service

**Note**: you have to make sure that **port 80** is open for server machine, and bind **port 3000** with **port 80** with command here( run as root ):

``iptables -t nat -A PREROUTING -i ens160 -p tcp --dport 80 -j REDIRECT --to-port 3000``

(``-i ens160`` may change, you need to check your server with ``ls /etc/sysconfig/network-scripts/`` and check whether ``ifcfg-ens160`` exists. If it doesn't exit, see whether you have ``ifcfg-eth`` or ``ifcfg-eth0`` and change correspondingly)

~~``git bash`` at **local-map/api**, ``node index.js`` to start **express** server~~

~~open **index.html** at **local-map/app**~~

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


