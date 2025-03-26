const gocardless = require('gocardless-nodejs');
const constants = require('gocardless-nodejs/constants');


class GoCardless{
    private client;
   constructor(){  
     this.client=gocardless(process.env.GOCARDLESS_ACCESSTOKEN,
    constants.Environments.Sandbox,
    {raiseOnIdempotencyConflict:true},
);}

getClient(){
    return this.client;
}
 
}

export default GoCardless;