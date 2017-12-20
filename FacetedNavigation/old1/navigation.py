import datetime
from features import Type
from view import View
class Navigation(object):
    def __init__(self,instance,describe,x_name,y_name,chart):
        self.instance=instance
        self.describe = describe
        self.x_name, self.y_name,self.z_name = x_name, y_name,''
        self.x_id=self.instance.ids[self.x_name]
        if self.y_name>=5 and (self.y_name[0:4]=='AVG(' or self.y_name[0:4]=='SUM(' or self.y_name[0:4]=='CNT('):
            self.y_id=self.instance.ids[self.y_name[4:-1]]
        else:
            self.y_id=self.instance.ids[self.y_name]
        self.z_id=-1
        if self.describe == '':
            self.describe1 = self.describe2 = ''
        else:
            comma_id = self.describe.find(',')
            if comma_id == -1:
                self.describe1, self.describe2 = self.describe, ''
            else:
                self.describe1, self.describe2 = self.describe[0:comma_id], self.describe[comma_id + 2:]
                self.z_name=self.describe1[9:comma_id]
                self.z_id=self.instance.ids[self.z_name]
        self.chart=chart


    def changeX(self):
        #case 1:none
        if self.describe=='':
            table_id=0
            table=self.instance.tables[table_id]
            for i in range(self.instance.tables[0].column_num):
                if i!=self.y_id:
                    v=View(table,i,self.y_id,-1,1,[table.T[i]],[table.T[self.y_id]],self.chart)
                    v.output('changeX')
        #case 2:group by x, then group by other categorical/temporal
        elif len(self.describe1)>=5 and self.describe1[0:5]=='GROUP' and self.describe2=='':
            for i in range(self.instance.column_num):
                if i==self.x_id or self.instance.types[i]!=self.instance.types[self.x_id] or self.instance.tables[0].features[i].ratio==1:
                    continue
                table_id=-1
                for j in range(self.instance.table_num):
                    if self.instance.tables[j].describe=='GROUP BY '+self.instance.names[i]:
                        table_id=j
                        break
                if table_id==-1:
                    new_table=self.instance.tables[0].dealWithGroup(i,0,self.instance.tuple_num,True,True)
                    new_table.getFeatures()
                    self.instance.addTable(new_table)
                    table_id=self.instance.table_num-1
                table=self.instance.tables[table_id]
                #get new x,y id
                new_x_id=table.column_num-1
                new_y_id=-1
                for j in range(table.column_num):
                    if table.names[j]==self.y_name:
                        new_y_id=j
                        break
                if new_y_id==-1:
                    new_y_id=0
                v=View(table,new_x_id,new_y_id,-1,1,[table.T[new_x_id]], [table.T[new_y_id]], self.chart)
                v.output('changeX')
        #case 3:group by z, group by x then group by z,group by other categorical/temporal
        elif len(self.describe1)>=5 and self.describe1[0:5]=='GROUP' and len(self.describe2)>=5 and self.describe2[0:5]=='GROUP':
            for i in range(self.instance.column_num):
                if i==self.x_id or i==self.z_id or self.instance.types[i]!=self.instance.types[self.x_id]:
                    continue
                if self.instance.tables[0].features[self.z_id]>self.instance.tables[0].features[i]:
                    continue
                s = set()
                for j in range(self.instance.tuple_num):
                    s.add((self.instance.tables[0].D[j][self.z_id], self.instance.tables[0].D[j][i]))
                len_s=len(s)
                if len_s<=self.instance.tables[0].features[i].distinct:
                    continue
                table_id=-1
                for j in range(self.instance.table_num):
                    if self.instance.tables[j].describe1==self.describe1 and self.instance.tables[j].describe2=='GROUP BY '+self.instance.names[i]:
                        table_id=j
                        break
                if table_id==-1:
                    if len_s == self.instance.tuple_num:
                        new_table=self.instance.tables[0].getClassifyTable(self.z_id,i,self.instance.tables[0].dealWithGroup,False)
                    else:
                        new_table=self.instance.tables[0].getClassifyTable(self.z_id,i,self.instance.tables[0].dealWithGroup,True)
                    new_table.getFeatures()
                    self.instance.addTable(new_table)
                    table_id=self.instance.table_num-1
                table=self.instance.tables[table_id]
                #get new x,y id
                new_x_id=table.column_num-1
                new_y_id=-1
                for j in range(table.column_num):
                    if table.names[j]==self.y_name:
                        new_y_id=j
                        break
                delta = table.tuple_num / table.classify_num
                series_data = [table.T[new_y_id][series * delta:(series + 1) * delta] for series in range(table.classify_num)]
                v = View(table, new_x_id, new_y_id, self.z_id, table.classify_num, [table.T[new_x_id][0:delta]],series_data, self.chart)
                v.output('changeX')


    def changeY(self):
        table_id=-1
        for i in range(self.instance.table_num):
            if self.instance.tables[i].describe==self.describe:
                table_id=i
                break
        if table_id==-1:
            if self.describe1[0:5]=='GROUP' and self.describe2=='':
                new_table=self.instance.tables[0].dealWithGroup(self.x_id,0,self.instance.tuple_num,True,True)
            elif self.describe1[0:3]=='BIN' and self.describe2=='':
                if self.describe1[-4:]=='TIME':
                    new_table=self.instance.tables[0].dealWithIntervalBin(self.x_id,0,self.instance.tuple_num,True,True)
                elif self.describe1[-4:]=='HOUR':
                    new_table=self.instance.tables[0].dealWithHourBin(self.x_id, 0, self.instance.tuple_num,True,True)
                else:
                    new_table=self.instance.tables[0].dealWithWeekBin(self.x_id, 0, self.instance.tuple_num,True,True)
            elif self.describe1[0:5]=='GROUP' and self.describe2[0:5]=='GROUP':
                if self.y_name!=self.instance.names[self.y_id]:
                    new_table=self.instance.tables[0].getClassifyTable(self.z_id,self.x_id,self.instance.tables[0].dealWithGroup,True)
                else:
                    new_table=self.instance.tables[0].getClassifyTable(self.z_id,self.x_id,self.instance.tables[0].dealWithGroup,False)
            else:
                if self.describe2[-4:]=='TIME':
                    new_table = self.instance.tables[0].getClassifyTable(self.z_id, self.x_id,self.instance.tables[0].dealWithIntervalBin,True)
                elif self.describe2[-4:]=='HOUR':
                    new_table = self.instance.tables[0].getClassifyTable(self.z_id, self.x_id,self.instance.tables[0].dealWithHourBin,True)
                else:
                    new_table = self.instance.tables[0].getClassifyTable(self.z_id, self.x_id,self.instance.tables[0].dealWithWeekBin,True)
            new_table.getFeatures()
            self.instance.addTable(new_table)
            table_id=self.instance.table_num-1
        table=self.instance.tables[table_id]

        #get new x id
        new_x_id=-1
        for i in range(table.column_num):
            if table.names[i]==self.x_name:
                new_x_id=i
                break

        if self.z_id==-1:
            for i in range(table.column_num):
                if table.types[i]==Type.numerical and table.names[i]!=self.y_name:
                    v=View(table,new_x_id,i,-1,1,[table.T[new_x_id]],[table.T[i]],self.chart)
                    v.output('changeY')
        else:
            for i in range(table.column_num):
                if table.types[i]==Type.numerical and table.names[i]!=self.y_name:
                    delta=table.tuple_num/table.classify_num
                    series_data=[table.T[i][series*delta:(series+1)*delta] for series in range(table.classify_num)]
                    v=View(table,new_x_id,i,self.z_id,table.classify_num,[table.T[new_x_id][0:delta]],series_data,self.chart)
                    v.output('changeY')

    def changeZ(self):
        pass

    def changeToNormalBin(self,bin):
        table_id=-1
        for i in range(self.instance.table_num):
            if self.instance.tables[i].describe==' '.join(self.describe.split()[0:3])+' '+bin:
                table_id=i
                break
        if table_id==-1:
            if bin=='TIME':
                new_table=self.instance.tables[0].dealWithIntervalBin(self.x_id,0,self.instance.tuple_num,True,True)
            elif bin=='WEEKDAY':
                new_table = self.instance.tables[0].dealWithWeekBin(self.x_id, 0, self.instance.tuple_num,True,True)
            else:
                new_table = self.instance.tables[0].dealWithHourBin(self.x_id, 0, self.instance.tuple_num,True,True)
            new_table.getFeatures()
            self.instance.addTable(new_table)
            table_id=self.instance.table_num-1
        table=self.instance.tables[table_id]
        # get new x,y id
        new_x_id = new_y_id = -1
        for i in range(table.column_num):
            if table.names[i] == self.x_name:
                new_x_id = i
                if new_y_id != -1:
                    break
            if table.names[i] == self.y_name:
                new_y_id = i
                if new_x_id != -1:
                    break
        v = View(table, new_x_id, new_y_id, -1, 1, [table.T[new_x_id]], [table.T[new_y_id]], self.chart)
        v.output('changeBin')

    def changeNormalBin(self):
        bin=self.describe.split()[-1]
        if bin=='TIME':
            self.changeToNormalBin('WEEKDAY')
            if type(self.instance.tables[0].D[0][self.instance.ids[self.x_name]])!=type(datetime.date(1995, 10, 11)):
                self.changeToNormalBin('HOUR')
        elif bin=='WEEKDAY':
            self.changeToNormalBin('TIME')
            if type(self.instance.tables[0].D[0][self.instance.ids[self.x_name]]) != type(datetime.date(1995, 10, 11)):
                self.changeToNormalBin('HOUR')
        else:
            self.changeToNormalBin('TIME')
            self.changeToNormalBin('WEEKDAY')

    def changeToGroupBin(self,bin):
        table_id=-1
        for i in range(self.instance.table_num):
            if self.instance.tables[i].describe1==self.describe1 and self.describe2==' '.join(self.describe.split()[0:3])+' '+bin:
                table_id=i
                break
        if table_id==-1:
            if bin == 'TIME':
                new_table=self.instance.tables[0].getClassifyTable(self.z_id,self.x_id,self.instance.tables[0].dealWithIntervalBin,True)
            elif bin == 'WEEKDAY':
                new_table = self.instance.tables[0].getClassifyTable(self.z_id,self.x_id,self.instance.tables[0].dealWithWeekBin,True)
            else:
                new_table = self.instance.tables[0].getClassifyTable(self.z_id,self.x_id,self.instance.tables[0].dealWithHourBin,True)
            new_table.getFeatures()
            self.instance.addTable(new_table)
            table_id=self.instance.table_num-1
        table=self.instance.tables[table_id]
        # get new x,y id
        new_x_id = new_y_id = -1
        for i in range(table.column_num):
            if table.names[i] == self.x_name:
                new_x_id = i
                if new_y_id != -1:
                    break
            if table.names[i] == self.y_name:
                new_y_id = i
                if new_x_id != -1:
                    break
        delta=table.tuple_num/table.classify_num
        series_data=[table.T[new_y_id][series*delta:(series+1)*delta] for series in range(table.classify_num)]
        v=View(table,new_x_id,new_y_id,self.z_id,table.classify_num,[table.T[new_x_id][0:delta]],series_data,self.chart)
        v.output('changeBin')


    def changeGroupBin(self):
        bin=self.describe2.split()[-1]
        if bin=='TIME':
            self.changeToGroupBin('WEEKDAY')
            if type(self.instance.tables[0].D[0][self.instance.ids[self.x_name]])!=type(datetime.date(1995, 10, 11)):
                self.changeToGroupBin('HOUR')
        elif bin=='WEEKDAY':
            self.changeToGroupBin('TIME')
            if type(self.instance.tables[0].D[0][self.instance.ids[self.x_name]]) != type(datetime.date(1995, 10, 11)):
                self.changeToGroupBin('HOUR')
        else:
            self.changeToGroupBin('TIME')
            self.changeToGroupBin('WEEKDAY')

    def changeBin(self):
        if self.describe.find('BIN')==-1:
            return
        if self.describe2:
            self.changeGroupBin()
        else:
            self.changeNormalBin()

    def changeChart(self):
        pass






