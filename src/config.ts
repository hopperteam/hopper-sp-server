export namespace Config {
    export function loadConfig(){
        var data: any = {};
        data.port = getEnv(process.env.PORT, "PORT");
        data.mongoUri = getEnv(process.env.MONGOURI, "MONGOURI");
        data.passphrase = getEnv(process.env.PASSPHRASE, "PASSPHRASE");
        data.baseUrl = getEnv(process.env.BASEURL, "BASEURL");
        data.spRequestUrl = getEnv(process.env.SPREQUESTURL, "SPREQUESTURL");
        data.callbackUrl = getEnv(process.env.CALLBACKURL, "CALLBACKURL");
        data.redirectUrl = getEnv(process.env.REDIRECTURL, "REDIRECTURL");
        data.passphrase = getEnv(process.env.PASSPHRASE, "PASSPHRASE");
        data.notificationUrl = getEnv(process.env.NOTIFICATIONURL, "NOTIFICATIONURL");


        instance = new ConfigHolder(data);
    }

    class ConfigHolder {
        readonly port: number;
        readonly mongoUri: string;
        readonly passphrase: string;
        readonly baseUrl: string;
        readonly spRequestUrl: string;
        readonly callbackUrl: string;
        readonly redirectUrl: string;
        readonly notificationUrl: string;

        constructor(data: any) {
            this.port = data.port;
            this.mongoUri = data.mongoUri;
            this.passphrase = data.passphrase;
            this.baseUrl = data.baseUrl;
            this.spRequestUrl = data.spRequestUrl;
            this.callbackUrl = data.callbackUrl;
            this.redirectUrl = data.redirectUrl;
            this.notificationUrl = data.notificationUrl;
        }
    }

    function getEnv(key: any, name: string): any{
        if(!key){
            console.log("Missing " + name + " in environment definition");
            process.exit();
        }

        return key;
    }

    export let instance : ConfigHolder;
}