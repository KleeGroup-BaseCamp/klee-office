#!/home/dev/anaconda2/bin/python
# -*- coding: utf-8 -*-
import psycopg2
import json # jsonfy search result
import sys 	# sys.exit()
import os   # deal with files
import ldap3 as ldap # ldap connection request
import datetime,time
import re

#os.system('python getActiveDirectory.py')
path="/home/dev/local-map/api/data/"
area_accepted=['N0','N1','N2','N3','N4','O1','O2','O3','O4']

#
# Connection to postgreSQL database
#
try:
    con_db = psycopg2.connect(database='localmap-dev', user='localmap-dev', host='laura.dev.klee.lan.net', password='localmap-dev')
except:
    print "I am unable to connect to the database"

cur=con_db.cursor()



#
# DELETE former employees of Klee Group
#

# Create file containing former Klee employees
utilisateursDesactives = open(path+"KleeGroup_Desactives.json", 'r')
jsonData = json.load(utilisateursDesactives)
utilisateursDesactives.close()

# list firstname lastname of former Klee employees to delete in the database 
aSupprimer = list()

for x in jsonData[0:10]:
    names=x[1]['cn'][0]
    firstname=""
    lastname=""
    for n in names.split(' '):
	if n.isupper():
	    lastname=lastname+n+' '
	else:
	    firstname=firstname+n+' '
    firstname=firstname[:-1].encode('utf-8')
    lastname=lastname[:-1].encode('utf-8')	
    cur.execute('SELECT count(*) '+ 
            	'FROM "Person" '+
            	'WHERE firstname=\'%s\' AND lastname=\'%s\';'%(firstname,lastname))
    res=cur.fetchone()
	
    if res[0]==1:
	aSupprimer.append( [firstname,lastname])
print aSupprimer


for elem in aSupprimer:
    print(elem)
    # delete profil of the former employee
    sql="DELETE FROM \"Profil\" USING \"Person\" WHERE \"Profil\".pro_id=\"Person\".profil_id AND \"Person\".firstname='%s' AND \"Person\".lastname='%s';"%(elem[0],elem[1])
    cur.execute(sql)
    rows_del=cur.rowcount
    if rows_del<=1:
	con_db.commit()

    # delete desk related to former Klee employees
    sql="DELETE FROM \"Desk\" USING \"Person\" WHERE \"Person\".per_id=\"Desk\".person_id AND \"Person\".firstname='%s' AND \"Person\".lastname='%s';"%(elem[0],elem[1])
    cur.execute(sql)
    rows_del=cur.rowcount
    if rows_del<=1:
	con_db.commit()

    # delete people who are former Klee employees 
    sql="DELETE FROM \"Person\" WHERE \"Person\".firstname='%s' AND \"Person\".lastname='%s';"%(elem[0],elem[1])
    cur.execute(sql)
    rows_del=cur.rowcount
    if rows_del<=1:
	con_db.commit()


#
# ADD new employees of Klee Group
#

# read file containing current employees
utilisateursCourants = open(path+"KleeGroup.json", 'r')
jsonData = json.load(utilisateursCourants)
utilisateursCourants.close();

# list firstname lastname of current Klee employees
aAjouter = list()
regex='('
for area in area_accepted:
    regex+=area+'|'
regex=regex[:-1]+')-[A-Z]-[0-9][0-9]'
for x in jsonData:
    if x[0].encode("utf-8").find('Test')==-1:
	names=x[1]['cn'][0]
	firstname=""
	lastname=""
	for n in names.split(' '):
	    if n.isupper() and n!='':
		lastname=lastname+n+' '
	    else:
		firstname=firstname+n+' '
	firstname=firstname[:-1].encode('utf-8')
	lastname=lastname[:-1].encode('utf-8')	
	#find site and desk
	location=x[1]['physicalDeliveryOfficeName'][0].encode('utf-8')
	desk="aucun"
	site="aucun"
	if location.find("issy")!=-1 or location.find("Issy")!=-1:
	    site="Issy-les-Moulineaux"
	    desk="externe"
	elif location.find("mans")!=-1 or location.find("Mans")!=-1:
	    site="Le Mans"
	    desk="externe"
	elif location.find("lyon")!=-1 or location.find("Lyon")!=-1:
	    site="Lyon";
	    desk="externe";
	elif location.find("bourgoin")!=-1 or location.find("Bourgoin")!=-1:
	    site="Bourgoin-Jailleux";
	    desk="externe";
	elif location.find("montpellier")!=-1 or location.find("Montpellier")!=-1:
	    site="Montpellier";
	    desk="externe";
	elif location.find("client")!=-1 or location.find("Client")!=-1:
	    site="sur site client";
	    desk="externe";
	else :
	    site="La Boursidière";
	    #check desk is the correct form
	    if len(location.split(' : '))==2:
		if re.match(regex,location.split(' : ')[1])!=None: 
		    desk=location.split(' : ')[1]
	    else :
		desk="aucun"	    

	company=x[0].split(',')[1].split('=')[1].encode('utf-8')
	dpt=x[1]['department'][0].encode('utf-8')
	if dpt=='':
	    dpt='Non renseigne-'+company
	if firstname!='' and lastname!='' and company!='' and firstname.find('Standard')==-1:

	    cur.execute('SELECT count(*) '+ 
	            'FROM "Person" '+
	            'WHERE firstname=\'%s\' AND lastname=\'%s\';'%(firstname,lastname))
	    res=cur.fetchone()
	    if res[0]==0:
		aAjouter.append( {'firstname':firstname,'lastname':lastname,'mail':x[1]['mail'][0].encode('utf-8'),'dpt':dpt,'company':company,'desk':desk,'site':site,'loc':location})
