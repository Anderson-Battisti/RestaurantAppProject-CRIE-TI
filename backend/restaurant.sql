create table login (
    id serial primary key, 
    username varchar(50) not null,
	password TEXT not null);

insert into login (username, password) values ('admin', crypt('passwd', gen_salt('bf')));

create table payment_methods (
	id serial primary key, 
	name varchar(255), 
	method varchar(255),
	type varchar(255));