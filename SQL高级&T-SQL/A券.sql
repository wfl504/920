use master
go

--使用DDL语句创建数据库：ExamACourseInfo（5分）
create database ExamACourseInfo
go

--使用DML语句操作数据库
use ExamACourseInfo
go

--使用DML语句创建表courseInfo，需要包含以下字段（没有创建语句，此处不得分）：
create table courseInfo(
	ID int primary key identity(1,1),
	Name varchar(50) not null,
	ClassHour int
)
go

--使用insert语句添加信息：科目：计算机基础，课时：12
--科目：SQL Server高级查询与T-SQL编程，课时：24
insert courseInfo values('计算机基础',12),('SQL Server高级查询与T-SQL编程',24)
go

--使用update语句把“计算机基础”科目的课时更改为“32”（5分）
update courseInfo set ClassHour=32 where Name='计算机基础'
go

--删除科目“SQL Server高级查询与T-SQL编程”的信息（5分）
delete courseInfo where Name='SQL Server高级查询与T-SQL编程'

--使用数据库工具打开movie.sql文件，导入数据，并使用切换语句切换当前数据库为：movie（5分）
use movie
go

--统计电影表（movie）中电影数量与平均票价（字段：ticketPrice），要求输出电影数量及平均票价
select count(*) 电影数量,avg(ticketPrice) 平均票价 from movie

--使用“子查询”查出类型为“喜剧”的电影信息（涉及表：movie_type、movie）
select movieName 电影名,director 导演,actors 演员,ticketPrice 票价,'喜剧' 类型 
from movie where typeId=(select id from movie_type where typeName='喜剧')

--使用T-SQL语句，定义变量（@movieName），用于保存给定的电影名称（2分），
--使用定义的变量从电影表（movie）和调度表（schedule）中查询给定电影的放映信息
--要求：如果给定的电影没有上映（movie表中的isActive为0），则显示“该电影没有上映”，否则显示
--电影名称，放映厅ID，放映日期，放映时间（正确使用判断结构：8分：
--查询结果显示没有放映信息：5分，结果全部正确且显示：10分）
declare @movieName varchar(50)
select @movieName='无间道'

if exists(select m.movieName 电影名称,s.hallId 放映厅ID,s.screenDate 放映日期,s.screenTime 放映时间 
from schedule s,movie m where s.movieId=m.id and m.movieName=@movieName and m.isActive=1)
begin
	select m.movieName 电影名称,s.hallId 放映厅ID,s.screenDate 放映日期,s.screenTime 放映时间 
	from schedule s,movie m where s.movieId=m.id and m.movieName=@movieName and m.isActive=1
end
else
begin
	print '没有放映信息'
end

--使用存储过程（proc_ShowMovieTypeInfo）输出类型表（movie_type）中所有类型的名称和ID，
--要求必须先检查存储过程名是否存在，再提交创建命令（10分）
if exists(select * from sysobjects where name='proc_ShowMovieTypeInfo')
drop proc proc_ShowMovieTypeInfo
go
create proc proc_ShowMovieTypeInfo
as
select typeName 名称,id ID from movie_type
go
--exec proc_ShowMovieTypeInfo

--使用存储过程（proc_GetMovieAgvPrice）计算每种类型电影的平均票价和最高票价，
--要求必须先检查存储过程名是否存在，再提交创建命令（10分）
--说明：表名：movie；
--输入参数（类型名称：@typeName），输出参数（平均票价：@avgTicketPrice；最高票价：@maxTicketPrice）
if exists(select * from sysobjects where name='proc_GetMovieAgvPrice')
drop proc proc_GetMovieAgvPrice
go
create proc proc_GetMovieAgvPrice
@typeName varchar(50),
@avgTicketPrice decimal(6,2) output,
@maxTicketPrice decimal(6,2) output
as
select @avgTicketPrice=avg(ticketPrice),@maxTicketPrice=max(ticketPrice) 
from movie where typeId=(select id from movie_type where typeName=@typeName)
go

--验证
declare @avgTicketPrice decimal(6,2)=0
declare @maxTicketPrice decimal(6,2)=0
exec proc_GetMovieAgvPrice '喜剧',@avgTicketPrice output,@maxTicketPrice output
print '平均票价：'+convert(varchar(20),@avgTicketPrice)+'; 最高票价：'+convert(varchar(20),@maxTicketPrice)

