const globalError=(err,req,res,next)=>{
    return res
    .status(err.status||500)
    .json({message:err.message,status:err.status})
}

export default globalError