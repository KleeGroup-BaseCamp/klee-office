import json # jsonfy search result
import sys 	# sys.exit()
import ldap # ldap connection request
ldap.set_option(ldap.OPT_REFERRALS, 0)
ldap.set_option(ldap.OPT_TIMEOUT, 10)

with open('../package.json') as data_file:
  settings = json.load(data_file)

Server = settings['localmap']['url']
BaseDN = settings['localmap']['baseDN']
User = settings['localmap']['username']
Password = settings['localmap']['password']

Filter = 'cn=Amelie*'
Attrs = ('cn', 'physicalDeliveryOfficeName','mail')
#######################################################

con = ldap.initialize('ldap://klee.lan.net')
ldap_user = "Reader-LocalMap@KLEE.LAN.NET"
passwd = "Dd2*[r{WPtSc0CZ-?cYL"
base_dn = "ou=Utilisateurs,dc=klee,dc=lan,dc=net"

con.simple_bind_s(ldap_user, passwd)
filter_str = "cn=*Zekun"
attrs = ('cn', 'physicalDeliveryOfficeName', 'mail')

result = con.search_st(base_dn, ldap.SCOPE_SUBTREE, filterstr=filter_str, attrlist=attrs, timeout=5000)
print result
with open('zekun.json', 'w') as json_file:
	json.dump(result, json_file, ensure_ascii=False)

con.unbind_s()
sys.exit()