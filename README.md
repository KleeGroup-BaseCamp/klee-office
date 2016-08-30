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
# Local map

local-map is a search-find-people service on local maps of KleeGroup La Boursidière. The client-side is based on __jQuery.js__ and __d3.js__, and server-side is based on __express.js__.


## Required Libraries

local-map uses the following additional node modules:

* cors 2.7.1 - provide cross-origin file transmit in __express__
* express 4.13.4 - provide local-server service
* lodash 4.5.1 - some js functions for array treatment
* body-parser 1.15.0 - parse incoming requests, JSON body parser
* fs - write to server's log
* util - write to server's log


## Structure

### __API__

__Data__
* maps (*.svg*)
* peopel (*.json*)

__Service__
* *getMap(req, res)* - *req*: **mapName**, *res*: **sendFile**
* *getAllPeople(req, res)* - *res*: **.json** (return json file)

-----------------------------------------------------------------

### __APP__
#### **_globalMapControl.js_** 

- **global var**: server, existMap, mapName   .
- **global function**: 
```javascript
// plot single large map (table color, zoom, tooltip)
mapPlot: function(name, callback){},
// plot all small maps (table color)
smallMapPlot: function(name, callback){},
// add tooltips for all small maps, where departments on each floor are listed
buildTooltips: function(names){},
// Erase all small maps
eraseMap: function(){}
```

#### **_justPlotMap.js_**

- `mapControl.smallMapPlot(name, function(){})`: plot small maps in `<div id="navigation-chart">`.
- `mapControl.buildTooltips(mapNames)`: add tooltips for all small maps.

#### **_clickAndPlot.js_**

- 'mapControl.mapPlot(mapControl.mapName, function(){})': plot corresponding single large map when click a small map.
- prepend mapName to legend.

#### **_toggle.js + classie.js_** 

- Manage **message-bar** (``<div id="message">``) toggle effect. Message-bar is just below search-bar, where details of a person are shown. Any valid search will toggle message bar, and when click **Home**, message bar will hide.

#### **_autocomplete.js_** 

- `$('#search-terms').autocomplete({lookup: people, onSelect: function (suggestion){} })`: input name in search bar will show corresponding suggestions.
- show suggestion's message in **message-bar**.
- `mapControl.eraseMap()`: erase small maps if there are.
- `mapControl.mapPlot(mapName, function(){})`: add-pin is in callback function (wait for map fully loaded).

-------------------------------------------------------------------
-------------------------------------------------------------------

# Installation & Configuration

Since now all our services and datas have been moved to the server, I will help you to connect to server and configure it as you want.

##Connect to server

There are several ways to connect to server, for example, on **linux** you can use ``ssh`` command of your console, or if you are using **windows**, ``putty`` might be your choice. But here I will only indroduce the way with ``git bash``.

