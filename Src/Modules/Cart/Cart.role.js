import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    add: [roles.user],
    delete: [roles.user],
    get: [roles.user],
    update:[roles.user]

}