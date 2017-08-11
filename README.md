# Cahier des charges

**Qui** va utiliser

* les employées Klee Group (Plessis-Robinson, Issy les Moulineaux, étranger...)
* Managers (validation de déplacements et création de déplacements)


**Où** utiliser

* A leur bureau


**Quoi** à réaliser

1. Rechercher des personnes individuellement, ou par département 
1bis. Trouver les salles de réunion
2. Renseigner sa localisation
3. Réaliser des simulations de déplacements
4. Valider les simulations pour les mettre en place dans les locaux
5. Informer par mail les personnes concernées de changements dans l'application (nécessité de valider, configuration à mettre en place dans les locaux par exemple)
6. Utiliser le SSO pour authentifier les utilisateurs et leur conférer des droits
7. Rechercher des zones en général -> vouloir savoir à quoi cela correspond
8. Itinéraire -> comment faire pour y aller
9. Street View -> environment dans une photo

-------------------------------------------------------------
-------------------------------------------------------------
# Local map

local-map is a search-find-people service on local maps of KleeGroup La Boursidière. 
It also allows the managers to make simulations of offices allocations and then validate it, so they can be realized in the offices. 
The client-side is based on __jQuery.js__ and __d3.js__, and server-side is based on __express.js__.


## Required Libraries

local-map uses the following additional node modules:

* cors 2.7.1 - provide cross-origin file transmit in __express__
* body-parser 1.15.0 - parse incoming requests, JSON body parser
* bluebird 3.3.1 - provide promises
* connect-flash 0.1.1 - provide flash messages in the views
* cookie-parser 1.0.1 - dependency for connect-flash
* ejs 2.5.1 - templating engine to generate html with javascript
* express 4.13.4 - provide local-server service
* express-session 1.0.2 - dependency for connect-flash
* express-fileupload 0.1.4 - upload file with express server
* fs - write to server's log
* lodash 4.5.1 - some js functions for array treatment
* sequelize 3.23.6 - ORM and database support
* sequelize-cli 2.4.0 - ORM and database support
* postgreSQL - support for postgreSQL database
* util - write to server's log
* saml2-js - provide SSO service


## Structure

### __API__

__Data__
* maps (*.svg*)
* people (*.json*)

__Service__

Admin : 
* *getAllCompanies(req, res)* - *req*: , *res*: **companies(json)** 
* *getDepartmentsByCompany (req, res)* - *req*:**companyId** , *res*: **departments(json)**
* *getPeopleByDepartment(req, res)* - *req*:**departmentId** , *res*: **people(json)**
* *getPeopleByCompany (req, res)* - *req*:**companyId** , *res*: **people(json)**
* *saveValidator (req, res)* - *req*:**firstname**, **lastname**, **level**, *res*: 
* *updateValidator (req, res)* - *req*:**firstname**, **lastname**, **level**, *res*:
* *deleteValidator (req, res)* - *req*:**firstname**, **lastname**, **level**, *res*:
* *getAllValidators (req, res)* - *req*:, *res*:**managers(json)**
* *getValidatorsByDep (req, res)* - *req*: **depId**, *res*:**managers(json)**
* *saveAdministrator(req, res)* - *req*:**firstname**, **lastname** , *res*:
* *deleteAdministrator(req, res)* - *req*:**firstname**, **lastname** , *res*:

Configurations 
* *getAllConf(req, res)* - *req*:, *res*:**configurations(json)**
* *getConfByDep(req, res)* - *req*:**confId**, *res*:**configurations(json)**
* *getAllMovingsByConfIdCount (req, res)* - *req*:**configurationId**, *res*:**count(json)**
* *getPeopleMovingsByConId (req, res)* - *req*:**configurationId**, *res*:**movings(json)**
* *deleteConfiguration  (req, res)* - *req*:**configurationId**, *res*:
* *validateConfiguration  (req, res)* - *req*:**configurationId**, *res*:
* *getMovingsListByConfId (req, res)* - *req*:**configurationId**, *res*:**return txt file**
* *addNewConfiguration (req, res)* - *req*:**creator**, *res*:
* *addMoveLine (req, res)* - *req*:**moveline info**, *res*:
* *updateDateMoveSet (req, res)* - *req*:**moveline info**, *res*:
* *checkFromDeskMoveLine (req, res)* - *req*:**configurationId**, *res*: **moveline list**
* *checkToDeskMoveLine (req, res)* - *req*:**configurationId**, *res*:**moveline list**
* *setInvalidMoveline (req, res)* - *req*:**moveline id**, *res*:
* *isConfValid (req, res)* - *req*:**configurationId**, *res*: **json**
* *deleteMoveLine (req, res)* - *req*:**lastname**,**firstname**, *res*:
* *deleteMoveLineIfFind (req, res)* - *req*:**lastname**,**firstname**, *res*:
* *getLastMoveSet (req, res)* - *req*:, *res*:**moveset(json)**
* *getRecapOfMovings (req, res)* - *req*:**configurationId**, *res*:**movingsList(json)**
* *getNoPlacePersonByBusUnit (req, res)* - *req*:**businessUnitId**,**companyId**, *res*:**people(json)**
* *getNoPlacePersonByCompany (req, res)* - *req*:**companyId**, *res*:**people(json)**

