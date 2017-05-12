RESULTS_LINE=7
UNMODIFIED_LINE=$RESULTS_LINE+2
OK_LINE=$UNMODIFIED_LINE+2
DRY_RUN_OFFSET=1

@test "running code migrations produces expected output" {
  git checkout sample.js
  echo "$output"
  run ../bin/jscodemigrate.sh run
  [ "${lines[$OK_LINE]}" = "1 ok" ]
  run diff sample.js sample.expected.js
  git checkout sample.js
}

@test "testing code migrations shows files as okay that will be modified" {
  run ../bin/jscodemigrate.sh test
  echo "$output"
  [ "${lines[$OK_LINE+$DRY_RUN_OFFSET]}" = "1 ok" ]
}

@test "testing code migrations shows files as unmodified that will be unchanged" {
  cp sample.expected.js sample.js
  run ../bin/jscodemigrate.sh test
  echo "$output"
  [ $(expr "${lines[$UNMODIFIED_LINE+$DRY_RUN_OFFSET]}" : ".*1 unmodified") -ne 0 ]
  git checkout sample.js
}

@test "dependencies subcommand pulls in codemods from the node_modules directory" {
  run ../bin/jscodemigrate.sh deps
  [ "$(ls codemods | grep 'sample-api-change')" = "20151211042858-sample-api-change.js" ]
  [ "$(ls codemods | grep 'not-an-api-change')" = "" ]
  rm codemods/20151211042858-sample-api-change.js
}

@test "generator creates new codemod with timestamp" {
  run ../bin/jscodemigrate.sh g TestThatGeneratorWorks
  [ $(expr $(ls codemods | grep 'test-that-generator-works') : "..............-test-that-generator-works.js") -ne 0 ]
  rm codemods/*-test-that-generator-works.js
}