import EErrors from '../../utils/erroresHandler/enums.js';

export default (error,req,res,next)=> {
  console.log(error.code);
  switch (error.code){
    case EErrors.INVALID_TYPES_ERROR:
      res.send({status:"error", error:error.name})
      break;
    case EErrors.DATABASE_ERROR:
      res.send({status:"error", error:error.name})
      break;
    case EErrors.ROUTING_ERROR:
      res.send({status:"error", error:error.name})
      break;
    default:
      res.send({status:"error", error:"Unhandled error"})

  }
}