Data 
* *populateDB (req, res)* - *req*:, *res*:
require KLeeGroup.json

DataAssociation 
* *associateData(req, res)* - *req*:, *res*:
require KLeeGroup.json

Localization
* *currentOfficeName (req, res)* - *req*:**firsname**, **lastname**, *res*:**office(json)**
* *currentOfficeNamebyId (req, res)* - *req*:**PeopleId**, *res*:**office(json)**
* *myLocalization  (req, res)* - *req*:**officeName**,**firstname**,**lastname**, *res*
* *getOverOccupiedDesk  (req, res)* - *req*:, *res* :**desk List(json)**
* *getPersonByDesk  (req, res)* - *req*:**desk name**, *res* :**person(json)**

Map
* *getMap(req, res)* - *req*: **mapName**, *res*: **sendFile**

People
* *getAllPeople(req, res)* - *res*: **.json** (return json file)
* *getPeople(req, res)* - *res*: **.json** (return json file) 
* *getLevelValidator  (req, res)* - *req*:**firstname**,**lastname**, *res* : **people(json)**
* *getAdministrator  (req, res)* - *req*:**firstname**,**lastname**, *res* : **people(json)**
* *getBusUnitCompanyByPerson  (req, res)* - *req*:**firstname**,**lastname**, *res* : **businessUnit(json)**
* *getInfoPerson  (req, res)* - *req*:**firstname**,**lastname**, *res* : **person(json)**
* *getLastMoveline (req, res)* - *req*:**firstname**,**lastname**, *res* : **moveline(json)**


-----------------------------------------------------------------

### __APP__


#### **_admin.js_** 
alreadyOneSelected :boolean
erase : remove a list
eraseAll : remove all lists
plotValidatorsList : plot list of validators

#### **_autocomplete.js_** 
- `$('#search-one-term').autocomplete({lookup: people, onSelect: function (suggestion){} })`: input name in search bar will show corresponding suggestions.


#### **_buildAdminScreen.js_** 

plot everything for admin screen. Control access include 


#### **_buildConfScreen.js_** 

plot everything for configurations screen. Control access include 


#### **_buildModifyScreen.js_** 
plot everything for configuration managment screen. 
- `$('#search-one-term').autocomplete({lookup: people, onSelect: function (suggestion){} })`: input name in search bar will show corresponding suggestions.
- `plotTable()` : display the table with each moveline (name of person, desks)
- `checkMovelines()` : check if movelines saved are still possible with the current configurations (some people may have change of place since the movelines were saved)
- `preparePlot()` : display buttons are not if the configuratoin cannot be changed (already validate)
- `changeLocalisation(name, currentDesk, isAlreadyUsed){}` : to change localisation of someone and add to the configuration
- `reloadMap(mapName)` : plot the map mapName with the movelines

#### **_changeLocalization.js_** 
 - Call when the user wants to update his own position
 - Display messages to guide the user
 - Update the database once the change is done

#### **_chooseFloor.js_** 
call of mapControl.confmapPlot
- 'mapControl.confmapPlot: function(myData, mapName, confId, isSavingLocalization,listnewmoves, callback){},
plot single map when clicking in the menu
same as clickandplot.js but choosefloor.js is used in the view modify.ejs and  clickandplot.js in index.ejs

#### **_classie.js_** 

#### **_clickAndPlot.js_**
call of mapControl.mapPlot
- 'mapControl.mapPlot(myData,mapControl.mapName, function(){})': plot corresponding single large map when click a small map.
- prepend mapName to legend.

