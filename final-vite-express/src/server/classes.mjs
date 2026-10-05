export class GameData {
    constructor(id, host, guest) {
        this.id = id ?? 1738
        this.host = host ?? new User()
        this.guest = guest ?? new User()
    }
    getHostData() {
        return {...this.host.getData(), game_id : this.id}
    }
    getGuestData() {
        return {...this.guest.getData(), game_id : this.id}
    }
} 

export class User {
    constructor(user, role) {
        this.user = user ?? 'none';
        this.role = role ?? Role.NONE
    }  
    getData() {
        return {user: this.user}
    } 
} 

export const Role = {
    NONE: 'none',
    WAITING: 'waiting',
    HOST: 'host', 
    ANALOG: 'analog',
    DIGITAL: 'digital'
}