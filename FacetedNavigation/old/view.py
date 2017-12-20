import math
from numpy import corrcoef
from features import Type

class Chart(object):
    bar=0
    line=1
    scatter=2
    pie=3
    chart=['bar','line','scatter','pie']

class View(object):
    def __init__(self,table,x_id,y_id,z_id,series_num,X,Y,chart):
        self.table = table
        self.fx = table.features[x_id]
        self.fy = table.features[y_id]
        self.z_id = z_id
        self.series_num = series_num
        self.X = X
        self.Y = Y
        self.chart = chart
        self.tuple_num = table.tuple_num

    def output(self,changeTag):
        classify = str([])
        if self.series_num > 1:
            classify=str([v[0] for v in self.table.classes]).replace("u'",'\'').decode("unicode-escape").replace("'",'"')
        x_data = str(self.X)
        # print x_data
        if self.fx.type == Type.numerical:
            x_data = str(self.X).replace("'", '"').replace('L', '')
        elif self.fx.type == Type.categorical:
            x_data = str(self.X).replace("u'", '\'').decode("unicode-escape").replace("'", '"')
        else:
            len_x = len(self.X)
            x_data = '[' + reduce(lambda s1, s2: s1 + s2, [str(map(str, self.X[i])) for i in range(len_x)]).replace("'",'"') + ']'
        y_data = str(self.Y)
        if self.fy.type == Type.numerical:
            y_data = y_data.replace('L', '')
        elif self.fy.type == Type.categorical:
            y_data = y_data.replace("u'", '\'').decode("unicode-escape").replace("'", '"')
        data='{"changeTag": '+ '"'+ changeTag +'"' +', "describe":"'+self.table.describe+'","x_name":"'+self.fx.name+'","y_name":"'+self.fy.name+'","chart":"'+self.chart+'","classify":'+classify+',"x_data":'+x_data+',"y_data":'+y_data+'}'
        print data


