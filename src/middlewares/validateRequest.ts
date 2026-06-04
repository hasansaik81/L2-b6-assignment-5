// import { NextFunction, Request, Response } from 'express';
// import { AnyZodObject } from 'zod';
// import catchAsync from '../utils/catchAsync';
// // import catchAsync from '../utils/catchAsync';

// const validateRequest = (schema: AnyZodObject) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const parsed = await schema.parseAsync({
//       body: req.body,
//       cookies: req.cookies,
//     });

//     req.body = parsed.body;
//     req.cookies = parsed.cookies;

//     next();
//   });
// };

// export default validateRequest;






// import { NextFunction, Request, Response } from 'express';
// import { ZodObject } from 'zod'; // ✅ fix
// import catchAsync from '../utils/catchAsync';

// const validateRequest = (schema: ZodObject<any>) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const parsed = await schema.parseAsync({
//       body: req.body,
//       cookies: req.cookies,
//     });

//     req.body = parsed.body;
//     req.cookies = parsed.cookies;

//     next();
//   });
// };

// export default validateRequest;






import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import catchAsync from '../utils/catchAsync.js';
// import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: ZodObject<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    req.body = parsed.body;
    
    // ✅ এখানে 'as Record<string, any>' অথবা 'as any' দিয়ে টাইপ কাস্টিং করে দিন
    req.cookies = parsed.cookies as Record<string, any>;

    next();
  });
};

export default validateRequest;
