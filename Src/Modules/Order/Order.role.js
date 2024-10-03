import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.user],
    changeState: [roles.admin],
    delivery:[roles.admin],
    delete: [roles.user],
}

