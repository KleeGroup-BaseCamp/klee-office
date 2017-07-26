# -*- coding: utf-8 -*-

import json # jsonfy search result
import sys 	# sys.exit()
import ldap3 as ldap # ldap connection request
from ldap3 import Server,Connection , NTLM, ALL, MODIFY_ADD, MODIFY_REPLACE

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
base_dn_desactives=BaseDNDesactives

server = Server(Serv, get_info=ALL)
con=Connection(server, user=BaseDN+'\\'+User, password=Password,authentication = NTLM ,return_empty_attributes=True)
attributes_des=['cn','mail']
attributes=['cn','mail','department','physicalDeliveryOfficeName']

if con.bind():
  try:
    results=con.search(search_base=base_dn, search_filter='(&(objectClass=person))' ,attributes=attributes)
    if results:
      print(base_dn)
      with open('../api/data/KleeGroup.json', 'w') as json_file:
	text=[]
	for x in con.entries:
	  if x.mail.value:
	    mail=x.mail.value.encode('utf-8')
	  else:
	    mail=""
	  if x.department.value:
	    dep=x.department.value.encode('utf-8')
	  else:
	    dep=""
	  if x.physicalDeliveryOfficeName.value:
	    office=x.physicalDeliveryOfficeName.value.encode('utf-8')
	  else:
	    office=""
	  text.append([x.entry_dn.encode('utf-8'),{'cn':[x.cn.value.encode('utf-8')],'mail':[mail],'department':[dep],'physicalDeliveryOfficeName':[office]}])

	json.dump(text, json_file, ensure_ascii=False)
	json_file.close()
  except IOError:
    print("error")

  try:  
    results=con.search(search_base=base_dn_desactives, search_filter='(objectClass=person)' ,attributes=attributes_des)
    if results:
      print(base_dn_desactives)
      with open('../api/data/KleeGroup_Desactives.json', 'w') as json_file:
	text=[]
	for x in con.entries:
	  if x.mail.value:
	    mail=x.mail.value.encode('utf-8')
	  else:
	    mail=""
	  text.append([x.entry_dn.encode('utf-8'),{'cn':[x.cn.value.encode('utf-8')],'mail':[mail]}])
	json.dump(text, json_file, ensure_ascii=False)
	json_file.close()
  except IOError:
    print("error")
	
con.unbind()
sys.exit()
