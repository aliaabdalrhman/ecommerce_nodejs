import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    getAllUsers: [roles.admin],
    getUserData:[roles.user,roles.admin]
}
