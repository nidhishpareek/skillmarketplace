import { AnyObjectSchema } from "yup";
import { Request, Response, NextFunction, RequestHandler } from "express";

export function validateBody(schema: AnyObjectSchema): RequestHandler {
  return async (req, res, next) => {
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
