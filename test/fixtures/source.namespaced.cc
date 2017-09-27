#include "parser/rapidjson_parser.h"

namespace impeach {
namespace trump {

RapidJsonParser::RapidJsonParser(const char* json) {
  rapidjson::Document d;
  d.ParseInsitu(const_cast<char*>(json));
}

}
}
