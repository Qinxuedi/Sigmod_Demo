import math
# import numpy as ns
from numpy import corrcoef
from features import Type
# ns.seterr(divide='ignore', invalid='ignore')

class Chart(object):
    bar=0
    line=1
    scatter=2
    pie=3
    chart=['bar','line','scatter','pie']


class View(object):
    def __init__(self,table,x_id,y_id,z_id,series_num,X,Y,chart):
        self.table=table
        self.fx=table.features[x_id]
        self.fy=table.features[y_id]
        self.z_id=z_id
        self.series_num=series_num
        self.X=X
        self.Y=Y
        self.chart=chart
        self.tuple_num=table.tuple_num
        self.M=self.Q=self.W=self.score=0
        self.getM()
        self.getQ()

    def getCorrelation(self,series_id):
        if self.fx.type==Type.temporal:
            data1=[i for i in range(self.tuple_num/self.series_num)]
        else:
            data1=self.X[series_id]
        data2=self.Y[series_id]
        log_data1=log_data2=[]
        if self.fx.type!=Type.temporal and self.fx.min>0:
            log_data1=map(math.log,data1)
        if self.fy.minmin>0:
            log_data2=map(math.log,data2)
        # linear
        result = abs(corrcoef(data1, data2)[0][1])

        # exponential
        if log_data2:
            r = abs(corrcoef(data1, log_data2)[0][1])
            if r > result:
                result = r

        # logarithm
        if log_data1:
            r = abs(corrcoef(log_data1, data2)[0][1])
            if r > result:
                result = r

        # power
        if log_data1 and log_data2:
            r = abs(corrcoef(log_data1, log_data2)[0][1])
            if r > result:
                result = r

        return result

    def getM(self):
        if self.chart==Chart.pie:
            if self.tuple_num==1:
                self.M=0
            elif 2<=self.tuple_num<=10:
                sumY=sum(self.Y[0])
                self.M=reduce(lambda x,y:x+y,map(lambda y:-(1.0*y/sumY)*math.log(1.0*y/sumY),self.Y[0]))
            elif self.tuple_num>10:
                sumY=sum(self.Y[0])
                self.M=reduce(lambda x,y:x+y,map(lambda y:-(1.0*y/sumY)*math.log(1.0*y/sumY),self.Y[0]))*10.0/self.tuple_num
        elif self.chart==Chart.bar:
            if self.tuple_num==1:
                self.M=0
            elif 2<=self.tuple_num<=20:
                self.M=1
            else:
                self.M=10.0/self.tuple_num
        elif self.chart==Chart.scatter:
            if self.series_num==1:
                self.M=self.getCorrelation(0)
            else:
                self.M=max([self.getCorrelation(i) for i in range(self.series_num)])
        else:
            if self.series_num==1:
                if self.getCorrelation(0)>0.3:
                    self.M=1
                else:
                    self.M=0
            else:
                if max([self.getCorrelation(i) for i in range(self.series_num)])>0.3:
                    self.M=1
                else:
                    self.M=0

    def getQ(self):
        self.Q=1-1.0*self.tuple_num/self.table.instance.tuple_num

    def output(self):
        print self.M,self.Q,self.W,self.score
        print self.fx.name,self.fy.name,Chart.chart[self.chart],self.table.describe
        print self.X
        print self.Y





