#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sqlite3
import json # jsonfy search result
import sys 	# sys.exit()
import os   # deal with files

# Connection to SQLite database
os.chdir("/home/dev/local-map/api")
conn = sqlite3.connect("db.development.sqlite")
conn.text_factory = str
cursor = conn.cursor()

# Read file containing former Klee employees
os.chdir("/home/dev/local-map/api/data/")
utilisateursDesactives = open("KleeGroup_Desactives.json", 'r')
jsonData = json.load(utilisateursDesactives)
utilisateursDesactives.close();

# list firstname lastname of former Klee employees 
aSupprimer = list()

for i in jsonData:
	aSupprimer.append( i[1]['cn'][0].encode('utf-8'))

# delete movings related to former Klee employees
sql="DELETE FROM movings WHERE PersonPerId IN (SELECT per_id FROM people peo join movings mvg on peo.per_id = mvg.PersonPerId  where peo.firstname || \' \' ||  peo.lastname in ({seq}))".format(seq=','.join(['?']*len(aSupprimer)))
print "DELETE movings"
cursor.execute(sql, aSupprimer)
conn.commit()

# delete people who are former Klee employees 
sql="DELETE FROM people WHERE per_id IN (SELECT per_id FROM people peo where peo.firstname || \' \' ||  peo.lastname in ({seq}))".format(seq=','.join(['?']*len(aSupprimer)))
print "DELETE people"
cursor.execute(sql, aSupprimer)
conn.commit()


# read file containing current employees
os.chdir("/home/dev/local-map/api/data/")
utilisateursCourants = open("KleeGroup.json", 'r')
jsonData = json.load(utilisateursCourants)
utilisateursCourants.close();

# list firstname lastname of current Klee employees
courantsListe = list()

for i in jsonData:
	courantsListe.append( i[1]['cn'][0].encode('utf-8'))

print "liste utilisateursCourants"
print courantsListe
print "nb of elements :"
print len(courantsListe)


# get configurations list 
configurationsListe = list()
sql_configurations="select con_id from configurations"
for row in cursor.execute(sql_configurations):
	configurationsListe.append(row[0])
print configurationsListe	

# query inserting movings (ie offices) related to new employees 
sql_moving="insert into movings(ConfigurationConId, PersonPerId, formerOfficeOffId, newOfficeOffId, OfficeOffId, createdAt, updatedAt)	select ?, peo.per_id, null, off_id, off_id, datetime('now', 'localtime'), datetime('now', 'localtime') from people peo, offices off where peo.firstname = ? and peo.lastname = ? and off.name = ? and not exists(select 1 from people where firstname=? and lastname=?)"

# insert new employees into people table 
j = 0
for i in jsonData:
	param = list()
	splittedString = i[1]['cn'][0].split(" ",2)
	firstname = " "
	lastname = " "
	
	if len(splittedString) >= 1: 
		firstname = splittedString[0]
		if len(splittedString) > 1:
			lastname = splittedString[1]

	print firstname + "---" + lastname 
	param.append(firstname)
	param.append(lastname)
	if i[1].has_key('mail'):
		param.append(i[1]['mail'][0])
	else:
		param.append(" ")
	param.append(firstname)
	param.append(lastname)
	if i[1].has_key('department'):
		param.append(i[1]['department'][0])
	else:
		param.append(" ")	

	j += 1
	l = 0
	sql="insert into people(PolePolId, firstname, lastname, mail, createdAt, updatedAt) select pol_id, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime') from poles where not exists(select 1 from people where firstname=? and lastname=?)	and name=?	"
	cursor.execute(sql, param)

	for key, val in enumerate(configurationsListe):
		param_moving = list()
		param_moving.append(val)
		param_moving.append(firstname)
		param_moving.append(lastname)
		if i[1].has_key('physicalDeliveryOfficeName'):
			param_moving.append(i[1]['physicalDeliveryOfficeName'][0])
		else:
			param_moving.append(" ")
		param_moving.append(firstname)
		param_moving.append(lastname)	
		# insert moving related to new Klee employees 
		cursor.execute(sql_moving, param_moving)
		l += 1
	
	print l

conn.commit()

print j

sys.exit()