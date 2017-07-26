# -*- coding: utf-8 -*-

import json # jsonfy search result
import psycopg2
import sys 	# sys.exit()
import ldap3 as ldap # ldap connection request
from ldap3 import Server,Connection , NTLM, ALL, MODIFY_ADD, MODIFY_REPLACE

try:
    con_db = psycopg2.connect(database='localmap-dev', user='localmap-dev', host='laura.dev.klee.lan.net', password='localmap-dev')
except:
    print "I am unable to connect to the database"

cur=con_db.cursor()
cur.execute('SELECT firstname, lastname, "Desk".name, "Site".name,"Company".name '+ 
            'FROM "Person" '+
            'JOIN "Desk" ON "Desk".person_id="Person".per_id '+
            'JOIN "Site" ON "Site".sit_id="Desk".site_id '+
            'JOIN "BusinessUnit" ON "BusinessUnit".bus_id="Person"."businessUnit_id" '+
            'JOIN "Company" ON "Company".com_id="BusinessUnit".company_id;')
res=cur.fetchall()
print(res[0])

######################################################
with open('../config/config-ldap.json') as data_file:
    settings = json.load(data_file)

Serv = settings['url']
BaseDN = settings['baseDN']
BaseDNDesactives = settings['BaseDNDesactives']
User = settings['username']
Password = settings['password']


#######################################################

base_dn = BaseDN

server = Server(Serv, get_info=ALL)
con=Connection(server, user=BaseDN+'\\'+User, password=Password,authentication = NTLM ,return_empty_attributes=True)

if con.bind():
    #for each person we have to check if the office name in the active directory is up-to-date with the database
    for i in range(0,len(res)):
        name=(res[i][0]+" "+res[i][1]).decode("utf-8")
        print(name)
        if res[i][3]=="La Boursidière":
            officeName=("La Boursidière : "+res[i][2]).decode("utf-8")
        else:
            officeName=res[i][3].decode("utf-8")
        company=res[i][4].decode("utf-8")
        base='cn='+name+',ou='+company+','+base_dn.decode("utf-8")
        #print (base)
        
        con.search(base,'(cn='+name+')',attributes=['physicalDeliveryOfficeName'])
        if con.entries:
            if (not con.entries[0].physicalDeliveryOfficeName):
                print("add new office")
                # con.modify(base,{'physicalDeliveryOfficeName':[(MODIFY_ADD,[officeName])]})
            else:
                if not con.entries[0].physicalDeliveryOfficeName==officeName:
                    print("change my office")
                    print(con.entries[0].physicalDeliveryOfficeName)
                    print(officeName)
                    #  con.modify(base,{'physicalDeliveryOfficeName':[(MODIFY_REPLACE,[officeName])]})
        

con.unbind()
sys.exit()
