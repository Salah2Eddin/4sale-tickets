import Admin from '#modules/admins/models/Admin'
import User from '#modules/users/models/User'

export function isUser(obj: User | Admin) {
    return obj instanceof User
}


export function isAdmin(obj: User | Admin) {
    return obj instanceof Admin
}