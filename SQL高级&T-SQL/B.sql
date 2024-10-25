use master
go

create database BookTest
go

use BookTest
go

create table BookType(
	TypeID int primary key identity(1,1),
	TypeName nvarchar(50)
)
go

create table AuthorInfo(
	AuthorID int primary key identity(1,1),
	Name nvarchar(50),
	Sex nvarchar(50),
	Tel nvarchar(50),
	Addr nvarchar(50) default('湖北武汉')
)
go

create table AuthorInfo(
	ID int primary key identity(1,1),
	BookName nvarchar(50),
	PublishAdd nvarchar(50),
	PublishDate date,
	Price decimal(6,2),
	TypeID int,
	AuthorID int
	foreign key (TypeID) references BookType(TypeID),
	foreign key (AuthorID) references AuthorInfo(AuthorID)
)
go

insert BookType values('计算机'),('科普'),('数学'),('小说'),('古诗词')
go

insert AuthorInfo values
('王庆瑞','男','155****6912','湖南永州'),
('赵小凡','男','188****6633','广东羊城'),
('李玲玲','女','0771-7658996','湖北武汉'),
('唐小蝉','女','155****6912','北京海淀区'),
('欧阳炫','男','13277589961','广东清远')
go

insert BookInfo values
('数据结构','清华大学出版社','2008-9-23',45.8,1,1),
('十万个为什么','北京大学出版社','2010-2-20',99.9,2,4),
('线性代数','清华大学出版社','2010-6-4',36,3,3),
('遮天续集','湖南教育出版社','2020-9-10',60,4,2),
('SQL Server高级数据库&T-SQL编程','长江出版社','2021-7-1',75,1,5),
('趣味数学','长江出版社','1990-1-1',5.6,3,1)
go


--2
delete BookInfo where PublishDate<'2000-1-1'
go

--3
update BookInfo set Price=Price*1.2 where PublishAdd='清华大学出版社'
go

--4
select * from AuthorInfo where Name like '%小%'
go

--5
select avg(Price) 平均价格 from BookInfo where PublishAdd='长江出版社'
go

--6
select * from BookInfo where PublishDate>='2010-1-1' order by Price
go

--7
select * from BookInfo where TypeID=(select TypeID from BookType where TypeName='计算机')
go

--8
select * from BookType bt left join BookInfo bi on bt.TypeID=bi.TypeID order by bt.TypeID
go

--9
if exists(select * from sysobjects where name='v_BookInfo_AuthorInfo')
drop view v_BookInfo_AuthorInfo
go
create view v_BookInfo_AuthorInfo
as
select b.*,a.Name,a.Sex,a.Tel,a.Addr from AuthorInfo a,BookInfo b where a.AuthorID=b.AuthorID and b.Price>50 and a.Sex='女'
go
--验证
--select * from v_BookInfo_AuthorInfo

--10
if exists(select * from sysobjects where name='proc_proc_BoookInfo')
drop proc proc_proc_BoookInfo
go
create procedure proc_proc_BoookInfo
as
select * from BookInfo where AuthorID=(select AuthorID from AuthorInfo	where Name='李玲玲')
go
--验证
--exec proc_proc_BoookInfo

--11
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

