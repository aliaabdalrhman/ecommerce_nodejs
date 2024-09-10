import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.admin],
    update: [roles.admin],
    delete: [roles.admin]
}
