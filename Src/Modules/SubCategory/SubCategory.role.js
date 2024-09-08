import { roles } from "../../Middelware/auth.js";

export const endPoints = {
    create: [roles.admin],
    update: [roles.admin],
    delete: [roles.admin]
}
