import sys
import MySQLdb
from instance import Instance
from table import Table
from features import Type
from navigation import Navigation

#read data from database
table_name,describe,x_name,y_name,chart,filter_var,filter_value=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7]
conn=MySQLdb.connect(host='localhost',port=3306,user='root',passwd='Db10204!!',db='dataVisDB',charset='utf8')
cur=conn.cursor()
column_num=cur.execute('describe `'+table_name+'`')
desc=cur.fetchall()
names=[]
types=[]
for i in range(column_num):
    names.append(desc[i][0])
    types.append(Type.getType(desc[i][1].lower()))
tuple_num=cur.execute('select * from `'+table_name+'`')
instance=Instance(table_name,column_num,tuple_num,names,types)
table=Table(instance,'False','','')
table.column_num,table.tuple_num,table.names,table.types=column_num,tuple_num,names,types
table.origins=[i for i in range(column_num)]
instance.D=map(list,cur.fetchall())
cur.close()
conn.close()

#calculate features and get D if filter is null
table.D=instance.D
table.getFeatures()
instance.addTable(table)

#calculate features and get D if filter is not null
table.D=instance.D
table.getFeatures()
filter_id=-1
if filter_var:
    table.D=[]
    filter_id=instance.ids[filter_var]
    table.types[filter_id]=Type.none
    table.tuple_num=0
    for tuple in instance.D:
        if tuple[filter_id]==filter_value:
            table.D.append(tuple)
            table.tuple_num+=1
    table.T=map(list,zip(*table.D))
instance.addTable(table)


navigation=Navigation(instance,describe,x_name,y_name,chart,filter_id,filter_value)
navigation.changeX()
navigation.changeY()
navigation.changeCategory()
navigation.changeBin()
navigation.changeChart()
if filter_var:
    navigation.changeFilter()
else:
    navigation.findSimilar()

    