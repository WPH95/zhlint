import {baseCountRule} from "../base";
import {isPause} from "../../parser/parser_node";
export const limitPauseCount= baseCountRule(":ZH401", "pause'、'", isPause, "gt",2)

