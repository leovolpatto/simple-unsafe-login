FROM mysql:latest

##caso precisarmos iniciar alguma coisa ja no banco...
#ADD setup.sql /docker-entrypoint-initdb.d