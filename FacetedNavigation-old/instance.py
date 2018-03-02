class Instance(object):
    def __init__(self,table_name,column_num,tuple_num,names,types):
        self.table_name=table_name
        self.column_num,self.tuple_num=column_num,tuple_num
        self.table_num=self.view_num=0
        self.tables=[]
        self.views=[]
        self.names,self.types=names,types
        self.D=[]
        self.features=[]
        self.ids={}
        for i in range(self.column_num):
            self.ids[names[i]]=i

    def addTable(self,table):
        self.tables.append(table)
        self.table_num+=1

    def addTables(self,tables):
        for table in tables:
            self.addTable(table)