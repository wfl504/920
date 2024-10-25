use master
go

--ʹ��DDL��䴴�����ݿ⣺ExamACourseInfo��5�֣�
create database ExamACourseInfo
go

--ʹ��DML���������ݿ�
use ExamACourseInfo
go

--ʹ��DML��䴴����courseInfo����Ҫ���������ֶΣ�û�д�����䣬�˴����÷֣���
create table courseInfo(
	ID int primary key identity(1,1),
	Name varchar(50) not null,
	ClassHour int
)
go

--ʹ��insert��������Ϣ����Ŀ���������������ʱ��12
--��Ŀ��SQL Server�߼���ѯ��T-SQL��̣���ʱ��24
insert courseInfo values('���������',12),('SQL Server�߼���ѯ��T-SQL���',24)
go

--ʹ��update���ѡ��������������Ŀ�Ŀ�ʱ����Ϊ��32����5�֣�
update courseInfo set ClassHour=32 where Name='���������'
go

--ɾ����Ŀ��SQL Server�߼���ѯ��T-SQL��̡�����Ϣ��5�֣�
delete courseInfo where Name='SQL Server�߼���ѯ��T-SQL���'

--ʹ�����ݿ⹤�ߴ�movie.sql�ļ����������ݣ���ʹ���л�����л���ǰ���ݿ�Ϊ��movie��5�֣�
use movie
go

--ͳ�Ƶ�Ӱ��movie���е�Ӱ������ƽ��Ʊ�ۣ��ֶΣ�ticketPrice����Ҫ�������Ӱ������ƽ��Ʊ��
select count(*) ��Ӱ����,avg(ticketPrice) ƽ��Ʊ�� from movie

--ʹ�á��Ӳ�ѯ���������Ϊ��ϲ�硱�ĵ�Ӱ��Ϣ���漰��movie_type��movie��
select movieName ��Ӱ��,director ����,actors ��Ա,ticketPrice Ʊ��,'ϲ��' ���� 
from movie where typeId=(select id from movie_type where typeName='ϲ��')

--ʹ��T-SQL��䣬���������@movieName�������ڱ�������ĵ�Ӱ���ƣ�2�֣���
--ʹ�ö���ı����ӵ�Ӱ��movie���͵��ȱ�schedule���в�ѯ������Ӱ�ķ�ӳ��Ϣ
--Ҫ����������ĵ�Ӱû����ӳ��movie���е�isActiveΪ0��������ʾ���õ�Ӱû����ӳ����������ʾ
--��Ӱ���ƣ���ӳ��ID����ӳ���ڣ���ӳʱ�䣨��ȷʹ���жϽṹ��8�֣�
--��ѯ�����ʾû�з�ӳ��Ϣ��5�֣����ȫ����ȷ����ʾ��10�֣�
declare @movieName varchar(50)
select @movieName='�޼��'

if exists(select m.movieName ��Ӱ����,s.hallId ��ӳ��ID,s.screenDate ��ӳ����,s.screenTime ��ӳʱ�� 
from schedule s,movie m where s.movieId=m.id and m.movieName=@movieName and m.isActive=1)
begin
	select m.movieName ��Ӱ����,s.hallId ��ӳ��ID,s.screenDate ��ӳ����,s.screenTime ��ӳʱ�� 
	from schedule s,movie m where s.movieId=m.id and m.movieName=@movieName and m.isActive=1
end
else
begin
	print 'û�з�ӳ��Ϣ'
end

--ʹ�ô洢���̣�proc_ShowMovieTypeInfo��������ͱ�movie_type�����������͵����ƺ�ID��
--Ҫ������ȼ��洢�������Ƿ���ڣ����ύ�������10�֣�
if exists(select * from sysobjects where name='proc_ShowMovieTypeInfo')
drop proc proc_ShowMovieTypeInfo
go
create proc proc_ShowMovieTypeInfo
as
select typeName ����,id ID from movie_type
go
--exec proc_ShowMovieTypeInfo

--ʹ�ô洢���̣�proc_GetMovieAgvPrice������ÿ�����͵�Ӱ��ƽ��Ʊ�ۺ����Ʊ�ۣ�
--Ҫ������ȼ��洢�������Ƿ���ڣ����ύ�������10�֣�
--˵����������movie��
--����������������ƣ�@typeName�������������ƽ��Ʊ�ۣ�@avgTicketPrice�����Ʊ�ۣ�@maxTicketPrice��
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

--��֤
declare @avgTicketPrice decimal(6,2)=0
declare @maxTicketPrice decimal(6,2)=0
exec proc_GetMovieAgvPrice 'ϲ��',@avgTicketPrice output,@maxTicketPrice output
print 'ƽ��Ʊ�ۣ�'+convert(varchar(20),@avgTicketPrice)+'; ���Ʊ�ۣ�'+convert(varchar(20),@maxTicketPrice)

