import { ApiKey } from "./apiKey.type";
import { Server } from "./server.type";


export interface User {
    id:                     String;
    name:                   String;
    email:                  String;
    password:               String;
    profilePicture:         String;
    subscribed:             Boolean;

    servers:                Server[];
    apiKeys:                ApiKey[];
    
    created_at:             Date;
    updated_at:             Date;
}




// Mock data for the server monitoring app






