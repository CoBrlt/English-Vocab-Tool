class Response{
    constructor(data="", success=true, message="", notify=true){
        this.data = data
        this.success = success
        this.message = message
        this.notify = notify
    }

    set(data="", success=true, message="", notify=true){
        this.data = data
        this.success = success
        this.message = message
        notify = true
        this.notify = notify
    }
}

module.exports = Response;