import { AnyObjectSchema } from "yup";
import { Request, Response, NextFunction } from "express";

export function validateBody(schema: AnyObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err: any) {
      res.status(400).json({ errors: err.errors || err.message });
    }
  };
}
