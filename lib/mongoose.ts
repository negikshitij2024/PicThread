import mongoose from 'mongoose'

let isConnected=false;

export const connecttoDb=async()=>{
 mongoose.set('strictQuery',true);

if(!process.env.MONGODB_URL){ return console.log()}
if(isConnected){ return console.log('Already connected')}

try{

    await mongoose.connect(process.env.MONGODB_URL);

    isConnected=true
    console.log("connected to db")
}
catch(error){console.log(error)
}


}