#### **_configurations.js_** 
plotConfList : plot list of configurations with four action buttons on each configuration (modify ,print, validate, delete). 

 #### **_controlAccount.js_** 
 - Get the data on the user and display it (firstname, lastname, desk, location)

#### **_globalMapControl.js_** 
- **global var**: server, existMap, mapName   .
- **global function**: 
```javascript
// plot single large map (table color, zoom, tooltip)
mapPlot: function(myData, mapName, isSavingLocalization, callback){},
// plot all small maps (table color)
smallMapPlot: function(name, callback){},
//plot single large map for configurations with colors and tooltips of listnewmoves
confmapPlot: function(myData, mapName, confId, isSavingLocalization,listnewmoves, callback){},
// Erase all small maps
eraseMap: function(){}
```

#### **_justPlotMap.js_**
- `mapControl.mapPlot(myData,mapName,callback)`:  plot the map where the user is located on the index page.

#### **mapAdmin.js**
- **Tools to modify map's element**
 - `$("#add-desk-vertical").click(function(){})`: add vertical desk.
 - `$("#add-desk-horizontal").click(function(){})`: add horizontal desk.
 - `$("#mode-admin").click(function(){})`: move desk.
 - `$("#rm-desk").click(function(){})`: remove desk.
 - `$("#quit-admin").click(function(){})`: validate last changes to the map.
- **Tools to apply changes on a new map in the server**
 - `$("#dl-button").click(function(){})`: download the map.
 - `<div id="fileUpload"> ... </div>`: Contain form to handle the upload of a new map which using `/upload` route.
				      Click on the submit button "Appliquer" apply the upload to the server. 
 - `$("#undo-map").click(function(){})`: remove all changes.

#### **_polyfill.js_** 
polyfill for Internet Explorer compatibility.

#### **_searchMany.js_**
- **global var**: server, people, dataSearchedPeople, list_area, nbPeopleByArea   .
 - `$('#search-terms').on("keydown", function(event){}).autocomplete({minLength:0, source:function(request, response){}, focus:function(){}, select:function( event, ui){} })`: input names in search bar will show corresponding suggestions.
 - `plotNumberOfPeople(nbPeopleByArea, dataSearchedPeople)` : plot number of people searched for each floor.
 - `plotResultClick(nbPeopleByArea, dataSearchedPeople)` : click events to show maps with pins for each people searched.
 - `plotEtage(etage)` : plot map and result of 'etage'
 - `plotSite(site)` :plot message and result for 'site'
 

 

-------------------------------------------------------------------
-------------------------------------------------------------------

# Installation & Configuration

Since now all our services and data have been moved to the server, I will help you to connect to server and configure it as you want.

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

when you have finished your coding in your local machine, use ``scp`` command to transport local file to server. For example,

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

Since our program to update *KleeGroup.json* is written with python, you have to make sure ``ldap3`` is installed on your server. 

To set up autorun of python script, ``crontab -e`` will be very helpful. Maybe you need more documentation with this command: ``man crontab``

My ``crontab`` command is as follows:
````
@daily cd /home/dev/local-map/admin && /home/dev/anaconda2/bin/python /home/dev/local-map/admin/updateActiveDirectory.py
````
This means that: every day, system will open folder ``/home/dev/local-map/admin``, then use ``/home/dev/anaconda2/bin/python`` as python interpreter to run following python file ``/home/dev/local-map/admin/updateActiveDirectory.py``.

Three scripts python are currently launched every day by crontab:
- updateActiveDirectory.py : connect to the active directory of klee and update the 'physicalDeliveryOfficeName' attribut with our postgre database
- getActiveDirectory.py : copy all users and deactive users into two different files (KleeGroup.json and KleeGroup_Desactives.json), called by updateDataBase.py
- updateDataBase.py : call getActiveDirectory, add new users in our database and remove deactive users from our database

--------------------------------------------------------------------------
--------------------------------------------------------------------------

# Maintenace of data base (*English Version*)

After having talked about how to install the backend from zero, we need to change our data base from time to time. There are mainly **two** kinds of changes: 

1. modify **_staff's data_**: move to another table
2. modify **_maps_** : add table, change table's position, etc.

**modify _staff's data_**
_For the first kind_, if we want to it manually, we can change his info in the database, and then the server will automatically update his position in the map.
But a easier solution would be to change it in the application direclty thanks to the button "Mettre à jour ma position" or by creating a new confirguration (don't forget to validate it since by default configuration have draft status)

**modify _maps_**
_For the second kind_, there two solutions once again

But bare one thing in your mind: make sure what you are going to change before you really change something, and always backup your map files !

A first solution the easiest :
Connect on the app. Click on the administrator page and on the button administration des plans

1) Choose the map to modify
2) Choose an action to modify the map :
	- add a desk
	- move or remove a desk
	- save your modifications
