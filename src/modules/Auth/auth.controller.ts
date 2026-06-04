import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
// import { AuthService } from "./auth.service";
// import sendResponse from "../../utils/sendResponse";

const createUser=async(req:Request,res:Response, next:NextFunction)=>{
   
    try{
  const result= await AuthService.createUserIntoDb(req.body)
  sendResponse(res,{
    statusCode:201,
    success:true,
    message:"User created",
    data:result,
  });
    }catch(error:any) {
    
      next(error);

    }
};

// const loginUser = async (req: Request, res: Response ,next:NextFunction) => {
 
//   try {
//     const result = await AuthService.loginUserIntoDb(req.body);

//     res.cookie("token", result.token, {
//       secure: false,
//       httpOnly: true,
//       sameSite: "strict", // none / strict / lax
//     });

//     sendResponse(res, {
//       statusCode: 201,
//       success: true,
//       message: "User logged in successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     // sendResponse(res, {
//     //   statusCode: 500,
//     //   success: false,
//     //   message: error?.message || "Something went wrong",
//     //   data: null,
//     // });
//         next(error)
//   }
// };



const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.loginUserIntoDb(req.body);

        // Cookie set to store the token in the browser (for web clients)
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            path: "/",
        });

        // API response to send the token (for mobile apps or server actions)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged in successfully",
            data: {
                user: result.user,
                token: result.token, //
            },
        });
    } catch (error: any) {
        next(error);
    }
};




  const getMe = async (req: Request, res: Response ,next:NextFunction) => {
  try {
    const result = await AuthService.getMe(req.user?.id as string);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });

  } catch (error: any) {
    // sendResponse(res, {
    //   statusCode: 500,
    //   success: false,
    //   message: error?.message || "Something went wrong",
    //   data: null,
    // });
    next(error)
  }
};



export const AuthController = {
    // Add controller methods here
    createUser,
    loginUser,
    getMe
    };