--切换数据库
use master
go

--创建一个数据库：BookTest；
create database BookTest
go

--切换数据库
use BookTest
go

--在数据库 BookTest 中创建一个书籍类型数据表 BookType
create table BookType(
	TypeID int primary key identity(1,1),
	TypeName nvarchar(50)
)
go
--在数据库 BookTest 中创建一个作者信息数据表 AuthorInfo
create table AuthorInfo(
	AuthorID int primary key identity(1,1),
	Name nvarchar(50),
	Sex nvarchar(50),
	Tel nvarchar(50),
	Addr nvarchar(50) default('湖北武汉')
)
go
--在数据库 BookTest 中创建一个书籍信息数据表 BookInfo
create table BookInfo(
	ID int primary key identity(1,1),
	BookName nvarchar(50),
	PublishAdd nvarchar(50),
	PublishDate date,
	Price decimal(6,2),
	TypeID int,
	AuthorID int
	--设置外键
	foreign key (TypeID) references BookType(TypeID),
	foreign key (AuthorID) references AuthorInfo(AuthorID)
)
go

--使用 insert 语句给三个表格添加对应数据
--书籍类型数据表 BookType
insert BookType values('计算机'),('科普'),('数学'),('小说'),('古诗词')
go
--作者信息数据表 AuthorInfo
insert AuthorInfo values
('王庆瑞','男','155****6912','湖南永州'),
('赵小凡','男','188****6633','广东羊城'),
('李玲玲','女','0771-7658996',''),
('唐小蝉','女','155****6912','北京海淀区'),
('欧阳炫','男','13277589961','广东清远')
go
--书籍信息数据表 BookInfo
insert BookInfo values
('数据结构','清华大学出版社','2008-9-23',45.8,1,1),
('十万个为什么','北京大学出版社','2010-2-20',99.9,2,4),
('线性代数','清华大学出版社','2010-6-4',36,3,3),
('遮天续集','湖南教育出版社','2020-9-10',60,4,2),
('SQL Server高级数据库&T-SQL编程','长江出版社','2021-7-1',75,1,5),
('趣味数学','长江出版社','1990-1-1',5.6,3,1)
go
--删除书籍信息表中出版日期在 2000 年之前的数据
delete BookInfo where PublishDate<'2000-1-1'
go
--将书籍信息表中出版社为“清华大学出版社”的书籍价格上调为原来的 1.2 倍
update BookInfo set Price=Price*1.2 where PublishAdd='清华大学出版社'
go
--查询作者信息表中作者姓名中带“小”字的数据
select * from AuthorInfo where Name like '%小%'
go
--查询长江出版社出版书籍的平均价格
select avg(Price) 平均价格 from BookInfo where PublishAdd='长江出版社'
go
--查询书籍信息表中出版日期在 2010 年之后出版的书籍，并且按价格进行升序排序
select * from BookInfo where PublishDate>='2010-1-1' order by Price
go
--使用子查询，在书籍信息表中找出书籍类型是“计算机”的书籍信息
select * from BookInfo where TypeID=(select TypeID from BookType where TypeName='计算机')
go
--使用左连接查询，查询每一种书籍类型对应的书籍信息，并且按书籍类型编号进行升序排序
select * from BookType bt left join BookInfo bi on bt.TypeID=bi.TypeID order by bt.TypeID
go
--创建一个视图：v_BookInfo_AuthorInfo,根据作者信息表和书籍信息表,查询书籍价格大于 50 且是女性作者的数据
if exists(select * from sysobjects where name='v_BookInfo_AuthorInfo')
drop view v_BookInfo_AuthorInfo
go
create view v_BookInfo_AuthorInfo
as
select b.*,a.Name,a.Sex,a.Tel,a.Addr from AuthorInfo a,BookInfo b where a.AuthorID=b.AuthorID and b.Price>50 and a.Sex='女'
go
--验证
--select * from v_BookInfo_AuthorInfo

--创建一个存储过程 proc_proc_BoookInfo，查询作者是“李玲玲”的书籍信息
if exists(select * from sysobjects where name='proc_proc_BoookInfo')
drop proc proc_proc_BoookInfo
go
create procedure proc_proc_BoookInfo
as
select * from BookInfo where AuthorID=(select AuthorID from AuthorInfo	where Name='李玲玲')
go
--验证
--exec proc_proc_BoookInfo

--创建一个存储过程 proc_GetBookCountByTypeName，实现以下功能：
--输入一个书籍类型，查询其在书籍信息表中有多少条数据
if exists(select * from sysobjects where name='proc_GetBookCountByTypeName')
drop proc proc_GetBookCountByTypeName
go
create proc proc_GetBookCountByTypeName
@TyoeName nvarchar(50),
@BookCount int output
as
select @BookCount=count(*) from BookInfo where TypeID=(select TypeID from BookType where TypeName=@TyoeName)
go
--验证
declare @BookCount int=0
exec proc_GetBookCountByTypeName '计算机',@BookCount output
print '查询到的数据为：'+convert(nvarchar(20),@BookCount)
