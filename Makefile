SRC_DIR = source
BUILD_DIR = build
FOUNDRY_DIR = ../..
PRODUCTION_DIR = ${FOUNDRY_DIR}/scripts
DEVELOPMENT_DIR = ${FOUNDRY_DIR}/scripts_
UGLIFY = uglifyjs --unsafe -nc
MODULARIZE = ${FOUNDRY_DIR}/build/modularize

BASE_FILES = ${SRC_DIR}/jquery.server.js

all: body min

body:
	cat ${BASE_FILES} > server.tmp.js
	${MODULARIZE} -n "server" server.tmp.js > ${DEVELOPMENT_DIR}/server.js
	rm -fr server.tmp.js

min:
	${UGLIFY} ${DEVELOPMENT_DIR}/server.js > ${PRODUCTION_DIR}/server.js
