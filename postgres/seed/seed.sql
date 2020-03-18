BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Draga', 'draga@mail.com', 5, '2020-01-01');
insert into login (hash, email) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'draga@mail.com');

COMMIT;