print(aAjouter)

#insert a new config
date=datetime.date.fromtimestamp(time.time())
sql="INSERT INTO \"MoveSet\"(name,creator,\"dateCreation\",\"dateUpdate\") VALUES ('%s','%s','%s','%s') RETURNING set_id;"%('automatic update dataBase '+date.strftime("%d/%m/%y"),'system' ,date,date)
cur.execute(sql)
set_id=cur.fetchone()[0]
con_db.commit()

for elem in aAjouter:
    print elem
    
    #insert new profil    
    sql="INSERT INTO \"Profil\"(\"isAdministrator\") VALUES ('False') RETURNING pro_id;"
    cur.execute(sql)
    pro_id=cur.fetchone()[0]
    
    #find businessunit
    #print(elem['dpt'],elem['company'])
    cur.execute('SELECT bus_id FROM "BusinessUnit" JOIN \"Company\" ON com_id=company_id WHERE "BusinessUnit".name=\'%s\' AND \"Company\".name=\'%s\';'%(elem['dpt'],elem['company']))
    res=cur.fetchone()
    if res=="" or res==None:
    	#case if the business_unit does not exist yet
        cur.execute("INSERT INTO \"BusinessUnit\"(name,company_id) SELECT \'%s\',com_id FROM \"Company\" WHERE name=\'%s\' RETURNING bus_id;"%(elem['dpt'],elem['company']))
        bus_id=cur.fetchone()[0]
    else:
        bus_id=res[0]
    print(bus_id)
    
    #insert new employees
    sql="INSERT INTO \"Person\"(firstname, lastname, mail,\"updatedAt\" ,profil_id ,\"businessUnit_id\") VALUES ('%s','%s','%s','%s','%i',%i) RETURNING per_id;"%(elem['firstname'], elem['lastname'], elem['mail'], date ,pro_id , bus_id)
    cur.execute(sql)
    per_id=cur.fetchone()[0]
    
    #insert new desk
    #print(elem['site'])
    cur.execute("SELECT sit_id FROM \"Site\" WHERE name='%s';"%(elem['site']))
    sit_id=cur.fetchone()[0]    
    if elem['desk']!="aucun" and elem['desk']!="externe":
	cur.execute("SELECT des_id FROM \"Desk\" WHERE name='%s';"%(elem['desk']))
	res=cur.fetchone()
	print(res)
	if res!= None:
	    des_id=res[0]
	    cur.execute("UPDATE \"Desk\" SET person_id='%i' WHERE des_id='%i';"%(per_id,des_id))
	else:
	    building=elem['desk'][0]
	    floor=elem['desk'][1]
	    sql="INSERT INTO \"Desk\"(name,\"dateUpdate\",building,floor,person_id,site_id) VALUES ('%s','%s','%s','%s',%i, %i) RETURNING des_id;"%(elem['desk'],date,building,floor,per_id,sit_id)
	    cur.execute(sql)
	    des_id=cur.fetchone()[0]	
    else:
	sql="INSERT INTO \"Desk\"(name,\"dateUpdate\",person_id,site_id) VALUES ('%s','%s',%i, %i) RETURNING des_id;"%(elem['desk'],date,per_id,sit_id)
	cur.execute(sql)
	des_id=cur.fetchone()[0]
         
    #insert new moveline  
    sql="INSERT INTO \"MoveLine\"(\"dateCreation\",status,move_set_id,person_id,\"toDesk\") VALUES ('%s','%s','%i','%i',%i);"%(date,"initialisation",set_id,per_id,des_id)
    cur.execute(sql)
    con_db.commit()


cur.close()
con_db.close()
sys.exit()
