import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    getAll:[roles.admin],
    create: [roles.admin],
    update: [roles.admin],
    delete: [roles.admin]
}
