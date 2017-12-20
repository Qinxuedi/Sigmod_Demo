import sys
import MySQLdb
from instance import Instance
from table import Table
from features import Type
from navigation import Navigation

#read data from database
table_name,describe,x_name,y_name,chart=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]
conn=MySQLdb.connect(host='localhost',port=3306,user='root',passwd='Db10204!!',db='dataVisDB',charset='utf8')
cur=conn.cursor()
column_num=cur.execute('describe '+table_name)
desc=cur.fetchall()
names=[]
types=[]
for i in range(column_num):
    names.append(desc[i][0])
    types.append(Type.getType(desc[i][1].lower()))
tuple_num=cur.execute('select * from '+table_name)
instance=Instance(table_name,column_num,tuple_num,names,types)
table=Table(instance,'False','','')
table.column_num,table.tuple_num,table.names,table.types=column_num,tuple_num,names,types
table.origins=[i for i in range(column_num)]
instance.addTable(table)
table.D=map(list,cur.fetchall())
table.getFeatures()
cur.close()
conn.close()


navigation=Navigation(instance,describe,x_name,y_name,chart)
navigation.changeX()
navigation.changeY()
navigation.changeBin()
navigation.changeChart()