import datetime
from features import Type
from view import View
class Navigation(object):
    def __init__(self,instance,describe,x_name,y_name,chart,filter_id,filter_value):
        self.instance=instance
        self.describe = describe
        self.x_name, self.y_name,self.z_name,self.filter_id,self.filter_value= x_name, y_name,'',filter_id,filter_value
        if len(self.describe)>=3 and self.describe[0:3]=='BIN':
            t=self.x_name.find('/')
            if t !=-1:
                self.x_name=self.x_name[0:t]
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

    def fit(self,table,x_id,new_y_id,chart):
        x_type=self.instance.types[x_id]
        x_distinct=self.instance.tables[0].features[x_id].distinct
        y_name=table.names[new_y_id]
        y_min=table.features[new_y_id]
        if x_type==Type.numerical and chart=='scatter':
            return True
        if x_type==Type.categorical:
            if chart=='bar' and x_distinct<=20:
                return True
            if chart=='pie' and y_min>0 and x_distinct<=5 and not (len(y_name)>=6 and y_name[0:4]=='AVG(' and y_name[-1]==')'):
                return True
        if x_type==Type.temporal:
            if chart=='bar' and x_distinct<7:
                return True
            if chart=='line' and x_distinct>=7:
                return True
        return False

    def changeX(self):
        #case 1:none
        if self.describe=='':
            table_id=0
            table=self.instance.tables[table_id]
            for i in range(self.instance.tables[0].column_num):
                f=self.instance.tables[0].features[i]
                if i==self.x_id or self.instance.types[i]!=self.instance.types[self.x_id] or f.ratio<1.0:
                    continue
                if self.fit(table,i,self.y_id,self.chart):
                    v=View(table,i,self.y_id,-1,1,[table.T[i]],[table.T[self.y_id]],self.chart)
                    v.output('changeX','')
        #case 2:group by x, then group by other categorical/temporal
        elif len(self.describe1)>=5 and self.describe1[0:5]=='GROUP' and self.describe2=='':
            for i in range(self.instance.column_num):
                if i==self.x_id or self.instance.types[i]!=self.instance.types[self.x_id] or self.instance.tables[0].features[i].ratio==1:
                    continue
                if self.instance.types[i]==Type.categorical and self.instance.tables[0].features[i].distinct>20:
                    continue
                table_id=-1
                for j in range(self.instance.table_num):
                    if self.instance.tables[j].describe=='GROUP BY '+self.instance.names[i]:
                        table_id=j
                        break
                if table_id==-1:
                    new_table=self.instance.tables[0].dealWithGroup(i,0,self.instance.tables[0].tuple_num,True,True)
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
                if self.fit(table,i,new_y_id,self.chart):
                    v=View(table,new_x_id,new_y_id,-1,1,[table.T[new_x_id]], [table.T[new_y_id]], self.chart)
                    v.output('changeX','')
        #case 3:group by z, group by x then group by z,group by other categorical/temporal
        elif len(self.describe1)>=5 and self.describe1[0:5]=='GROUP' and len(self.describe2)>=5 and self.describe2[0:5]=='GROUP':
            for i in range(self.instance.column_num):
                if i==self.x_id or i==self.z_id or self.instance.types[i]!=self.instance.types[self.x_id]:
                    continue
                if self.instance.types[i]==Type.categorical and self.instance.tables[0].features[i].distinct>20:
                    continue
                if self.instance.tables[0].features[self.z_id].distinct>self.instance.tables[0].features[i].distinct:
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
                if self.fit(table,i,new_y_id,self.chart):
                    v = View(table, new_x_id, new_y_id, self.z_id, table.classify_num, [table.T[new_x_id][0:delta]],series_data, self.chart)
                    v.output('changeX','')


    def changeY(self):
        table_id=-1
        for i in range(self.instance.table_num):
            if self.instance.tables[i].describe==self.describe:
                table_id=i
                break
        if table_id==-1:
            if self.describe1[0:5]=='GROUP' and self.describe2=='':
                new_table=self.instance.tables[0].dealWithGroup(self.x_id,0,self.instance.tables[0].tuple_num,True,True)
            elif self.describe1[0:3]=='BIN' and self.describe2=='':
                if self.describe1[-4:]=='TIME':
                    new_table=self.instance.tables[0].dealWithIntervalBin(self.x_id,0,self.instance.tables[0].tuple_num,True,True)
                elif self.describe1[-4:]=='HOUR':
                    new_table=self.instance.tables[0].dealWithHourBin(self.x_id, 0,self.instance.tables[0].tuple_num,True,True)
                else:
                    new_table=self.instance.tables[0].dealWithWeekBin(self.x_id, 0,self.instance.tables[0].tuple_num,True,True)
            elif self.describe1[0:5]=='GROUP' and self.describe2[0:5]=='GROUP':
                self.instance.tables[0].D.sort(key=lambda tuple: tuple[self.z_id])
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
        self.origin_table_id=table_id
        table=self.instance.tables[table_id]

        #get new x id
        self.new_x_id=self.new_y_id=-1
        for i in range(table.column_num):
            if table.names[i]==self.x_name:
                self.new_x_id=i
                if self.new_y_id!=-1:
                    break
            if table.names[i]==self.y_name:
                self.new_y_id=i
                if self.new_x_id!=-1:
                    break
        self.X=table.T[self.new_x_id]
        self.Y=table.T[self.new_y_id]

        if self.z_id==-1:
            for i in range(table.column_num):
                if table.types[i]==Type.numerical and table.names[i]!=self.y_name:
                    if self.fit(table,self.x_id,i,self.chart):
                        v=View(table,self.new_x_id,i,-1,1,[table.T[self.new_x_id]],[table.T[i]],self.chart)
                        v.output('changeY','')
        else:
            for i in range(table.column_num):
                if table.types[i]==Type.numerical and table.names[i]!=self.y_name:
                    delta=table.tuple_num/table.classify_num
                    series_data=[table.T[i][series*delta:(series+1)*delta] for series in range(table.classify_num)]
                    if self.fit(table,self.x_id,i,self.chart):
                        v=View(table,self.new_x_id,i,self.z_id,table.classify_num,[table.T[self.new_x_id][0:delta]],series_data,self.chart)
                        v.output('changeY','')

    def changeCategory(self):
        if self.describe2=='':
            return
        table=self.instance.tables[self.origin_table_id]
        x_distinct=table.features[self.new_x_id].distinct
        for i in range(self.instance.tables[0].features[self.z_id].distinct):
            category=self.instance.tables[0].features[self.z_id].distinct_values[i][0]
            X=table.T[self.new_x_id][i*x_distinct:(i+1)*x_distinct]
            Y=table.T[self.new_y_id][i*x_distinct:(i+1)*x_distinct]
            v=View(table,self.new_x_id,self.new_y_id,-1,1,[X],[Y],self.chart)
            v.output('changeCategory',self.instance.names[self.z_id]+'='+category)


    def changeToNormalBin(self,bin):
        table_id=-1
        for i in range(self.instance.table_num):
            if self.instance.tables[i].describe==' '.join(self.describe.split()[0:3])+' '+bin:
                table_id=i
                break
        if table_id==-1:
            if bin=='TIME':
                new_table=self.instance.tables[0].dealWithIntervalBin(self.x_id,0,self.instance.tables[0].tuple_num,True,True)
            elif bin=='WEEKDAY':
                new_table = self.instance.tables[0].dealWithWeekBin(self.x_id, 0,self.instance.tables[0].tuple_num,True,True)
            else:
                new_table = self.instance.tables[0].dealWithHourBin(self.x_id, 0,self.instance.tables[0].tuple_num,True,True)
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
        v.output('changeBin','')

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
        v.output('changeBin','')


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

    def findSimilar(self):
        if self.chart!='line' or self.describe2:
            return
        for i in range(self.instance.column_num):
            if self.x_id==i or self.instance.types[i]!=Type.categorical:
                continue
            x_distinct,i_distinct=self.instance.tables[0].features[self.x_id].distinct,self.instance.tables[0].features[i].distinct
            if x_distinct*i_distinct!=self.instance.tuple_num:
                continue
            self.instance.tables[0].D.sort(key=lambda tuple: tuple[i])
            self.instance.tables[0].T=map(list,zip(*self.instance.tables[0].D))
            for j in range(self.instance.tables[0].features[i].distinct):
                data=self.instance.tables[0].T[self.y_id][j*x_distinct:(j+1)*x_distinct]
                min1,max1,min2,max2=min(data),max(data),min(self.Y),max(self.Y)
                d1=[1.0*(y-min1)/(max1-min1) for y in data]
                d2=[1.0*(y-min2)/(max2-min2) for y in self.Y]
                d=reduce(lambda x,y:x+y,[pow(d1[i]-d2[i],2) for k in range(x_distinct)])/x_distinct
                if d>0.001:
                    v=View(self.instance.tables[0],self.x_id,self.y_id,-1,1,[self.X],[data],self.chart)
                    v.output('similar',self.instance.names[i]+'='+self.instance.tables[0].features[i].distinct_values[j][0])




    def changeFilter(self):
        if self.filter_id==-1:
            return

        for i in range(self.instance.tables[0].features[self.filter_id].distinct):
            filter_value=self.instance.tables[0].features[self.filter_id].distinct_values[i][0]
            if filter_value==self.filter_value:
                continue
            table=self.instance.tables[0]
            table.D=[]
            table.types[self.filter_id]=Type.none
            table.tuple_num=0
            for tuple in self.instance.D:
                if tuple[self.filter_id]==filter_value:
                    table.D.append(tuple)
                    table.tuple_num+=1
            if table.tuple_num!=self.instance.tables[0].tuple_num:
                continue
            table.getFeatures()
            if table.features[self.x_id].ratio!=self.instance.tables[self.origin_table_id].features[self.x_id].ratio:
                continue

            #case 1:none
            if self.describe == '':
                new_table=table
            #case 2:group by...
            elif len(self.describe1) >= 5 and self.describe1[0:5] == 'GROUP' and self.describe2 == '':
                new_table=table.dealWithGroup(self.x_id,0,table.tuple_num,True,True)
            #case 3:bin by...
            elif len(self.describe1) >= 3 and self.describe1[0:3] == 'BIN' and self.describe2 == '':
                if self.describe1[-4:]=='TIME':
                    new_table=table.dealWithIntervalBin(self.x_id,0,table.tuple_num,True,True)
                elif self.describe1[-4:]=='HOUR':
                    new_table=table.dealWithHourBin(self.x_id,0,table.tuple_num,True,True)
                else:
                    new_table = table.dealWithWeekBin(self.x_id, 0, table.tuple_num, True, True)
            #case 4:group by ... ,group by...
            elif len(self.describe1) >= 5 and self.describe1[0:5] == 'GROUP' and len(self.describe2) >= 5 and self.describe2[0:5] == 'GROUP':
                pass
            #case 5:group by...,bin by...
            elif len(self.describe1) >= 5 and self.describe1[0:5] == 'GROUP' and len(self.describe2) >= 3 and self.describe2[0:3] == 'BIN':
                pass
            new_x_id=new_y_id=-1
            for i in range(new_table.column_num):
                if new_table.names[i]==self.x_name:
                    new_x_id=i
                    if new_y_id!=-1:
                        break
                if new_table.names[i]==self.y_name:
                    new_y_id=i
                    if new_x_id!=-1:
                        break
            new_table.getFeatures()
            if self.chart=='line':
                f1,f2=new_table.features[new_y_id],self.instance.tables[self.origin_table_id].features[new_y_id]
                min1,max1,min2,max2=f1.min,f1.max,f2.min,f2.max
                d1=[1.0*(y-min1)/(max1-min1) for y in new_table.T[new_y_id]]
                d2=[1.0*(y-min2)/(max2-min2) for y in self.Y]
                d=reduce(lambda x,y:x+y,[pow(d1[i]-d2[i],2) for i in range(new_table.tuple_num)])/new_table.tuple_num
                if d>0.01:
                    v = View(new_table, new_x_id, new_y_id,-1,1, [new_table.T[new_x_id]], [new_table.T[new_y_id]],self.chart)
                    v.output('similar',filter_value)




