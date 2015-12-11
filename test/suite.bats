RUN_OUTPUT_LINE=6
TEST_OUTPUT_LINE=$RUN_OUTPUT_LINE+1

@test "running code migrations produces expected output" {
  git checkout sample.js
  run jscodemigrate run
  [ "$status" -eq 0 ]
  [ $(expr "${lines[$RUN_OUTPUT_LINE]}" : ".*1 ok") -ne 0 ]
  run diff sample.js sample.expected.js
  [ "$status" -eq 0 ]
  git checkout sample.js
}

@test "testing code migrations shows files as okay that will be modified" {
  run jscodemigrate test
  [ "$status" -eq 0 ]
  [ $(expr "${lines[$TEST_OUTPUT_LINE]}" : ".*1 ok") -ne 0 ]
}

@test "testing code migrations shows files as unmodifed that will be unchanged" {
  cp sample.expected.js sample.js
  run jscodemigrate test
  [ "$status" -eq 0 ]
  [ $(expr "${lines[$TEST_OUTPUT_LINE]}" : ".*1 unmodifed") -ne 0 ]
  git checkout sample.js
}

@test "dependencies subcommand pulls in codemods from the node_modules directory" {
  run jscodemigrate deps
  [ "$status" -eq 0 ]
}