3) Download the modifed svg map (be carefull to the name, if there is an other file with the same name in your "Downlaod" folder, the right name will change, ex :  N3 (1).svg).  
4) Upload the svg map you just create (check if the name is ok).
5) Press "Appliquer" to put the new map on the server.

Another solution (to do it manually) and more difficult
Since all our maps are stored and showed as ``.svg``, you have to edit the *svg* file directly, with a text editor (*sublime text* or *atom*).

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



# For our postgresql database : 
1. Global content
See local-map_diagram.xml in the repository to find out about the structure of the database

**Person and Profil**
Each person has a profil containing three booleans (isValidatorLvlOne, isValidatorLvlTwo, isAdministrator):
* a validator level One is responsible for the members of his departement/business Unit
* a validator level Two is responsible for the members of his company (=several departements)
* a administrator is responsible for the choice of all validators. This can be donne on the admin page in the application
Modifying validators can be donne on the admin page in the application
Modifying administrator must be done in app/js/controlAccount.js

**MoveSet, MoveLine and MoveStatus**
Each configuration (MoveSet) is composed of many MoveLine. A MoveLine is the move of one specific person from a desk to another.
MoveSet can have three different status :
  * 'Déplacement personnel' : the MoveSet of someone of update his own position
  * 'Brouillon' : default value when creating a new configuration. MoveLines are not applied while the configuration is not validate. These status can be useful when someone to do a simulation of a new configuration
  * 'Validée' : the MoveSet is applied on the current configuration. Once validate a MoveSet can not be undone
  
**Desk, Site and Person**
 Each person must have a desk so that every person are connected to a Site.
 The default value is Desk.name="Aucun" and Site.name="La Boursidière"
 For those who are on different site from 'La Boursidière', we have no plans yet. So their desk are Desk.name="externe" and Site.name is the name of the site they are on.
 This was made so that is would be much easier to change the app once we have plans for the Issy-Les-Moulineaux and others

2. Creating or recreating the database
If you want to recreate a clean database. 

Stop node server so as the database is not in use anymore.

Connect on the server with pgAdminIII, go to localmap_dev and delete all the tables (9) by using "supprimer en cascade" .

Start node again : it will recreate the tables, without data. 

Go on http://local-map/populateDB and wait for 2 minutes to be sure not to lock the database or make uncoherent data. 

The insert process is done. Then go on http://local-map/associateData and wait as well as for the first step. 

The update process with foreign keys is done. 



---------------------------------------------------------------------------
---------------------------------------------------------------------------
# La maintenance de donnée (employé et plan) (*Version Français*) --Non mise à jour-- voir english version au-dessus

*    Changer les **datas d’employé** (déplacer vers un autre bureau) : il faut changer son data sur l’AD, après le serveur va mettre à jour les changement.

*    Changer les **plans** :

    1.    Tous les plans sont de forme ``.svg``. Donc il faut éditer ``svg`` file directement, avec un éditeur de texte (*sublime text* ou *atom*).

    2.    Utiliser ``Ctrl+F`` puis chercher ``tables``, il y a tous les infos dans un bloque::

     			* exemple::
					<g id="tables"> 
					    <g id="N0-A-01"><rect fill="#f7f73b" fill-opacity="0.66" width="13.738516" height="27.789993" x="532.3736" y="58.504215" /></g>
					    <g id="N0-A-02"><rect fill="#f7f73b" fill-opacity="0.66" width="13.738516" height="27.789993" x="546.50299" y="58.611759" /></g>
					    ...
					</g>

    3.    Trouver la table que tu veux changer, et changer son id ou sa place. 

    4.    Pour savoir les numéros de tables, ouvrir un ``svg`` file dans *chrome* ou *firefox* ou *safari*, **clic-droit** sur un table, choisir **Inspecter**.

    5.    Il y a d’autre méthode pour ajouter les tables ou changer leur positions, par exemple, **inkscape** . Ou éditer avec *Autocad*, les fichiers autocad sont fournis. (Mais il faut changer fichier ``dwg`` à fichier ``svg``, en utilisant **AutoDWG Converter** ).

---------------------------------------------------------------------------
---------------------------------------------------------------------------
