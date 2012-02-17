SRC_DIR = source
BUILD_DIR = build
FOUNDRY_DIR = ../..
PRODUCTION_DIR = ${FOUNDRY_DIR}/scripts
DEVELOPMENT_DIR = ${FOUNDRY_DIR}/scripts_
UGLIFY = uglifyjs --unsafe -nc

BASE_FILES = ${FOUNDRY_DIR}/build/foundry_intro.js \
${SRC_DIR}/jquery.server.js \
${FOUNDRY_DIR}/build/foundry_outro.js

all: body min

body:
	cat ${BASE_FILES} > ${DEVELOPMENT_DIR}/server.js

min:
	${UGLIFY} ${DEVELOPMENT_DIR}/server.js > ${PRODUCTION_DIR}/server.js
