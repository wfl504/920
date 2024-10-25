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
	Addr nvarchar(50) default('�����人')
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

insert BookType values('�����'),('����'),('��ѧ'),('С˵'),('��ʫ��')
go

insert AuthorInfo values
('������','��','155****6912','��������'),
('��С��','��','188****6633','�㶫���'),
('������','Ů','0771-7658996','�����人'),
('��С��','Ů','155****6912','����������'),
('ŷ����','��','13277589961','�㶫��Զ')
go

insert BookInfo values
('���ݽṹ','�廪��ѧ������','2008-9-23',45.8,1,1),
('ʮ���Ϊʲô','������ѧ������','2010-2-20',99.9,2,4),
('���Դ���','�廪��ѧ������','2010-6-4',36,3,3),
('��������','���Ͻ���������','2020-9-10',60,4,2),
('SQL Server�߼����ݿ�&T-SQL���','����������','2021-7-1',75,1,5),
('Ȥζ��ѧ','����������','1990-1-1',5.6,3,1)
go


--2
delete BookInfo where PublishDate<'2000-1-1'
go

--3
update BookInfo set Price=Price*1.2 where PublishAdd='�廪��ѧ������'
go

--4
select * from AuthorInfo where Name like '%С%'
go

--5
select avg(Price) ƽ���۸� from BookInfo where PublishAdd='����������'
go

--6
select * from BookInfo where PublishDate>='2010-1-1' order by Price
go

--7
select * from BookInfo where TypeID=(select TypeID from BookType where TypeName='�����')
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
select b.*,a.Name,a.Sex,a.Tel,a.Addr from AuthorInfo a,BookInfo b where a.AuthorID=b.AuthorID and b.Price>50 and a.Sex='Ů'
go
--��֤
--select * from v_BookInfo_AuthorInfo

--10
if exists(select * from sysobjects where name='proc_proc_BoookInfo')
drop proc proc_proc_BoookInfo
go
create procedure proc_proc_BoookInfo
as
select * from BookInfo where AuthorID=(select AuthorID from AuthorInfo	where Name='������')
go
--��֤
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
--��֤
declare @BookCount int=0
exec proc_GetBookCountByTypeName '�����',@BookCount output
print '��ѯ��������Ϊ��'+convert(nvarchar(20),@BookCount)

