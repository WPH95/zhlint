import {baseCountRule} from "../base";
import {isCnCOLON} from "../../parser/parser_node";
export const ZH403= baseCountRule(":ZH403", "colon'：'", isCnCOLON, "lt",1)