If you use **windows**, make sure you have installed [git for windows](https://git-scm.com/download/win)

Open ``git bash``, type ``ssh dev@local-map.dev.klee.lan.net`` to enter server (you can get password by emailing the support).


##Check ``nodejs``

``node -v`` check version of ``node``, normarlly you have this already installed on the server. If not, [check this](https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora).


##Check file structure

When you login with ``dev@local-map.dev.klee.lan.net``, your user directory is ``/home/dev/``. Our project ``local-map`` is here. 

``tree foldername`` can help you have a global view of project's structure.


##Move local file to server

when you have finished your coding dans your local machine, use ``scp`` command to transport local file to server. For example,

* Use ``scp -r api dev@local-map.dev.klee.lan.net:local-map`` to transfer ``api`` folder to server  

* Use ``scp package.json dev@local-map.dev.klee.lan.net:local-map`` to transfer ``package.json`` file to server 


##Check if you have installed all necessary packages of ``node``

We have listed all necessary packages in ``package.json``. If not,

* Run ``npm install``(make sure ``package.json`` is in your current directory) to install necessary modules


##Start api services

* Open ``local-map/api``, run ``node index.js`` to start server's service

**Note**: you have to make sure that **port 80** is open for server machine, and bind **port 3000** with **port 80** with command here( run as root ):

``iptables -t nat -A PREROUTING -i ens160 -p tcp --dport 80 -j REDIRECT --to-port 3000``

(``-i ens160`` may change, you need to check your server with ``ls /etc/sysconfig/network-scripts/`` and check whether ``ifcfg-ens160`` exists. If it doesn't exit, see whether you have ``ifcfg-eth`` or ``ifcfg-eth0`` and change correspondingly)


##Set up autorun for python script

Since our programe for updating *KleeGroup.json* is written with python, you have to make sure ``python-ldap`` is installed on your server. 

To set up autorun of python script, ``crontab -e`` will be very helpful. Maybe you need more documentation with this command: ``man crontab``

My ``crontab`` command is as follows:
````
*/30 * * * * cd /home/dev/local-map/admin && /home/dev/anaconda2/bin/python /home/dev/local-map/admin/activedirectory.py
````
This means that: every 30 minutes, system will open folder ``/home/dev/local-map/admin``, then use ``/home/dev/anaconda2/bin/python`` as python interpreter to run following python file ``/home/dev/local-map/admin/activedirectory.py``.

--------------------------------------------------------------------------
--------------------------------------------------------------------------

# Maintenace of data base (*English Version*)

After having talked about how to install the backend from zero, we need to change our data base from time to time. There are mainly **two** kinds of changes: 

1. modify **_staff's data_**: move to another table, or even change his name :)
2. modify **_maps_** : add table, change table's position, etc.

_For the first kind_, we only need to change his infos of AD (Active Directory), and then the server will automatically update his position in the map (every 30 minutes).

_For the second kind_, things could become a little difficult. Since all our maps are stored and showed as ``.svg``, you have to edit the *svg* file directly, with a text editor (*sublime text* or *atom*).

Search **tables**, you will find all the infos about tables in one block

````
<g id="tables"> 
    <g id="N0-A-01"><rect fill="#f7f73b" fill-opacity="0.66" width="13.738516" height="27.789993" x="532.3736" y="58.504215" /></g>
    <g id="N0-A-02"><rect fill="#f7f73b" fill-opacity="0.66" width="13.738516" height="27.789993" x="546.50299" y="58.611759" /></g>
    ...
</g>
````
All you need to do is find the table you want to change, and give it another number or position or color ! But how ?

Well, open this *svg* file in a browser (chrome or firefox), move the mouse to the table you want to change, *right* click, choose *Inspecter* (or *Inspect* in English), and you will see the information for this element.

There are still other ways to add tables, such as using **inkscape** (but make sure you are working on the right layer !), or using raw **Autocad** file to make complete change of the map (remember you need to transform *.dwg* to *.svg*, and clean unnecessary parts or layers, **AutoDWG Converter** is recommended). 

But bare one thing in your mind: make sure what you are going to change before you really change something, and always backup your map files !

---------------------------------------------------------------------------
---------------------------------------------------------------------------
# La maintenance de donnée (employé et plan) (*Version Français*)

*    Changer les **datas d’employé** (déplacer vers un autre bureau) : il faut changer son data sur l’AD, après le serveur va mettre à jour les changement.

*    Changer les **plans** :

     1.		tous les plans sont de forme ``.svg``. Donc il faut éditer ``svg`` file directement, avec un éditeur de texte (*sublime text* ou *atom*).

     2.		``Ctrl+F`` puis chercher ``tables``, il y a tous les infos dans un bloque::

     		* exemple de code::

					 <g id="tables"> 
					    <g id="N0-A-01"><rect fill="#f7f73b" fill-opacity="0.66" width="13.738516" height="27.789993" x="532.3736" y="58.504215" /></g>
					    <g id="N0-A-02"><rect fill="#f7f73b" fill-opacity="0.66" width="13.738516" height="27.789993" x="546.50299" y="58.611759" /></g>
					    ...
					</g>

	3.		Trouver la table que tu veux changer, et changer son id ou sa place. 

	4.		Pour savoir les numéros de tables, ouvrir un ``svg`` file dans *chrome* ou *firefox* ou *safari*, **clic-droit** sur un table, choisir **Inspecter**.

	5.		Il y a d’autre méthode pour ajouter les tables ou changer leur positions, par exemple, **inkscape**. Ou éditer avec **Autocad**, les fichiers autocad sont fournis. (Mais il faut changer fichier ``dwg`` à fichier ``svg``, en utilisant **AutoDWG Converter**).			
---------------------------------------------------------------------------
---------------------------------------------------------------------------