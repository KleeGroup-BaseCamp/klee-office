import json # jsonfy search result
import sys 	# sys.exit()
import ldap # ldap connection request
ldap.set_option(ldap.OPT_REFERRALS, 0)
ldap.set_option(ldap.OPT_TIMELIMIT, 10)
ldap.set_option(ldap.OPT_TIMEOUT, 10)
ldap.set_option(ldap.OPT_NETWORK_TIMEOUT, 10)

######################################################
with open('../config/config-ldap.json') as data_file:
  settings = json.load(data_file)

Server = settings['url']
BaseDN = settings['baseDN']
BaseDNDesactives = settings['BaseDNDesactives']
User = settings['username']
Password = settings['password']

Filter = 'cn=*'
Attrs = ('cn', 'physicalDeliveryOfficeName','mail', 'department')
AttrsDesact = ('cn')
#######################################################

con = ldap.initialize(Server)
ldap_user = User
passwd = Password
base_dn = BaseDN
base_dn_desactives = BaseDNDesactives.encode("utf-8" ) 


try:
	con.simple_bind_s(ldap_user, passwd)
	print ("sucess connection !")
except ldap.INVALID_CREDENTIALS:
	user_error_msg('wrong password or wrong username provided')
except ldap.TIMEOUT:
	user_error_msg("time out !")

filter_str = Filter
attrs = Attrs 
attrsDesact = AttrsDesact

try:
	result = con.search_st(base_dn, ldap.SCOPE_SUBTREE, filterstr=filter_str, attrlist=attrs, attrsonly=0, timeout=10)
	with open('../api/data/KleeGroup.json', 'w') as json_file:
		json.dump(result, json_file, ensure_ascii=False)
except ldap.FILTER_ERROR:
	user_error_msg("invalid filter !")
except ldap.TIMEOUT:
	user_error_msg("time out !")

#print "base name %s" % base_dn_desactives

try:
	result = con.search_st(base_dn_desactives, ldap.SCOPE_SUBTREE, filterstr=filter_str, attrlist=attrsDesact, attrsonly=0, timeout=10)
	with open('../api/data/KleeGroup_Desactives.json', 'w') as json_file:
		json.dump(result, json_file, ensure_ascii=False)
except ldap.FILTER_ERROR:
	user_error_msg("invalid filter !")
except ldap.TIMEOUT:
	user_error_msg("time out !")

con.unbind_s()
sys.exit()
