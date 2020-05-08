export namespace Config {
    export function loadConfig(){
        var data: any = {};
        data.port = getEnv(process.env.PORT, "PORT");
        data.mongoUri = getEnv(process.env.MONGOURI, "MONGOURI");

        instance = new ConfigHolder(data);
    }

    class ConfigHolder {
        readonly port: number;
        readonly mongoUri: string;

        constructor(data: any) {
            this.port = data.port;
            this.mongoUri = data.mongoUri;
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