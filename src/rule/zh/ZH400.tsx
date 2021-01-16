import {baseCountRule} from "../base";
import {isComma} from "../../parser/parser_node";
export const ZH400= baseCountRule(":ZH400", "comma", isComma,"lt", 6)

