import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.admin],
    get: [roles.admin],
    delete: [roles.admin],
    update: [roles.admin],
}

