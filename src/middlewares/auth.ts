





import { NextFunction, Request, Response } from "express"
// import { secret } from "../modules/Auth/auth.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../modules/Auth/auth.service.js";
import { prisma } from "../lib/prisma.js";
// import { prisma } from "../lib/prisma";

export enum UserRole {
    admin = "ADMIN",
    tutor = "TUTOR",
    student = "STUDENT"
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token: string | undefined;

            //  Authorization header  (Bearer token)
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }

            
            if (!token && req.cookies?.token) {
                token = req.cookies.token;
            }

            // token don't found in both places
            if (!token) {
                throw new Error("Please login first");
            }

            console.log("Token found:", token.substring(0, 20) + "...");
            console.log("Cookies:", req.cookies);

            // Token verification
            const decoded = jwt.verify(token, secret) as JwtPayload;

            // user data database 
            const userData = await prisma.user.findUnique({
                where: {
                    email: decoded.email,
                },
            });

            if (!userData) {
                throw new Error("Unauthorized - User not found");
            }

            // user status check 
            if (userData.status !== "ACTIVE") {
                throw new Error("Unauthorized - Account is not active");
            }

            // role based access control
            if (roles.length && !roles.includes(decoded.role)) {
                throw new Error("Unauthorized - Insufficient permissions");
            }

            // user data req object  attach
            req.user = decoded;

            next();
        } catch (error: any) {
            
            if (error.name === 'JsonWebTokenError') {
                next(new Error("Invalid or expired token. Please login again."));
            } else if (error.name === 'TokenExpiredError') {
                next(new Error("Session expired. Please login again."));
            } else {
                next(error);
            }
        }
    };
};

export default auth;

