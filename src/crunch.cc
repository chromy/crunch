#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <string.h>

#include <emscripten/emscripten.h>
#include <sqlite3.h>

namespace {

sqlite3* g_db = nullptr;


static int callback(void *NotUsed, int argc, char **argv, char **azColName){
  int i;
  for (i=0; i<argc; i++) {
    printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
  }
  printf("\n");
  return 0;
}

} // namespace

extern "C" {

bool EMSCRIPTEN_KEEPALIVE crunch_open(int id) {
  if (sqlite3_open(":memory:", &g_db) != SQLITE_OK) {
    fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(g_db));
    sqlite3_close(g_db);
    return false;
  }
  return true;
}

bool EMSCRIPTEN_KEEPALIVE crunch_exec(int id, const char* query) {
  char* err_msg = nullptr;
  if (sqlite3_exec(g_db, query, callback, 0, &err_msg) != SQLITE_OK) {
    fprintf(stderr, "SQL error: %s\n", err_msg);
    sqlite3_free(err_msg);
    sqlite3_close(g_db);
    return false;
  }
  return true;
}

} // extern "C"

int main(int argc, char **argv) {
  return 0;
}

