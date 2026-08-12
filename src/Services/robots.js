import {api} from "./http.js"

export function sendRobotCommand(robotId, code){
    return api.post(`/robots/${robotId}/command`, {code: String(code)});
}
