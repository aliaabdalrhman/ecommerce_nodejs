import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    add: [roles.user],
    delete: [roles.user]
}